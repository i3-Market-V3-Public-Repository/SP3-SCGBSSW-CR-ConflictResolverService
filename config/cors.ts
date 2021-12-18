import { nullish } from './nullish'

interface CorsConfig {
  allowedOrigin: string
}

export const cors: CorsConfig = {
  allowedOrigin: nullish(process.env.CORS_ACCESS_CONTROL_ALLOW_ORIGIN) ? '*' : process.env.CORS_ACCESS_CONTROL_ALLOW_ORIGIN as string
}
