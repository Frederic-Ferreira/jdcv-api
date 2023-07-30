import { Response } from 'express'
import { uRequest } from '@/types/types.js'
import { AppError, HttpCode } from '@/errors/AppError.js'
import {
  createHousing,
  createHousingDisponibility,
} from '@/services/housing/index.js'

export const handleCreateHousing = async (req: uRequest, res: Response) => {
  const { id_user } = req.user

  const {
    title,
    description,
    address,
    nb_people,
    start_date,
    end_date,
    price,
    style,
    event,
    photos,
    equipments,
  } = req.body

  if (
    !title ||
    !description ||
    !address ||
    !nb_people ||
    !start_date ||
    !end_date ||
    !price ||
    !style ||
    !event ||
    !photos ||
    !equipments
  ) {
    new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'Missing parameters',
      isOperational: true,
    })
  }

  const startDate = new Date(start_date)
  const endDate = new Date(end_date)

  if (endDate <= startDate) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'The end date must be after the start date',
    })
  }

  const housingData = {
    id_user,
    title,
    description,
    address,
    nb_people,
    start_date,
    end_date,
    price,
    style,
    event,
    photos,
    equipments,
  }

  const housing = await createHousing(housingData)

  if (!housing) {
    new AppError({
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      description: 'Error while creating housing',
    })
  }

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
