import { Response } from 'express'
import { uRequest } from '@/types/types.js'
import { AppError, HttpCode } from '@/errors/AppError.js'
import {
  findHousing,
  createHousingDisponibility,
  updateHousing,
  deleteHousingDisponibility,
} from '@/services/housing/index.js'

export const handleUpdateHousing = async (req: uRequest, res: Response) => {
  const { id_user } = req.user

  const {
    id_housing,
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
    !id_housing ||
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
    })
  }

  const housing = await findHousing(id_housing)

  if (!housing) {
    new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Housing not found',
    })
  }

  if (id_user !== housing.id_user) {
    new AppError({
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'You are not allowed to update this housing',
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
    id_housing,
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

  const updatedHousing = await updateHousing(housingData)

  if (!updatedHousing) {
    new AppError({
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      description: 'Error while updating the housing',
    })
  }

  const formerStartDate = new Date(housing.start_date)
  const formerEndDate = new Date(housing.end_date)

  if (startDate !== formerStartDate || endDate !== formerEndDate) {
    const currentDate = new Date(formerStartDate)

    while (currentDate <= formerEndDate) {
      const formerDisponibility = await deleteHousingDisponibility(
        id_housing,
        currentDate,
      )
      if (!formerDisponibility) {
        new AppError({
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
          description: `There was a problem deleting the disponibility for the date ${currentDate}`,
        })
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
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
    message: 'Housing updated successfully',
    updateHousing,
  })
}
