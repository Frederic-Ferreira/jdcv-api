import { HttpCode } from '@/errors/AppError.js'
import { Response } from 'express'
import { uRequest } from '@/types/types.js'
import { findHousingList } from '@/services/housing/index.js'

export const handleGetHousingList = async (req: uRequest, res: Response) => {
  // should be a string
  const { post_code } = req.body
  console.log(post_code)

  const housingList = await findHousingList(post_code)

  res.status(HttpCode.OK).json({
    message: 'Housing List found',
    housingList,
    total: housingList.length,
  })
}
