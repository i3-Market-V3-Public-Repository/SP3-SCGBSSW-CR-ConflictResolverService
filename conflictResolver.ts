import { ConflictResolution } from '@i3m/non-repudiation-library'
import { dltConfig } from './config'
import jwkPairPromise from './keys'

async function generateCrs (): Promise<ConflictResolution.ConflictResolver> {
  return new ConflictResolution.ConflictResolver(await jwkPairPromise, dltConfig)
}
const crsPromise: Promise<ConflictResolution.ConflictResolver> = generateCrs()

export default crsPromise
