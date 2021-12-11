import { Request, Response, Router } from 'express'
import { PassportStatic } from 'passport'
import { OpenApiPaths } from '../types'

export default function verification (router: Router, passport: PassportStatic): void {
  router.post('/verification',
    // passport.authenticate('jwtBearer', { session: false }),
    (req: Request<{}, {}, OpenApiPaths.Verification.RequestBody, {}>, res: Response) => {
      res.json(req.body)
    }
  )
}
