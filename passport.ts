import { BaseClient, Issuer, Strategy as OidcStrategy, TokenSet } from 'openid-client'
import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { jwt, oidc } from './config'

async function passportAsync (): Promise<typeof passport> {
  let issuer: Issuer<BaseClient>
  try {
    issuer = await Issuer.discover(oidc.providerUri)
  } catch (error) {
    console.error(error)
    throw new Error('Cannot initialize passport due to OIDC server unavailable')
  }

  console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata)

  const client = new issuer.Client(oidc.client)

  /**
   * JWT strategies differ in how the token is got from the request:
   * either cookies or the HTTP bearer authorization header
   */
  passport.use('jwtBearer', new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwt.secret
    },
    (jwtPayload, done) => {
      return done(null, jwtPayload)
    }
  ))

  passport.use('oidc',
    new OidcStrategy({
      client,
      usePKCE: false
    }, (token: TokenSet, done: Function) => {
      return done(null, token)
    }))

  return passport
}

export default passportAsync()
