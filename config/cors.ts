import { server } from './server'

interface CorsConfig {
  allowedOrigin: string
}

export const cors: CorsConfig = {
  allowedOrigin: server.publicUri // The domain allowed to connect to this sercer with JS, eg 'http://localhost:3000'
}
