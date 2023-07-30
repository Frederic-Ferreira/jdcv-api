import { AppError, HttpCode } from '@/errors/AppError.js'
import { findProfile } from '@/services/user/index.js'
import { Response, Request } from 'express'

export const handleGetProfile = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'Missing the id for the profile',
    })
  }

  const profile = await findProfile(+id)

  if (!profile) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'No profile with this id exists',
    })
  }

  res.status(HttpCode.OK).json({
    message: 'Profile informations found.',
    profile,
  })
}
