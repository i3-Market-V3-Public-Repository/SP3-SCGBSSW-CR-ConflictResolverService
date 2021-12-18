import express from 'express'
import passportPromise from '../passport'
import dispute from './dispute'
import oidc from './oidc'
import verification from './verification'

const router = express.Router()

export default async (): Promise<typeof router> => {
  const passport = await passportPromise

  oidc(router, passport) // set up oidc routes

  verification(router, passport)

  dispute(router, passport)

  return router
}
