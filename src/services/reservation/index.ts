import { PrismaClient } from '@prisma/client'
import {
  createReservationData,
  paymentData,
  updateReservationData,
} from '@/types/types.js'

const prisma = new PrismaClient()

function createReservation(data: createReservationData) {
  return prisma.reservation.create({
    data,
  })
}

function updateReservation(id: number, data: updateReservationData) {
  return prisma.reservation.update({
    where: {
      id_reservation: id,
    },
    data,
  })
}

function findReservation(id_reservation: number) {
  return prisma.reservation.findUnique({
    where: {
      id_reservation,
    },
    include: {
      payment: true,
    },
  })
}

function deleteReservation(id_reservation: number) {
  return prisma.reservation.delete({
    where: {
      id_reservation,
    },
  })
}

function createPayment(data: paymentData) {
  return prisma.payment.create({
    data,
  })
}

function deletePayment(id_payment: number) {
  return prisma.payment.delete({
    where: {
      id_payment,
    },
  })
}

export {
  createReservation,
  updateReservation,
  findReservation,
  createPayment,
  deletePayment,
  deleteReservation,
}
