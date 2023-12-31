/* eslint-disable no-console */
import http from 'http'
import express, { Application } from 'express'
import { createHttpTerminator } from 'http-terminator'
import { PrismaClient } from '@prisma/client'
import router from './src/routes.js'
import cors from 'cors'
import path from 'path'
import Stripe from 'stripe'

import './src/process.js'

const app: Application = express()
const port = process.env.PORT || 3001
export const server = http.createServer(app)
export const httpTerminator = createHttpTerminator({
  server,
})
export const prisma = new PrismaClient()
export const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: '2022-11-15',
})

async function testDBConnection() {
  try {
    // Try to connect to the database by making a simple query
    await prisma.$connect()
    console.log('Database connection successful!')
  } catch (error) {
    console.error('Error connecting to the database:', error)
    process.exit(1) // Exit the process with an error code (non-zero) on connection failure
  }
}

app.use(
  '/api/images',
  express.static(path.join(process.cwd(), 'public/images')),
)
app.use(express.json({ limit: '50mb' }))
app.use(cors())
app.use(router)

testDBConnection().then(() => {
  server.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
})
