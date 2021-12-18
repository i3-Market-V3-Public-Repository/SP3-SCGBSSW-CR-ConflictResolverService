import { defaultDltConfig } from '@i3m/non-repudiation-library'
import { config as loadEnvFile } from 'dotenv'
import { existsSync } from 'fs'
import { nullish } from './nullish'

if (existsSync('./.env')) loadEnvFile()

const dltConfig = defaultDltConfig
if (!nullish(process.env.DLT_RPC_PROVIDER_URL)) {
  dltConfig.rpcProviderUrl = process.env.DLT_RPC_PROVIDER_URL as string
}

export { dltConfig }
