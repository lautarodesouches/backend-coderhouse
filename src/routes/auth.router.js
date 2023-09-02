import { Router } from 'express'
import { UserModel } from '../dao/mongoManager/models/user.model.js'
import { createHash, isPasswordValid } from '../utils/index.js'
import passport from 'passport'

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