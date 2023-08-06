import { PrismaClient } from '@prisma/client'
import {
  createHousingData,
  createHousingDisponibilityData,
  updateHousingData,
} from '@/types/types.js'

const prisma = new PrismaClient()

function findHousingList(params) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereCondition = {} as any

  const { post_code, nb_people, events } = params

  if (post_code) {
    whereCondition.post_code = {
      startsWith: post_code.substring(0, 2),
    }
  }

  if (nb_people) {
    whereCondition.nb_people = {
      gte: +nb_people,
    }
  }

  if (events) {
    whereCondition.events = {
      hasSome: events.split(','),
    }
  }

  return prisma.housing.findMany({
    where: whereCondition,
    include: {
      disponibility: true,
    },
  })
}

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

export {
  findHousingList,
  findHousing,
  createHousing,
  updateHousing,
  createHousingDisponibility,
  findHousingDisponibility,
  deleteHousingDisponibility,
}
