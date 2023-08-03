import { Response } from 'express'
import { uRequest } from '@/types/types.js'
import { AppError, HttpCode } from '@/errors/AppError.js'
import {
  createHousing,
  createHousingDisponibility,
} from '@/services/housing/index.js'
import fs from 'fs'
import path from 'path'

export const handleCreateHousing = async (req: uRequest, res: Response) => {
  const { id_user } = req.user

  const {
    title,
    description,
    address,
    post_code,
    gps,
    region,
    nb_people,
    nb_room,
    start_date,
    end_date,
    price,
    style,
    photos,
    events,
  } = req.body

  if (
    !title ||
    !description ||
    !address ||
    !post_code ||
    !gps ||
    !region ||
    !nb_people ||
    !nb_room ||
    !start_date ||
    !end_date ||
    !price ||
    !style ||
    !photos ||
    !events
  ) {
    new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'Missing parameters',
      isOperational: true,
    })
  }

  let imgsName = ''

  if (photos !== '') {
    const photosData = photos.split('\n\n')
    const housingDir = path.join(process.cwd(), 'public/images')

    for (let i = 0; i < photosData.length; i++) {
      const name = new Date().getTime().toString() + '.png'
      imgsName += `${name}${i !== photosData.length - 1 ? ',' : ''}`
      const imgPath = path.join(housingDir, name)
      const data = Buffer.from(photosData[i], 'base64')

      try {
        await fs.writeFile(imgPath, data, () => {})
      } catch (error) {
        console.error(`Error saving photo: ${error.message}`)
        throw new AppError({
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
          description: `Error saving photo: ${error.message}`,
        })
      }
    }
  }

  const housingData = {
    id_user,
    title,
    description,
    address,
    post_code,
    gps,
    region,
    nb_people,
    nb_room,
    start_date,
    end_date,
    price,
    style,
    photos: imgsName,
    events,
  }

  const housing = await createHousing(housingData)

  if (!housing) {
    new AppError({
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      description: 'Error while creating housing',
    })
  }

  const startDate = new Date(start_date)
  const endDate = new Date(end_date)

  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const disponibilityData = {
      id_housing: housing.id_housing,
      date: currentDate,
    }

    const newDisponibility = await createHousingDisponibility(disponibilityData)

    if (!newDisponibility) {
      new AppError({
        httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: `There was a problem creating the disponibility for the date ${currentDate}`,
      })
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  res.status(HttpCode.OK).json({
    message: 'Housing created successfully',
    housing,
  })
}
