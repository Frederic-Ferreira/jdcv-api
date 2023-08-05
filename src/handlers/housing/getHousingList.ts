import { HttpCode } from '@/errors/AppError.js'
import { Response } from 'express'
import { uRequest } from '@/types/types.js'
import { findHousingList } from '@/services/housing/index.js'

export const handleGetHousingList = async (req: uRequest, res: Response) => {
  const { start_date, end_date } = req.query

  let housingList = []

  housingList = await findHousingList(req.query)

  if (start_date && end_date) {
    housingList = housingList.filter(housing => {
      const { disponibility } = housing
      if (disponibility.length === 0) return false
      const startQueryDate = new Date(start_date as string)
      const endQueryDate = new Date(end_date as string)
      const endDispoIndex = disponibility.length - 1
      const startDispoDate = new Date(disponibility[0].date)
      const endDispoDate = new Date(disponibility[endDispoIndex].date)

      // If there is more than two disponibility dates
      if (disponibility.length > 1) {
        // If the disponibility dates are not in the range or equal to the query dates
        if (
          startDispoDate.getTime() > startQueryDate.getTime() ||
          endDispoDate.getTime() < endQueryDate.getTime()
        ) {
          return false
        }
        // If the first disponibility date is not equal to the query start date
        if (startQueryDate.getTime() != startDispoDate.getTime()) {
          while (startQueryDate.getTime() != startDispoDate.getTime()) {
            startQueryDate.setDate(startQueryDate.getDate() - 1)
          }
        }

        // Check if every date between the query range is available (disponibility date)
        let available
        for (const dispo of disponibility) {
          const dispoDate = new Date(dispo.date)
          available = startQueryDate.getTime() === dispoDate.getTime()
          if (!available) break
          startQueryDate.setDate(startQueryDate.getDate() + 1)
        }
        return available
      }
      // If there is one disponibility date
      else {
        if (
          startQueryDate.getTime() !== endQueryDate.getTime() ||
          startDispoDate.getTime() !== startQueryDate.getTime()
        ) {
          return false
        }
        return true
      }
    })
  }

  res.status(HttpCode.OK).json({
    message: 'Housing List found',
    housingList,
    total: housingList.length,
  })
}
