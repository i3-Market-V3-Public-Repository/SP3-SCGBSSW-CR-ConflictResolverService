import type { NextFunction, Request, Response } from 'express'
import type { HttpError } from 'express-openapi-validator/dist/framework/types'
import type { OpenApiComponents } from '../openapi'

export function errorMiddleware (err: HttpError, req: Request, res: Response, next: NextFunction): void {
  if (req.path !== undefined) {
    let error: OpenApiComponents.Schemas.ApiError = {
      name: 'error',
      description: 'something bad happened'
    }
    if (err.status === undefined) {
      console.error(err)
      err.status = 500
    } else {
      error = {
        name: err.name,
        description: err.message
      }
    }
    res.status(err.status).json(error)
  } else {
    next(err)
  }
}
