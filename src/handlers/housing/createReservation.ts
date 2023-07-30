import { Response } from 'express'
import { uRequest } from '@/types/types.js'
import { AppError, HttpCode } from '@/errors/AppError.js'
import {
  findHousingDisponibility,
  deleteHousingDisponibility,
  createReservation,
} from '@/services/housing/index.js'
import { createReservationData } from '@/types/types.js'
import { Status } from '@prisma/client'

export const handleCreateReservation = async (req: uRequest, res: Response) => {
  const { id_user } = req.user

  const { id_housing, start_date, end_date, method, amount, payment_status } =
    req.body

  if (
    !id_housing ||
    !start_date ||
    !end_date ||
    !method ||
    !amount ||
    !payment_status
  ) {
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

  let status = 'pending'

  if (payment_status === 'approved') {
    status = 'approved'
  }

  const reservationData = {
    id_user,
    id_housing,
    start_date,
    end_date,
    status,
    method,
    amount,
    payment_status,
  } as createReservationData

  const reservation = await createReservation(reservationData)

  if (!reservation) {
    new AppError({
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      description: 'Error while creating the reservation',
    })
  }

  if (reservation.status === Status.approved) {
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      await deleteHousingDisponibility(id_housing, currentDate)

      currentDate.setDate(currentDate.getDate() + 1)
    }
  }

  res.status(HttpCode.OK).json({
    message: 'Reservation created successfully',
    reservation,
  })
}
