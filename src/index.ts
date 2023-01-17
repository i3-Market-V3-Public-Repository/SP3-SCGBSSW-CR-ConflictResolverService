#!/usr/bin/env node
import express from 'express'
import { Express } from 'express-serve-static-core'
import http from 'http'
import morgan from 'morgan'
import { server as serverConfig } from './config'
import routesPromise from './routes'

async function startApp (): Promise<Express> {
  const app = express()
  app.use(express.json())
  app.use(morgan('dev'))

  // Load CORS for the routes
  app.use((await import('./middlewares/cors')).corsMiddleware)

  // Install the OpenApiValidator for the routes
  app.use((await import('./middlewares/openapi')).openApiValidatorMiddleware)

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
    const { port, addr } = serverConfig
    server.listen(port, addr)

    /**
    * Event listener for HTTP server "listening" event.
    */
    server.on('listening', function (): void {
      console.log('Listening ...')
      // console.log(`OpenAPI JSON spec at ${publicUri}/openapi.json`)
      // console.log(`OpenAPI browsable spec at ${publicUri}/spec`)
      resolve(server)
    })
  }).catch((e) => {
    console.log(e)
    reject(e)
  })
})

export default serverPromise
