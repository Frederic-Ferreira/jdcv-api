import { AppError, HttpCode } from '@/errors/AppError.js'
import { findUser, updateProfile } from '@/services/user/index.js'
import { Response } from 'express'
import { profileData, uRequest } from '@/types/types.js'

export const handleUpdateUser = async (req: uRequest, res: Response) => {
  const { first_name, last_name, birthday, description, avatar } = req.body

  if (!first_name && !last_name && !birthday && !description && !avatar) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'At least one field is required',
    })
  }

  const updatedFields: profileData = {
    ...(first_name !== undefined && { first_name }),
    ...(last_name !== undefined && { last_name }),
    ...(birthday !== undefined && { birthday }),
    ...(description !== undefined && { description }),
    ...(avatar !== undefined && { avatar }),
  }

  const { id_user, email } = req.user

  const updatedProfile = await updateProfile(id_user, updatedFields)

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

  res.status(HttpCode.OK).json({
    message: 'User profile updated successfully',
    user: updatedUser,
  })
}
