import { OpenApiValidatorOpts } from 'express-openapi-validator/dist/openapi.validator'
import apiSpec from '../spec/openapi.json'
import { jwt } from './jwt'
import { oidc } from './oidc'

if (oidc.disable) {
  if (apiSpec.paths['/oidc/cb']?.get?.tags[0] !== undefined) {
    apiSpec.tags = apiSpec.tags.filter((value, index, arr) => {
      return value.name !== apiSpec.paths['/oidc/cb'].get.tags[0]
    })
  }
  // @ts-expect-error
  delete apiSpec.paths['/oidc/cb']
  // @ts-expect-error
  delete apiSpec.paths['/oidc/login/consumer']
  // @ts-expect-error
  delete apiSpec.paths['/oidc/login/provider']
  // @ts-expect-error
  delete apiSpec.components.securitySchemes.OpenIdConnect
} else {
  apiSpec.components.securitySchemes.OpenIdConnect.openIdConnectUrl = (oidc.oidcConfig?.providerUri ?? 'OIDC_PROVIDER_URI_NOT_SET') + '/.well-known/openid-configuration'
}

if (jwt.disable) {
  for (const path in { ...apiSpec.paths }) {
    if (path.substring(0, 5) !== '/oidc') {
      try {
        // @ts-expect-error
        delete apiSpec.paths[path].post.security
      } catch (e) {}
    }
  }
  // @ts-expect-error
  delete apiSpec.components.securitySchemes.BearerAuth
}

export const openApi: OpenApiValidatorOpts = {
  apiSpec: apiSpec as unknown as OpenApiValidatorOpts['apiSpec'],
  validateResponses: true, // <-- to validate responses
  validateRequests: true // false by default
}
