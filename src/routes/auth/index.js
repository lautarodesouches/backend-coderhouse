import { Router } from 'express'
import passport from 'passport'

// -----------------------------------------------------------------------------------------

import config from '../../config/index.js'
import Mail from '../../utils/mail.js'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

router.post(
    '/login',
    passport.authenticate('login', '/login'),
    async (req, res) => {

        if (!req.user) return res.status(400).send('Invalid credentials')

        req.session.email = req.user.email

        return res.redirect('/products')

    }
)

router.get(
    '/login-github',
    passport.authenticate('github', { scope: ['user:email'] }),
    async (req, res) => { }
)

router.get(
    '/github-callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    async (req, res) => {

        res.cookie(config.jwtCookieName, req.user.token).redirect('/profile')

    }
)

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.json({ status: 'Logout ERROR', body: err })
    })

    return res.json({ status: 'Logout Ok', body: {} })
})

router.post(
    '/register',
    passport.authenticate('register', { failureRedirect: '/register' }),
    async (req, res) => res.redirect('/')
)

router.post(
    '/reset',
    async (req, res) => {

        const { email } = req.body

        const mailer = new Mail

        const time = new Date()
        time.setHours(time.getHours() + 1)

        const html = `<a href="http://localhost:8080/reset/new/?email=${email}&time=${time.getTime()}">Haga click acá para restablecer contraseña</a>`

        await mailer.send(email, 'Restablecer contraseña', html)

        res.redirect('/')
    }
)

router.post(
    '/reset/new',
    async (req, res) => {

        const { email, password, time } = req.body

        if (!time < new Date().getTime()) return
            

        res.redirect('/')
    }
)

// -----------------------------------------------------------------------------------------

export default router