import { Router } from 'express'
import { UserModel } from '../dao/mongoManager/models/user.model.js'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

router.post('/login', async (req, res) => {

    const { email, password } = req.body

    const user = await UserModel.findOne({ email, password })

    if (!user) return res.redirect('/')

    req.session.email = email

    return res.redirect('/products')

})

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.json({status: 'Logout ERROR', body: err})
    })

    return res.json({status: 'Logout Ok', body: {}})
})

router.post('/register', (req, res) => {

    const data = req.body

    data.role = 'user'

    UserModel.create(data)

    return res.redirect('/')
})

router.get('/test', (req, res) => {

    if (req.session.user) return res.send('Already logged')

    const { username } = req.query

    if (!username) return res.send('Need a username')

    req.session.user = username

    return res.send('Successful login')

})


// -----------------------------------------------------------------------------------------

export default router