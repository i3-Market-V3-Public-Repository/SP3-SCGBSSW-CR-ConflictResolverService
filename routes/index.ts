import express from 'express'
import passportPromise from '../passport'
import dispute from './dispute'
import oidc from './oidc'
import { oidc as oidcConfig } from '../config'
import verification from './verification'
import { PassportStatic } from 'passport'

const router = express.Router()

export default async (): Promise<typeof router> => {
  const passport = await passportPromise

  if (!oidcConfig.disable) {
    oidc(router, passport as PassportStatic) // set up oidc routes
  }

  verification(router, passport)

  dispute(router, passport)

  return router
}
