import { NextFunction, Request, Response, Router } from 'express'
import { PassportStatic } from 'passport'
import { OpenApiPaths } from '../types/openapi'
import crsPromise from '../conflictResolver'

export default function dispute (router: Router, passport?: PassportStatic): void {
  const authMiddleware = (passport !== undefined) ? passport.authenticate('jwtBearer', { session: false }) : (req: Request, res: Response, next: NextFunction) => { next() }
  router.post('/dispute',
    authMiddleware,
    async (req: Request<{}, {}, OpenApiPaths.Dispute.RequestBody, {}>, res: Response<OpenApiPaths.Dispute.Responses.$200>, next) => { // eslint-disable-line @typescript-eslint/no-misused-promises
      try {
        const crs = await crsPromise
        const signedResolution = await crs.resolveDispute(req.body.disputeRequest)
        res.json({
          signedResolution
        })
      } catch (error) {
        next(error)
      }
    }
  )
}
