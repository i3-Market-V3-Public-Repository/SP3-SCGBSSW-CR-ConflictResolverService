import { randomFillSync } from 'crypto'
import { config as loadEnvFile } from 'dotenv'
import { existsSync } from 'fs'
import { server } from './server'

if (existsSync('./.env')) loadEnvFile()

interface JwtConfig {
  secret: string // base64url
  iss: string
  aud: string
}

export const jwt: JwtConfig = {
  secret: randomFillSync(Buffer.alloc(32)).toString('base64'),
  iss: server.publicUri,
  aud: 'crs'
}
