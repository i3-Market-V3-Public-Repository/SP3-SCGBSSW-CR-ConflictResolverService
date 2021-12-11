import * as OpenApiValidator from 'express-openapi-validator'
import pkgJson from '../package.json'

export const openApiValidatorMiddleware = OpenApiValidator.middleware({
  apiSpec: pkgJson.exports['./openapi.yaml'],
  validateResponses: false, // <-- to validate responses
  validateRequests: true // false by default
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
