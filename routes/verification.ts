import { Router } from 'express'
import { PassportStatic } from 'passport'

export default function verification (router: Router, passport: PassportStatic): void {
  router.post('/verification',
    passport.authenticate('jwtBearer', { session: false }),
    (req, res) => {
      res.json({ msg: 'Do you think we\'re done?! Put yourself to work, you loser!' })
    }
  )
}
