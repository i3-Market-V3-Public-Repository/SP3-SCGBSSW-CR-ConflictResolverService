import { defaultDltConfig, DltConfig } from '@i3m/non-repudiation-library'
import { config as loadEnvFile } from 'dotenv'
import { existsSync } from 'fs'
import { parseProccessEnvVar } from './parseProcessEnvVar'

if (existsSync('./.env')) loadEnvFile()

const rpcProviderUrl = parseProccessEnvVar('RPC_PROVIDER_URL') as string

if (rpcProviderUrl === '') {
  throw new Error('You must provide a valid RPC_PROVIDER_URL as a environment variable')
}

export const dltConfig: DltConfig = {
  rpcProviderUrl,
  ...defaultDltConfig
}
