import { ConflictResolution, parseJwk, verifyKeyPair } from '@i3m/non-repudiation-library'
import { dltConfig } from './config'
import { nullish } from './config/nullish'

async function generateCrs (): Promise<ConflictResolution.ConflictResolver> {
  if (nullish(process.env.PRIVATE_JWK) || nullish(process.env.PUBLIC_JWK)) {
    throw new Error('You MUST provide a pair of JWKs as environment variables')
  }
  const publicJwk = await parseJwk(JSON.parse(process.env.PUBLIC_JWK as string), false)
  const privateJwk = await parseJwk(JSON.parse(process.env.PRIVATE_JWK as string), false)
  await verifyKeyPair(publicJwk, privateJwk)
  return new ConflictResolution.ConflictResolver({ publicJwk, privateJwk }, dltConfig)
}
const crsPromise: Promise<ConflictResolution.ConflictResolver> = generateCrs()

export default crsPromise
