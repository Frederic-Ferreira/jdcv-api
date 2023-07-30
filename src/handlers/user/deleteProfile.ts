import { HttpCode } from '@/errors/AppError.js'
import { deleteProfile } from '@/services/user/index.js'
import { Response } from 'express'
import { uRequest } from '@/types/types.js'

export const handleDeleteUser = async (req: uRequest, res: Response) => {
  const { id_user } = req.user

  await deleteProfile(id_user)

  req.user = {}

  res.status(HttpCode.OK).json({
    message: 'User profile deleted successfully',
  })
}
