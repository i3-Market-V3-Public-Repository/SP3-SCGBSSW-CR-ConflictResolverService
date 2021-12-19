#!/usr/bin/env node
import crypto from 'crypto'
import express, { Request, Response } from 'express'
import { Express } from 'express-serve-static-core'
import session from 'express-session'
import { readFileSync, writeFileSync } from 'fs'
import http from 'http'
import morgan from 'morgan'
import { join } from 'path/posix'
import { serve, setup } from 'swagger-ui-express'
import { server as serverConfig } from './config'
import { oidc } from './config/oidc'
import passportPromise from './passport'
import routesPromise from './routes'
import apiSpec from './spec/openapi.json'

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
  makeOpenApiWorkWithOurOidc()

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
    console.log(e)
    reject(e)
  })
})

export default serverPromise

function makeOpenApiWorkWithOurOidc (): void {
  interface Replacement {
    searchValue: string
    replacement: string
  }
  const replacements: Replacement[] = [
    {
      searchValue: 'openIdWellKnownUri',
      replacement: oidc.providerUri + '/.well-known/openid-configuration'
    }
  ]
  const openApiJsonPath = join(__dirname, 'spec', 'openapi.json')
  let openApiJson = readFileSync(openApiJsonPath, 'utf-8')
  const openApiYamlPath = join(__dirname, 'spec', 'openapi.yaml')
  let openApiYaml = readFileSync(openApiYamlPath, 'utf-8')

  for (const replacement of replacements) {
    const regex = new RegExp(replacement.searchValue, 'g')
    openApiJson = openApiJson.replace(regex, replacement.replacement)
    openApiYaml = openApiYaml.replace(regex, replacement.replacement)
  }
  writeFileSync(openApiJsonPath, openApiJson)
  writeFileSync(openApiYamlPath, openApiYaml)
}
