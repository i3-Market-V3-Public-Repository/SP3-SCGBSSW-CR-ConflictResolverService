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

export const oidc: OidcConfig = {
  providerUri: 'https://identity1.i3-market.eu/release2/oidc',
  client: {
    client_id: process.env.CLIENT_ID as string,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: [`${server.publicUri}/oidc/cb`],
    application_type: 'web',
    grant_types: ['authorization_code'],
    response_types: ['code'],
    token_endpoint_auth_method: 'client_secret_jwt', // One of 'none' (only for PKCE), 'client_secret_basic', 'client_secret_jwt', 'client_secret_post', 'private_key_jwt'
    id_token_signed_response_alg: process.env.TOKEN_SIGNING_ALG ?? 'EdDSA' // One of 'HS256', 'PS256', 'RS256', 'ES256', 'EdDSA'
  }
}
if (!nullish(process.env.OIDC_PROVIDER_URI)) {
  oidc.providerUri = process.env.OIDC_PROVIDER_URI as string
}
