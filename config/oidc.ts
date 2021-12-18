import { config as loadEnvFile } from 'dotenv'
import { existsSync } from 'fs'
import { ClientMetadata } from 'openid-client'
import { nullish } from './nullish'
import { server } from './server'

if (existsSync('./.env')) loadEnvFile()

interface OidcConfig {
  providerUri: string
  client: ClientMetadata
}

if (nullish(process.env.OIDC_CLIENT_ID)) throw new Error('Env variable CLIENT_ID must be provided')
if (nullish(process.env.OIDC_CLIENT_SECRET)) throw new Error('Env variable CLIENT_SECRET must be provided')
if (nullish(process.env.OIDC_PROVIDER_URI)) throw new Error('Env variable OIDC_PROVIDER_URI must be provided')

export const oidc: OidcConfig = {
  providerUri: process.env.OIDC_PROVIDER_URI as string,
  client: {
    client_id: process.env.OIDC_CLIENT_ID as string,
    client_secret: process.env.OIDC_CLIENT_SECRET,
    redirect_uris: [`${server.publicUri}/oidc/cb`],
    application_type: 'web',
    grant_types: ['authorization_code'],
    response_types: ['code'],
    token_endpoint_auth_method: 'client_secret_jwt', // One of 'none' (only for PKCE), 'client_secret_basic', 'client_secret_jwt', 'client_secret_post', 'private_key_jwt'
    id_token_signed_response_alg: process.env.TOKEN_SIGNING_ALG ?? 'EdDSA' // One of 'HS256', 'PS256', 'RS256', 'ES256', 'EdDSA'
  }
}
