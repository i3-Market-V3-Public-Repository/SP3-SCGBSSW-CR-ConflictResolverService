import { Request, Response, Router } from 'express'
import { PassportStatic } from 'passport'
import { serve, setup } from 'swagger-ui-express'
import apiSpec from '../dist/spec/openapi.json'

export default function api (router: Router, passport: PassportStatic): void {
  router.use('/openapi.json', (req: Request, res: Response): void => {
    res.json(apiSpec)
  })
  router.use('/api', serve, setup(apiSpec))
}
