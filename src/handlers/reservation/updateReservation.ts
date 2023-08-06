import { Response } from 'express'
import { uRequest } from '@/types/types.js'
import { AppError, HttpCode } from '@/errors/AppError.js'
import {
  createPayment,
  updateReservation,
} from '@/services/reservation/index.js'
import { deleteHousingDisponibility } from '@/services/housing/index.js'
import { Status } from '@prisma/client'

export const handleUpdateReservation = async (req: uRequest, res: Response) => {
  const { id } = req.params
  const { price } = req.body

  if (!id || !price) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'Missing parameters',
    })
  }

  const payment = await createPayment({
    id_reservation: +id,
    amount: +price,
    method: 'card',
    status: Status.approved,
  })

  if (!payment) {
    throw new AppError({
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      description: 'Error while creating the payment',
    })
  }

  const reservation = await updateReservation(+id, { status: Status.approved })

  if (!reservation) {
    new AppError({
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      description: 'Error while updating the reservation',
    })
  }

  if (reservation.status === Status.approved) {
    const currentDate = new Date(reservation.start_date)
    while (currentDate <= new Date(reservation.end_date)) {
      await deleteHousingDisponibility(reservation.id_housing, currentDate)

      currentDate.setDate(currentDate.getDate() + 1)
    }
  }

  res.status(HttpCode.OK).json({
    message: 'Reservation updated successfully',
    reservation,
  })
}
