import { AppError, HttpCode } from '@/errors/AppError.js'
import { createUser, findUser } from '@/services/user/index.js'
import { Response, Request } from 'express'
import bcrypt from 'bcryptjs'

export const handleCreateUser = async (req: Request, res: Response) => {
  const { email, password, first_name, last_name, birthday } = req.body

  if (!email || !password || !first_name || !last_name || !birthday) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'All fields are required',
    })
  }

  const existingUser = await findUser(email)

  if (existingUser) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'A user with this email address already exists',
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await createUser(
    email,
    hashedPassword,
    first_name,
    last_name,
    birthday,
  )

  if (!user) {
    throw new AppError({
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      description: 'Something went wrong',
    })
  }

  res.status(HttpCode.OK).json({
    message: 'User created successfully',
  })
}
