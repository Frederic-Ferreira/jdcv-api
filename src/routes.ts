import 'express-async-errors'
import { NextFunction, Request, Response, Router } from 'express'
import { errorHandler } from '@/errors/ErrorHandler.js'
import { handleCreateUser } from './handlers/user/register.js'
import { handleLogin } from './handlers/user/login.js'
import { authenticate } from './middlewares/authenticate.js'
import { handleUpdateProfile } from './handlers/user/updateProfile.js'
import { handleDeleteProfile } from './handlers/user/deleteProfile.js'
import { handleCreateHousing } from './handlers/housing/createHousing.js'
import { handleCreateReservation } from './handlers/housing/createReservation.js'
import { handleDeleteReservation } from './handlers/housing/deleteReservation.js'
import { handleUpdateHousing } from './handlers/housing/updateHousing.js'
import { handleGetProfile } from './handlers/user/getProfile.js'

const router = Router()

// ------- USER ROUTES ---------

router.post('/api/register', handleCreateUser)
router.post('/api/login', handleLogin)
router.get('/api/profile/:id', handleGetProfile)
router.patch('/api/profile/:id', authenticate, handleUpdateProfile)
router.delete('/api/profile', authenticate, handleDeleteProfile)

// ------- HOUSING ROUTES --------

router.post('/api/housing', authenticate, handleCreateHousing)
router.patch('/api/housing', authenticate, handleUpdateHousing)
router.post('/api/reservation', authenticate, handleCreateReservation)
router.delete('/api/reservation', authenticate, handleDeleteReservation)

router.get('/api/test', authenticate, (_, res: Response) =>
  res.json({ message: 'Hello' }),
)

// router.get('/user/:id', async (_, res: Response) => {
//   if (!res.locals.user) {
//     throw new AppError({
//       httpCode: HttpCode.UNAUTHORIZED,
//       description: 'You must be logged in',
//       isOperational: true,
//     })
//   }

//   const user = await getUserFromDb()

//   if (!user) {
//     throw new AppError({
//       httpCode: HttpCode.NOT_FOUND,
//       description: 'User you are looking for does not exist',
//     })
//   }

//   res.json(user)
// })

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('Error encountered:', err.message || err)

  next(err)
})

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler.handleError(err, res)
  next()
})

export default router
