import { ConflictResolution, parseJwk, verifyKeyPair, EthersIoAgentDest, JWK, JwkPair, generateKeys } from '@i3m/non-repudiation-library'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { dltConfig } from './config'
import { parseProccessEnvVar } from './config/parseProcessEnvVar'

async function generateCrs (): Promise<ConflictResolution.ConflictResolver> {
  const parsedPrivateJwk = parseProccessEnvVar('CRS_PRIVATE_JWK') as string
  const parsedPublicJwk = parseProccessEnvVar('CRS_PRIVATE_JWK') as string

  let privateJwk: JWK
  let publicJwk: JWK

  const keysDir = './.keys'
  const keysFile = 'keys.json'
  const keysPath = path.join(keysDir, keysFile)

  if (parsedPrivateJwk === '') {
    // try to load from .keys files
    if (existsSync(keysPath)) {
      const keyPair = JSON.parse(readFileSync(keysPath, 'utf-8')) as JwkPair
      privateJwk = keyPair.privateJwk
      publicJwk = keyPair.publicJwk
    } else {
      try {
        mkdirSync(keysDir)
      } catch (error) {}
      const keyPair = await generateKeys('ES256')
      privateJwk = keyPair.privateJwk
      publicJwk = keyPair.publicJwk
      writeFileSync(keysPath, JSON.stringify(keyPair))
    }
  } else {
    privateJwk = await parseJwk(JSON.parse(parsedPrivateJwk), false)
    publicJwk = await parseJwk(JSON.parse(parsedPublicJwk), false)
  }

  await verifyKeyPair(publicJwk, privateJwk)

  const wallet = new EthersIoAgentDest(dltConfig)

  return new ConflictResolution.ConflictResolver({ publicJwk, privateJwk }, wallet)
}
const crsPromise: Promise<ConflictResolution.ConflictResolver> = generateCrs()

export default crsPromise
