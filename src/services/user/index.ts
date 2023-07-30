import { PrismaClient } from '@prisma/client'
import { profileData } from '@/types/types.js'

const prisma = new PrismaClient()

function findUser(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      profile: true,
    },
  })
}

function createUser(
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  birthday: Date,
) {
  return prisma.user.create({
    data: {
      email,
      password,
      profile: {
        create: {
          first_name,
          last_name,
          birthday,
        },
      },
    },
  })
}

function updateProfile(id_user: number, data: profileData) {
  return prisma.profile.update({
    where: {
      id_user,
    },
    data,
  })
}

function deleteProfile(id_user: number) {
  return prisma.profile.delete({
    where: {
      id_user,
    },
  })
}

export { findUser, createUser, updateProfile, deleteProfile }
