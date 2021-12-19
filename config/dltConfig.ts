import { defaultDltConfig } from '@i3m/non-repudiation-library'
import { config as loadEnvFile } from 'dotenv'
import { existsSync } from 'fs'
import { parseProccessEnvVar } from './parseProcessEnvVar'

if (existsSync('./.env')) loadEnvFile()

const dltConfig = defaultDltConfig
const parsedRpcProviderUrl = parseProccessEnvVar('DLT_RPC_PROVIDER_URL') as string
if (parsedRpcProviderUrl !== '') dltConfig.rpcProviderUrl = parsedRpcProviderUrl

export { dltConfig }
