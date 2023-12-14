import { Router } from 'express'
import passport from 'passport'

// -----------------------------------------------------------------------------------------

import { ProductModel } from '../../dao/mongo/models/index.js'
import config from '../../config/index.js'
import { cartService, userService } from '../../services/index.js'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

function auth(req, res, next) {
    return req.session?.email || req.cookies[config.jwtCookieName] ? next() : res.status(401).send('Auth error')
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

router.get('/profile', passport.authenticate('jwt'), async (req, res) => {
    const user = await userService.getUserByEmail(req.session.email)

    res.render('profile', user)
})

router.get('/products', auth, async (req, res) => {
    const user = await userService.getUserByEmail(req.session.email)

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

router.get('/checkout', (req, res) => {
    res.render('checkout', {})
})

router.get('/success', (req, res) => {
    res.render('success', {})
})

router.get('/cart', async (req, res) => {
    const user = await userService.getUserByEmail(req.session.email)

    const cart = await cartService.getCartById(user.cartId)

    const doc = cart.products.map(item => {
        return {
            id: item.product._id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity
        }
    })

    res.render('cart', { doc, cartId: cart._id})
})

router.get('/documents', (req, res) => {
    res.render('documents', { userId: req.user.id })
})

// -----------------------------------------------------------------------------------------

export default router
