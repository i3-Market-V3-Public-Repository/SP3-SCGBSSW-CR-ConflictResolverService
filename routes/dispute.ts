import { Request, Response, Router } from 'express'
import crsPromise from '../conflictResolver'
import { OpenApiPaths } from '../types/openapi'

export default function dispute (router: Router): void {
  router.post('/dispute',
    async (req: Request<{}, {}, OpenApiPaths.Dispute.Post.RequestBody, {}>, res: Response<OpenApiPaths.Dispute.Post.Responses.$200>, next) => { // eslint-disable-line @typescript-eslint/no-misused-promises
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
