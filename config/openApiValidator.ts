import { OpenApiValidatorOpts } from 'express-openapi-validator/dist/openapi.validator'
import pkgJson from '../package.json'

export const openApiValidator: OpenApiValidatorOpts = {
  apiSpec: pkgJson.exports['./openapi.yaml'],
  validateResponses: true, // <-- to validate responses
  validateRequests: true // false by default
}
