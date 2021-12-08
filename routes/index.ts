'use strict'

import express, { RequestHandler } from 'express'
import passportPromise from '../passport'
import config from '../config'
import oidc from './oidc'
import verification from './verification'
import dispute from './dispute'

const router = express.Router()

export default async (): Promise<typeof router> => {
  /**
   * CORS
   */
  const cors: RequestHandler = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', config.api.allowedOrigin)
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.header('Allow', 'GET, POST, OPTIONS')
    next()
  }
  router.use(cors)

  const passport = await passportPromise()

  oidc(router, passport) // set up oidc routes

  verification(router, passport)

  dispute(router, passport)

  return router
}
