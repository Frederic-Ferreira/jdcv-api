import 'express-async-errors'
import { NextFunction, Request, Response, Router } from 'express'
import { errorHandler } from '@/errors/ErrorHandler.js'
import { handleCreateUser } from './handlers/user/register.js'
import { handleLogin } from './handlers/user/login.js'
import { authenticate } from './middlewares/authenticate.js'
import { handleUpdateProfile } from './handlers/user/updateProfile.js'
import { handleDeleteProfile } from './handlers/user/deleteProfile.js'
import { handleCreateHousing } from './handlers/housing/createHousing.js'
import { handleCreateReservation } from './handlers/reservation/createReservation.js'
import { handleDeleteReservation } from './handlers/reservation/deleteReservation.js'
import { handleUpdateHousing } from './handlers/housing/updateHousing.js'
import { handleGetProfile } from './handlers/user/getProfile.js'
import { handleGetHousingList } from './handlers/housing/getHousingList.js'
import { handleGetHousing } from './handlers/housing/getHousing.js'
import { handleCreateStripeSession } from './handlers/reservation/stripeSession.js'
import { handleUpdateReservation } from './handlers/reservation/updateReservation.js'

const router = Router()

// ------- USER ROUTES ---------

router.post('/api/register', handleCreateUser)
router.post('/api/login', handleLogin)
router.get('/api/profile/:id', handleGetProfile)
router.patch('/api/profile/:id', authenticate, handleUpdateProfile)
router.delete('/api/profile', authenticate, handleDeleteProfile)

// ------- HOUSING ROUTES --------

router.get('/api/housing/:id', handleGetHousing)
router.get('/api/housing', handleGetHousingList)
router.post('/api/housing', authenticate, handleCreateHousing)
router.patch('/api/housing', authenticate, handleUpdateHousing)

// ------- RESERVATION ROUTES --------

router.post('/api/stripe/:id', authenticate, handleCreateStripeSession)
router.post('/api/reservation', authenticate, handleCreateReservation)
router.patch('/api/reservation/:id', authenticate, handleUpdateReservation)
router.delete('/api/reservation', authenticate, handleDeleteReservation)

// ------- ERROR HANDLING MIDDLEWARES --------

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('Error encountered:', err.message || err)
  next(err)
})

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler.handleError(err, res)
  next()
})

export default router
