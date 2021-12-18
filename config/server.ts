import { config as loadEnvFile } from 'dotenv'
import { existsSync } from 'fs'
import { nullish } from './nullish'

if (existsSync('./.env')) loadEnvFile()
interface ServerConfig {
  addr: string
  port: number
  publicUri: string
}
const port = Number(process.env.SERVER_PORT ?? 3000)

export const server: ServerConfig = {
  addr: nullish(process.env.SERVER_ADDRESS) ? '0.0.0.0' : process.env.SERVER_ADDRESS as string,
  port,
  publicUri: nullish(process.env.SERVER_PUBLIC_URI) ? `http://localhost:${port}` : process.env.SERVER_PUBLIC_URI as string // It SHOULD BE https when using a public server
}
