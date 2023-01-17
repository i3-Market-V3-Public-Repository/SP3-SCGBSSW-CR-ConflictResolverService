import { Request, Response, Router } from 'express'
import crsPromise from '../conflictResolver'
import { OpenApiPaths } from '../../types/openapi'

export default function verification (router: Router): void {
  router.post('/verification',
    async (req: Request<{}, {}, OpenApiPaths.Verification.Post.RequestBody, {}>, res: Response<OpenApiPaths.Verification.Post.Responses.$200>, next) => { // eslint-disable-line @typescript-eslint/no-misused-promises
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
