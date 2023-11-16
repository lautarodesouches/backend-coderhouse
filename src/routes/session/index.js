import { Router } from 'express'
import passport from 'passport'

// -----------------------------------------------------------------------------------------

import { githubCallback, login, loginGithub, logout, register, reset, resetToken } from '../../controllers/session/index.js'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

router.post(
    '/login',
    passport.authenticate('login', '/login'),
    login
)

router.get(
    '/login-github',
    passport.authenticate('github', { scope: ['user:email'] }),
    loginGithub
)

router.post(
    '/logout',
    logout
)

router.get(
    '/github-callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    githubCallback
)

router.post(
    '/register',
    passport.authenticate('register', { failureRedirect: '/register' }),
    register
)

router.post(
    '/reset',
    reset
)

router.post(
    '/reset/:token',
    resetToken
)

// -----------------------------------------------------------------------------------------

export default router