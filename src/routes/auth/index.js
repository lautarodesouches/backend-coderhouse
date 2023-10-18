import { Router } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

// -----------------------------------------------------------------------------------------

import config from '../../config/index.js'
import Mail from '../../utils/mail.js'
import UserService from '../../services/user/index.js'
import { userService } from '../../services/index.js'
import { createHash } from '../../utils/index.js'

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

        console.log('TEST')

        const { email } = req.body

        const mailer = new Mail

        const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '1h' })

        const html = `<a href="http://localhost:8080/reset/${token}">Haga click acá para restablecer contraseña</a>`

        await mailer.send(email, 'Restablecer contraseña', html)

        res.redirect('/')
    }
)

router.post(
    '/reset/:token',
    async (req, res) => {

        const token = req.params.token

        const { password } = req.body

        try {

            const data = jwt.verify(token, config.jwtSecret)

            const user = await userService.getUserByEmail(data.email)

            if (jwt.verify(user.password, config.jwtSecret) === password) throw new Error('Contraseñas no deben ser iguales')

            user.password = createHash(password)

            await userService.updatedUserById(user._id, user)

        } catch (error) {
            res.redirect('/reset')
        }

        res.redirect('/')

    }
)

// -----------------------------------------------------------------------------------------

export default router