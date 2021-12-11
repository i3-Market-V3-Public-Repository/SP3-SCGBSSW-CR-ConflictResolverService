import * as OpenApiValidator from 'express-openapi-validator'
import pkgJson from '../package.json'

export const openApiValidatorMiddleware = OpenApiValidator.middleware({
  apiSpec: pkgJson.exports['./openapi.json'],
  validateResponses: true, // <-- to validate responses
  validateRequests: true // false by default
  // unknownFormats: ['my-format'] // <-- to provide custom formats
})
