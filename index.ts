import crypto from 'crypto'
import express, { Request, Response } from 'express'
import { Express } from 'express-serve-static-core'
import session from 'express-session'
import http from 'http'
import morgan from 'morgan'
import { serve, setup } from 'swagger-ui-express'
import { server as serverConfig } from './config'
import apiSpec from './spec/openapi.json'
import passportPromise from './passport'
import routesPromise from './routes'

async function startApp (): Promise<Express> {
  const app = express()
  const passport = await passportPromise

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

  return app
}

const serverPromise = new Promise<http.Server>((resolve, reject) => {
  startApp().then((app) => {
  /**
   * Listen on .env SERVER_PORT or 3000/tcp, on all network interfaces.
   */
    const server = http.createServer(app)
    const { port, addr, publicUri } = serverConfig
    server.listen(port, addr)

    /**
    * Event listener for HTTP server "listening" event.
    */
    server.on('listening', function (): void {
      console.log(`Listening on http://localhost:${port}`)
      console.log(`Listening on public ${publicUri}`)
      console.log(`OpenAPI JSON spec at ${publicUri}/openapi.json`)
      console.log(`OpenAPI browsable spec at ${publicUri}/spec`)
      resolve(server)
    })
  }).catch((e) => {
    reject(e)
  })
})

export default serverPromise
