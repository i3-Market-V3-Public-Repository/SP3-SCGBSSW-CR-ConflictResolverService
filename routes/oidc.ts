import { Request, Router } from 'express'
import jwt, { decode } from 'jsonwebtoken'
import { TokenSet } from 'openid-client'
import { PassportStatic } from 'passport'
import util from 'util'
import { jwt as jwtConfig, JwtConfig } from '../config'
import { OpenApiPaths } from '../types/openapi'

export default function oidc (router: Router, passport: PassportStatic): void {
  router.get('/oidc/login/provider',
    passport.authenticate('oidc', { scope: 'openid vc vce:provider' })
  )

  router.get('/oidc/login/consumer',
    passport.authenticate('oidc', { scope: 'openid vc vce:consumer' })
  )

  router.get('/oidc/cb', passport.authenticate('oidc', { session: false }),
    function (req: Request<{}, OpenApiPaths.OidcCb.Get.Responses.$200>, res) {
      if (req.user === undefined) throw new Error('token not received')
      const tokenSet = req.user as TokenSet

      console.log(`Access token: ${tokenSet.access_token ?? 'not received'}`)
      if (tokenSet.access_token !== undefined) console.log(util.inspect(decode(tokenSet.access_token, { complete: true }), false, null, true))

      console.log(`ID token: ${tokenSet.id_token ?? 'not received'}`)
      if (tokenSet.id_token !== undefined) console.log(util.inspect(decode(tokenSet.id_token, { complete: true }), false, null, true))

      const jwt = _createJwt({ sub: tokenSet.claims().sub, scope: tokenSet.scope ?? '' })

      const response: OpenApiPaths.OidcCb.Get.Responses.$200 = {
        jwtBearerToken: jwt,
        allowedEndpoints: ['/dispute', '/verification'] // TO-DO: Fix this. Providers do not have access to /dispute
      }

      res.json(response)
    }
  )
}

interface JwtClaims {
  sub: string
  scope: string
}

function _createJwt (claims: JwtClaims): string {
  /** This is what ends up in our JWT */
  const config = jwtConfig.config as JwtConfig
  const jwtClaims = {
    iss: config.iss,
    aud: config.aud,
    exp: Math.floor(Date.now() / 1000) + config.expiresIn, // 1 day (24×60×60=86400s) from now
    ...claims
  }

  /** generate a signed json web token and return it in the response */
  return jwt.sign(jwtClaims, config.secret)
}
