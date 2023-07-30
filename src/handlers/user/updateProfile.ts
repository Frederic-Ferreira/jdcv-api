import { AppError, HttpCode } from '@/errors/AppError.js'
import { findUser, updateProfile } from '@/services/user/index.js'
import { Response } from 'express'
import { profileData, uRequest } from '@/types/types.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

export const handleUpdateProfile = async (req: uRequest, res: Response) => {
  const { first_name, last_name, birthday, description, avatar } = req.body

  const { id } = req.params

  if (!first_name && !last_name && !birthday && !description && !avatar) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'At least one field is required',
    })
  }

  const { id_profile, email } = req.user

  if (+id !== id_profile) {
    throw new AppError({
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'You are not authorized to modify this profile.',
    })
  }

  let imgName = ''

  if (typeof avatar === 'string' && avatar.startsWith('data:image/')) {
    imgName = new Date().getTime().toString() + '.png'
    const imgPath = path.join(__dirname, '../../../../public/images/', imgName)
    const writeStream = fs.createWriteStream(imgPath)

    const data = avatar.split(',')[1]
    writeStream.write(data)
  }

  const updatedFields: profileData = {
    ...(first_name !== undefined && { first_name }),
    ...(last_name !== undefined && { last_name }),
    ...(birthday !== undefined && { birthday }),
    ...(description !== undefined && { description }),
    ...(avatar !== undefined && { avatar: imgName }),
  }

  const updatedProfile = await updateProfile(+id, updatedFields)

  if (!updatedProfile) {
    throw new AppError({
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      description: 'There was a problem updating the profile informations.',
    })
  }

  const updatedUser = await findUser(email)

  if (JSON.stringify(updatedProfile) !== JSON.stringify(updatedUser.profile)) {
    throw new AppError({
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      description: 'The profile has not been updated correctly.',
    })
  }

  req.user = {
    ...req.user,
    first_name: updatedUser.profile.first_name,
    last_name: updatedUser.profile.last_name,
    description: updatedUser.profile.description,
    birthday: updatedUser.profile.birthday,
    avatar: updatedUser.profile.avatar,
  }

  const userData = {
    id_user: updatedUser.id_user,
    id_profile: updatedUser.profile.id_profile,
    email: updatedUser.email,
    first_name: updatedUser.profile.first_name,
    last_name: updatedUser.profile.last_name,
    birthday: updatedUser.profile.birthday,
    description: updatedUser.profile.description,
    avatar: updatedUser.profile.avatar,
  }

  res.status(HttpCode.OK).json({
    message: 'User profile updated successfully',
    user: userData,
  })
}
