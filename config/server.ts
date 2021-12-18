import { config as loadEnvFile } from 'dotenv'
import { existsSync } from 'fs'

if (existsSync('./.env')) loadEnvFile()
interface ServerConfig {
  addr: string
  port: number
  publicUri: string
}
const port = Number(process.env.PORT ?? 3000)

export const server: ServerConfig = {
  addr: '0.0.0.0',
  port,
  publicUri: process.env.PUBLIC_URI ?? `http://localhost:${port}` // It SHOULD BE https when using a public server
}
