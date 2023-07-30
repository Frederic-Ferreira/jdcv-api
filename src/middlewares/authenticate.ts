import { Response, NextFunction } from 'express'
import { uRequest } from '@/types/types.js'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { AppError, HttpCode } from '@/errors/AppError.js'
import { findUser } from '@/services/user/index.js'

export const authenticate = async (
  req: uRequest,
  _: Response,
  next: NextFunction,
) => {
  const token = req.headers?.authorization

  if (!token) {
    throw new AppError({
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'You must be logged in',
    })
  }

  const decoded = jwt.verify(
    token as string,
    process.env.JWT_SECRET as string,
  ) as JwtPayload

  const user = await findUser(decoded.email)

  if (!user.profile) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'The user associated to this token does not (longer) exist',
    })
  }

  req.user = {
    id_user: user.id_user,
    id_profile: user.profile.id_profile,
    email: user.email,
    token,
    first_name: user.profile.first_name,
    last_name: user.profile.last_name,
    description: user.profile.description,
    birthday: user.profile.birthday,
    avatar: user.profile.avatar,
  }

  next()
}
