import { AppError, HttpCode } from '@/errors/AppError.js'
import { findUserByEmail } from '@/services/user/index.js'
import { Response, Request } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'All fields are required',
    })
  }

  const user = await findUserByEmail(email)

  if (!user) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'No user with this email exists',
    })
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'Password is incorrect',
    })
  }

  if (!user.profile) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'This user account has been deleted',
    })
  }

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1w',
  })

  const userData = {
    id_user: user.id_user,
    id_profile: user.profile.id_profile,
    email: user.email,
    first_name: user.profile.first_name,
    last_name: user.profile.last_name,
    birthday: user.profile.birthday,
    description: user.profile.description,
    avatar: user.profile.avatar,
  }

  res.status(HttpCode.OK).json({
    message: 'User successfully logged in',
    token,
    user: userData,
  })
}
