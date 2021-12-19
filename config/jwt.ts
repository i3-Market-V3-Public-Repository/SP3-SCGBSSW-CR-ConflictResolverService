import { parseHex } from '@i3m/non-repudiation-library'
import { randomFillSync } from 'crypto'
import { config as loadEnvFile } from 'dotenv'
import { existsSync } from 'fs'
import { parseProccessEnvVar } from './parseProcessEnvVar'
import { server } from './server'

if (existsSync('./.env')) loadEnvFile()

const disable = parseProccessEnvVar('JWT_DISABLE', { defaultValue: false, isBoolean: true }) as boolean

export interface JwtConfig {
  secret: Buffer
  iss: string
  aud: string
  expiresIn: number
}

let config: JwtConfig | undefined

if (!disable) {
  const defaultExpiresIn = 60
  let expiresIn = Number(parseProccessEnvVar('JWT_EXPIRES_IN', { defaultValue: String(defaultExpiresIn) }))
  if (isNaN(expiresIn)) expiresIn = defaultExpiresIn

  let secretHex: string = parseProccessEnvVar('JWT_SECRET') as string

  let secret: Buffer

  if (secretHex === '') {
    secret = randomFillSync(Buffer.alloc(32))
  } else {
    try {
      secretHex = parseHex(secretHex, false)
    } catch (error) {
      throw new RangeError('Invalid JWT_SECRET. It MUST be empty (a new random one will be generated) or hexadecimal')
    }
    secret = Buffer.from(secretHex, 'hex')
  }

  config = {
    secret,
    iss: server.publicUri,
    aud: server.publicUri,
    expiresIn
  }
}

export const jwt = {
  disable,
  config
}
