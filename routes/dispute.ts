import { Router } from 'express'
import { PassportStatic } from 'passport'

export default function dispute (router: Router, passport: PassportStatic): void {
  router.post('/dispute',
    passport.authenticate('jwtBearer', { session: false }),
    (req, res) => {
      res.json({ msg: 'Do you think we\'re done?! Put yourself to work, you loser!' })
    }
  )
}
