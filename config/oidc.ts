import { config as loadEnvFile } from 'dotenv'
import { existsSync } from 'fs'
import { ClientMetadata } from 'openid-client'
import { parseProccessEnvVar } from './parseProcessEnvVar'
import { server } from './server'
import { jwt } from './jwt'

if (existsSync('./.env')) loadEnvFile()

const disable = parseProccessEnvVar('OIDC_DISABLE', { defaultValue: false, isBoolean: true }) as boolean

export interface OidcConfig {
  providerUri: string
  client: ClientMetadata
}
let oidcConfig: OidcConfig | undefined

if (!disable) {
  if (jwt.disable) {
    throw new RangeError('OIDC login requires JWT auth to be enabled')
  }
  oidcConfig = {
    providerUri: parseProccessEnvVar('OIDC_PROVIDER_URI') as string,
    client: {
      client_id: parseProccessEnvVar('OIDC_CLIENT_ID') as string,
      client_secret: parseProccessEnvVar('OIDC_CLIENT_SECRET') as string,
      redirect_uris: [`${server.publicUri}/oidc/cb`],
      application_type: 'web',
      grant_types: ['authorization_code'],
      response_types: ['code'],
      token_endpoint_auth_method: 'client_secret_jwt', // One of 'none' (only for PKCE), 'client_secret_basic', 'client_secret_jwt', 'client_secret_post', 'private_key_jwt'
      id_token_signed_response_alg: parseProccessEnvVar('OIDC_TOKEN_SIGNING_ALG', { defaultValue: 'EdDSA', allowedValues: ['HS256', 'PS256', 'RS256', 'ES256', 'EdDSA'] }) as string
    }
  }
}

export const oidc = {
  disable,
  oidcConfig
}
