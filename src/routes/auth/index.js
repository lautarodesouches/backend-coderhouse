import { Router } from 'express'
import passport from 'passport'
import config from '../../config/index.js'

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

router.get('/test', (req, res) => {

    if (req.session.user) return res.send('Already logged')

    const { username } = req.query

    if (!username) return res.send('Need a username')

    req.session.user = username

    return res.send('Successful login')

})


// -----------------------------------------------------------------------------------------

export default router