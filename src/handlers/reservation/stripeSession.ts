import { HttpCode, AppError } from '@/errors/AppError.js'
import { Request, Response } from 'express'
import { stripeSessionData } from '@/types/types.js'
import { stripe } from 'index.js'

const storeItems = new Map([
  [29, { priceInCents: 1200, name: 'Number 3 House' }],
  [2, { priceInCents: 20000, name: 'Learn CSS Today' }],
])

export const handleCreateStripeSession = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params
  const { id_housing } = req.body

  let session
  try {
    session = await stripe.checkout.sessions.create({
      line_items: req.body.items.map((item: stripeSessionData) => {
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: storeItem.name,
            },
            unit_amount: item.price,
          },
          quantity: 1,
        }
      }),
      mode: 'payment',
      success_url: `http://localhost:3000/reservation/${id}`,
      cancel_url: `http://localhost:3000/reservation?id=${id_housing}`,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('error stripe :', err)
    throw new AppError({
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      description: 'Error while creating the stripe session',
    })
  }

  res.status(HttpCode.OK).json({ url: session.url, session })
}
