import express from 'express'
import dispute from './dispute'
import verification from './verification'

const router = express.Router()

export default async (): Promise<typeof router> => {
  verification(router)
  dispute(router)

  return router
}
