import { NextFunction, Request, Response } from 'express'
import { HttpError } from 'express-openapi-validator/dist/framework/types'
import { OpenApiComponents } from '../types/index'

export function errorMiddleware (err: HttpError, req: Request, res: Response, next: NextFunction): void {
  if (req.path !== undefined) {
    const error: OpenApiComponents.Schemas.ApiError = {
      name: err.name,
      description: err.message
    }
    res.status(Number(err.status) ?? 400).json(error)
  } else {
    next(err)
  }
}
