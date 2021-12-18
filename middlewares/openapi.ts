import * as OpenApiValidator from 'express-openapi-validator'
import { openApiValidator } from '../config'
export const openApiValidatorMiddleware = OpenApiValidator.middleware({
  ...openApiValidator
  // formats: [
  //   {
  //     name: 'compact-jws',
  //     type: 'string',
  //     validate: (input: string): boolean => {
  //       const matched = input.match(/^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/)
  //       return matched !== null
  //     }
  //   }
  // ]
})
