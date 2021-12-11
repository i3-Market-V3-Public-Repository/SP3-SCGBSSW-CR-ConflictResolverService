import { Request, Response, Router } from 'express'
import { PassportStatic } from 'passport'
import { OpenApiPaths } from '../types'

export default function dispute (router: Router, passport: PassportStatic): void {
  router.post('/dispute',
    // passport.authenticate('jwtBearer', { session: false }),
    (req: Request<{}, {}, OpenApiPaths.Dispute.RequestBody, {}>, res: Response) => {
      res.json(req.body)
    }
  )
}
