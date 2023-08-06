import { Response } from 'express'
import { uRequest } from '@/types/types.js'
import { AppError, HttpCode } from '@/errors/AppError.js'
import {
  findReservation,
  deleteReservation,
  deletePayment,
} from '@/services/reservation/index.js'
import { createHousingDisponibility } from '@/services/housing/index.js'

export const handleDeleteReservation = async (req: uRequest, res: Response) => {
  const { id_user } = req.user

  const { id_reservation } = req.body

  if (!id_reservation) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'Missing parameters',
    })
  }
  const reservation = await findReservation(id_reservation)

  if (!reservation) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'This reservation does not exists',
    })
  }

  if (reservation.id_user !== id_user) {
    throw new AppError({
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'You are not the owner of this reservation',
    })
  }

  const { id_payment } = reservation.payment

  await deletePayment(id_payment)

  await deleteReservation(id_reservation)

  const { start_date, end_date, id_housing } = reservation

  const startDate = new Date(start_date)
  const endDate = new Date(end_date)

  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const disponibility = await createHousingDisponibility({
      id_housing,
      date: currentDate,
    })
    if (!disponibility) {
      throw new AppError({
        httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: `There was a problem creating the disponibility for the date ${currentDate}`,
      })
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  res.status(HttpCode.OK).json({
    message: 'Reservation deleted successfully',
  })
}
