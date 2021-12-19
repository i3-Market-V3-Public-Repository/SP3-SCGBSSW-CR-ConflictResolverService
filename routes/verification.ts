import { NextFunction, Request, Response, Router } from 'express'
import { PassportStatic } from 'passport'
import { OpenApiPaths } from '../types/openapi'
import crsPromise from '../conflictResolver'

export default function verification (router: Router, passport?: PassportStatic): void {
  const authMiddleware = (passport !== undefined) ? passport.authenticate('jwtBearer', { session: false }) : (req: Request, res: Response, next: NextFunction) => { next() }
  router.post('/verification',
    authMiddleware,
    async (req: Request<{}, {}, OpenApiPaths.Verification.RequestBody, {}>, res: Response<OpenApiPaths.Verification.Responses.$200>, next) => { // eslint-disable-line @typescript-eslint/no-misused-promises
      try {
        const crs = await crsPromise
        const signedResolution = await crs.resolveCompleteness(req.body.verificationRequest)
        res.json({
          signedResolution
        })
      } catch (error) {
        next(error)
      }
    }
  )
}
