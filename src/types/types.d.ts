import { Request } from 'express'

type Style =
  | 'maison'
  | 'villa'
  | 'chalet'
  | 'domaine'
  | 'insolite'
  | 'exterieur'

type Event = 'apero' | 'barbecue' | 'anniversaire' | 'mariage' | 'fete' | 'date'

type Note = 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE'

type Status = 'pending' | 'canceled' | 'approved'

type Method = 'card' | 'paypal'

type reqUser = {
  id_user?: number
  id_profile?: number
  email?: string
  token?: string
  first_name?: string
  last_name?: string
  birthday?: Date
  description?: string
  avatar?: string
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface uRequest extends Request {
  user: reqUser
}

export type profileData = {
  first_name?: string
  last_name?: string
  birthday?: Date
  description?: string
  avatar?: string
}

export type updateHousingData = {
  id_housing: number
  title?: string
  description?: string
  address?: string
  nb_people?: number
  start_date?: Date
  end_date?: Date
  price?: number
  style?: Style
  event?: Event
  photos?: string
  equipments?: string
}

export type createHousingData = {
  id_user: number
  title: string
  description: string
  address: string
  nb_people: number
  start_date: Date
  end_date: Date
  price: number
  style: Style
  event: Event
  photos: string
  equipments: string
}

export type createHousingDisponibilityData = {
  id_housing: number
  date: Date
}

export type createReservationData = {
  id_user: number
  id_housing: number
  start_date: Date
  end_date: Date
  status: Status
  method: Method
  amount: number
  payment_status: Status
}
