import { config as loadEnvFile } from 'dotenv'
import { existsSync } from 'fs'
import { parseProccessEnvVar } from './parseProcessEnvVar'

if (existsSync('./.env')) loadEnvFile()
interface ServerConfig {
  addr: string
  port: number
  publicUri: string
}
const port = Number(parseProccessEnvVar('SERVER_PORT', { defaultValue: '3000' }))

export const server: ServerConfig = {
  addr: parseProccessEnvVar('SERVER_ADDRESS', { defaultValue: '0.0.0.0' }) as string,
  port,
  publicUri: parseProccessEnvVar('SERVER_PUBLIC_URI', { defaultValue: `http://localhost:${port}` }) as string
}
