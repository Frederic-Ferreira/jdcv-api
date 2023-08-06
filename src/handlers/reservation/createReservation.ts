import { Response } from 'express'
import { uRequest } from '@/types/types.js'
import { AppError, HttpCode } from '@/errors/AppError.js'
import { createReservation } from '@/services/reservation/index.js'
import { findHousingDisponibility } from '@/services/housing/index.js'
import { createReservationData } from '@/types/types.js'

export const handleCreateReservation = async (req: uRequest, res: Response) => {
  const { id_user } = req.user

  const { id_housing, start_date, end_date } = req.body

  if (!id_housing || !start_date || !end_date) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'Missing parameters',
    })
  }

  const startDate = new Date(start_date)
  const endDate = new Date(end_date)

  if (endDate <= startDate) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'The end date must be after the start date',
      isOperational: true,
    })
  }

  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const disponibility = await findHousingDisponibility(
      id_housing,
      currentDate,
    )
    if (!disponibility) {
      throw new AppError({
        httpCode: HttpCode.NOT_FOUND,
        description: `The disponibility for the date: ${currentDate} does not exists`,
      })
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  const status = 'pending'

  const reservationData = {
    id_user,
    id_housing,
    start_date: new Date(start_date),
    end_date: new Date(end_date),
    status,
  } as createReservationData

  const reservation = await createReservation(reservationData)

  if (!reservation) {
    new AppError({
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      description: 'Error while creating the reservation',
    })
  }

  res.status(HttpCode.OK).json({
    message: 'Reservation created successfully',
    reservation,
  })
}
