import { ConflictResolution, parseJwk, verifyKeyPair, EthersIoAgentDest } from '@i3m/non-repudiation-library'
import { dltConfig } from './config'
import { parseProccessEnvVar } from './config/parseProcessEnvVar'

async function generateCrs (): Promise<ConflictResolution.ConflictResolver> {
  const parsedPrivateJwk = parseProccessEnvVar('CRS_PRIVATE_JWK') as string
  const parsedPublicJwk = parseProccessEnvVar('CRS_PRIVATE_JWK') as string

  const privateJwk = await parseJwk(JSON.parse(parsedPrivateJwk), false)
  const publicJwk = await parseJwk(JSON.parse(parsedPublicJwk), false)
  await verifyKeyPair(publicJwk, privateJwk)

  const wallet = new EthersIoAgentDest(dltConfig)

  return new ConflictResolution.ConflictResolver({ publicJwk, privateJwk }, wallet)
}
const crsPromise: Promise<ConflictResolution.ConflictResolver> = generateCrs()

export default crsPromise
