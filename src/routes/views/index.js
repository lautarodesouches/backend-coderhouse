import { Router } from 'express'
import passport from 'passport'

// -----------------------------------------------------------------------------------------

import { ProductModel, UserModel } from '../../dao/mongo/models/index.js'
import config from '../../config/index.js'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

function auth(req, res, next) {
    return ((req.session?.email || req.cookies[config.jwtCookieName]) ? next() : res.status(401).send('Auth error'))
}

// -----------------------------------------------------------------------------------------

router.get('/', (req, res) => {

    if (req.session?.email) res.redirect('/profile')

    res.render('login', {})

})

router.get('/register', (req, res) => {
    res.render('register', {})
})

router.get('/reset', (req, res) => {
    res.render('reset', {})
})

router.get('/reset/:token', (req, res) => {
    res.render('resetnew', {})
})

router.get(
    '/profile',
    passport.authenticate('jwt'),
    async (req, res) => {

        const user = await UserModel.findOne({ email: req.user.email })

        res.render('profile', user)

    }
)

router.get('/products', auth, async (req, res) => {

    const user = await UserModel.findOne({ email: req.session.email })

    // -------------------------------------------------

    let { limit, page, query, value, sort } = req.query

    const filter = {}

    if (query && value) filter[query] = parseInt(value) || value

    const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1,
        sort: { price: sort }
    }

    const result = await ProductModel.paginate(filter, options)

    // -------------------------------------------------

    const info = {
        user,
        docs: result.docs
    }

    res.render('products', info)

})

// -----------------------------------------------------------------------------------------

export default router