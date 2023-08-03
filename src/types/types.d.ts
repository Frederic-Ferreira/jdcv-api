import { Request } from 'express'

type Region =
  | 'auvergne_rhone_alpes'
  | 'bourgogne_franche_comte'
  | 'bretagne'
  | 'centre_val_de_loire'
  | 'corse'
  | 'grand_est'
  | 'hauts_de_france'
  | 'ile_de_france'
  | 'normandie'
  | 'nouvelle_aquitaine'
  | 'occitanie'
  | 'pays_de_la_loire'
  | 'provence_alpes_cote_d_azur'
  | 'guadeloupe'
  | 'martinique'
  | 'guyane'
  | 'la_reunion'
  | 'mayotte'

type Style =
  | 'maison'
  | 'hangar'
  | 'domaine'
  | 'insolite'
  | 'exterieur'
  | 'appartement'
  | 'grange'
  | 'chalet'
  | 'villa'
  | 'autre'

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
  post_code?: string
  gps?: string
  region?: Region
  nb_people?: number
  nb_room?: number
  start_date?: Date
  end_date?: Date
  price?: number
  style?: Style
  events?: string
  photos?: string
}

export type createHousingData = {
  id_user: number
  title: string
  description: string
  address: string
  post_code: string
  gps: string
  region: Region
  nb_people: number
  nb_room: number
  start_date: Date
  end_date: Date
  price: number
  style: Style
  events: string
  photos: string
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
