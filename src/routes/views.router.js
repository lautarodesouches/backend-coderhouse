import { Router } from 'express'
import Response from '../class/response.class.js'
import { ProductModel } from '../dao/mongoManager/models/product.model.js'
import { UserModel } from '../dao/mongoManager/models/user.model.js'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

function auth(req, res, next) {
    return (req.session?.email ? next() : res.status(401).send('Auth error'))
}

router.get('/', (req, res) => {

    if (req.session?.email) res.redirect('/profile')

    res.render('login', {})

})

router.get('/register', (req, res) => {
    res.render('register', {})
})

router.get('/profile', auth, async (req, res) => {

    const { user } = req.session.user

    const data = await UserModel.findOne({ user })

    res.render('profile', data)

})

router.get('/products', auth, async (req, res) => {

    const user = await UserModel.findOne({ user: req.session.user })

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
        result
    }

    console.log(info);

    res.render('products', info)

})

// -----------------------------------------------------------------------------------------

export default router