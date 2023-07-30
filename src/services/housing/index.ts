import { PrismaClient } from '@prisma/client'
import {
  createHousingData,
  createHousingDisponibilityData,
  createReservationData,
  updateHousingData,
} from '@/types/types.js'

const prisma = new PrismaClient()

function findHousing(id_housing: number) {
  return prisma.housing.findFirst({
    where: {
      id_housing,
    },
  })
}

function createHousing(data: createHousingData) {
  return prisma.housing.create({
    data,
  })
}

function updateHousing(data: updateHousingData) {
  return prisma.housing.update({
    where: {
      id_housing: data.id_housing,
    },
    data,
  })
}

function createReservation(data: createReservationData) {
  const {
    id_user,
    id_housing,
    start_date,
    end_date,
    status,
    method,
    amount,
    payment_status,
  } = data
  return prisma.reservation.create({
    data: {
      id_user,
      id_housing,
      start_date,
      end_date,
      status,
      payment: {
        create: {
          method,
          amount,
          status: payment_status,
        },
      },
    },
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

function createHousingDisponibility(data: createHousingDisponibilityData) {
  return prisma.housing_Disponibility.create({
    data,
  })
}

function findHousingDisponibility(id_housing: number, date: Date) {
  return prisma.housing_Disponibility.findFirst({
    where: {
      id_housing: { equals: id_housing },
      date: { equals: date },
    },
  })
}

function deleteHousingDisponibility(id_housing: number, date: Date) {
  return prisma.housing_Disponibility.deleteMany({
    where: {
      id_housing: { equals: id_housing },
      date: { equals: date },
    },
  })
}

function deletePayment(id_payment: number) {
  return prisma.payment.delete({
    where: {
      id_payment,
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

export {
  findHousing,
  createHousing,
  updateHousing,
  createHousingDisponibility,
  findHousingDisponibility,
  deleteHousingDisponibility,
  createReservation,
  findReservation,
  deletePayment,
  deleteReservation,
}
