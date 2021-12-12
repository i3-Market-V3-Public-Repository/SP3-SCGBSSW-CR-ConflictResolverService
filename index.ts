import crypto from 'crypto'
import express, { Request, Response } from 'express'
import session from 'express-session'
import http from 'http'
import morgan from 'morgan'
import { serve, setup } from 'swagger-ui-express'
import config from './config'
import apiSpec from './dist/spec/openapi.json'
import passportPromise from './passport'
import routesPromise from './routes'

const main = async function (): Promise<void> {
  const app = express()
  const passport = await passportPromise()

  app.use(session({
    secret: crypto.randomBytes(32).toString('base64'),
    resave: false,
    saveUninitialized: false
  }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(morgan('dev'))
  app.use(passport.initialize())
  // app.use(passport.session())

  // Serve openapi
  app.use('/openapi.json', (req: Request, res: Response): void => {
    res.json(apiSpec)
  })
  app.use('/spec', serve, setup(apiSpec))

  // Install the OpenApiValidator for the routes
  app.use((await import('./middlewares/openapi')).openApiValidatorMiddleware)

  // Load CORS for the routes
  app.use((await import('./middlewares/cors')).corsMiddleware)

  // Load routes
  app.use('/', await routesPromise())

  // Handle errors from all the previous
  app.use((await import('./middlewares/error')).errorMiddleware)

  /**
   * Listen on .env SERVER_PORT or 3000/tcp, on all network interfaces.
   */
  const server = http.createServer(app)
  const { port, addr } = config.server
  server.listen(port, addr)

  /**
   * Event listener for HTTP server "listening" event.
   */
  server.on('listening', function (): void {
    console.log(`Listening on http://localhost:${config.server.port}`)
    console.log(`Listening on public ${config.server.publicUri}`)
    console.log(`OpenAPI JSON spec at ${config.server.publicUri}/openapi.json`)
    console.log(`OpenAPI browsable spec at ${config.server.publicUri}/spec`)
  })
}

main().catch(err => { throw err })
