import { AppError, HttpCode } from '@/errors/AppError.js'
import { Response } from 'express'
import { uRequest } from '@/types/types.js'
import { findHousing } from '@/services/housing/index.js'
import { findUserById } from '@/services/user/index.js'

export const handleGetHousing = async (req: uRequest, res: Response) => {
  const { id } = req.params

  const housing = await findHousing(+id)

  if (!housing) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Housing you are looking for does not exist',
    })
  }

  const owner = await findUserById(housing.id_user)

  res.status(HttpCode.OK).json({
    message: 'Housing found',
    housing,
    owner: owner.profile,
  })
}
