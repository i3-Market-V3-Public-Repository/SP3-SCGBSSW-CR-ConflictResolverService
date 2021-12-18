import { Request, Response, Router } from 'express'
import { PassportStatic } from 'passport'
import { OpenApiPaths } from '../types/openapi'
import crsPromise from '../conflictResolver'

export default function dispute (router: Router, passport: PassportStatic): void {
  router.post('/dispute',
    // passport.authenticate('jwtBearer', { session: false }),
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
