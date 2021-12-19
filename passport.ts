import { BaseClient, Issuer, Strategy as OidcStrategy, TokenSet } from 'openid-client'
import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { jwt, JwtConfig, oidc } from './config'

async function passportAsync (): Promise<typeof passport | undefined> {
  if (oidc.disable && jwt.disable) return undefined

  if (!oidc.disable && oidc.oidcConfig !== undefined) {
    let issuer: Issuer<BaseClient>
    try {
      issuer = await Issuer.discover(oidc.oidcConfig.providerUri)
    } catch (error) {
      console.error(error)
      throw new Error('Cannot initialize passport due to OIDC server unavailable')
    }

    console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata)

    const client = new issuer.Client(oidc.oidcConfig.client)

    passport.use('oidc',
      new OidcStrategy({
        client,
        usePKCE: false
      }, (token: TokenSet, done: Function) => {
        return done(null, token)
      }))
  }

  if (!jwt.disable) {
    const config = jwt.config as JwtConfig
    /**
     * JWT strategies differ in how the token is got from the request:
     * either cookies or the HTTP bearer authorization header
     */
    passport.use('jwtBearer', new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secret,
        issuer: config.iss,
        audience: config.aud,
        jsonWebTokenOptions: {
          audience: config.aud,
          issuer: config.iss
        }
      },
      (jwtPayload, done) => {
        return done(null, jwtPayload)
      }
    ))
  }

  return passport
}

export default passportAsync()
