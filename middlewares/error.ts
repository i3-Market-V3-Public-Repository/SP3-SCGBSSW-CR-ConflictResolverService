import { NextFunction, Request, Response } from 'express'
import { HttpError } from 'express-openapi-validator/dist/framework/types'

export function errorMiddleware (err: HttpError, req: Request, res: Response, next: NextFunction): void {
  if (req.path !== undefined) {
    res.status(Number(err.status) ?? 400).json({
      error: err.name,
      error_description: err.message
    })
  } else {
    next(err)
  }
}
