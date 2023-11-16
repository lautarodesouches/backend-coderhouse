import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// -----------------------------------------------------------------------------------------

import config from '../../config/index.js'
import Mail from '../../utils/mail.js'
import { createHash } from '../../utils/index.js'
import { userService } from '../../services/index.js'

// -----------------------------------------------------------------------------------------

export const login = async (req, res) => {

    if (!req.user) return res.status(400).send('Invalid credentials')

    updateLastConnection(req.user)

    req.session.email = req.user.email

    return res.redirect('/products')

}

export const loginGithub = async (req, res) => {

    updateLastConnection(req.user)

}

export const logout = (req, res) => {

    updateLastConnection(req.user)

    req.session.destroy(err => {
        if (err) return res.json({ status: 'Logout ERROR', body: err })
    })

    return res.json({ status: 'Logout Ok', body: {} })
}

export const githubCallback = async (req, res) => {

    updateLastConnection(req.user)

    res.cookie(config.jwtCookieName, req.user.token).redirect('/profile')

}

export const register = async (req, res) => {

    updateLastConnection(req.user)

    res.redirect('/')

}

export const reset = async (req, res) => {

    const { email } = req.body

    const mailer = new Mail

    const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '1h' })

    const html = `<a href="http://localhost:8080/reset/${token}">Haga click acá para restablecer contraseña</a>`

    await mailer.send(email, 'Restablecer contraseña', html)

    res.redirect('/')
}

export const resetToken = async (req, res) => {

    const token = req.params.token

    const { password } = req.body

    try {

        const data = jwt.verify(token, config.jwtSecret)

        const user = await userService.getUserByEmail(data.email)

        const passwordsMatch = await bcrypt.compare(password, user.password)

        if (passwordsMatch) throw new Error('Contraseñas no deben ser iguales')

        user.password = createHash(password)

        await userService.updateUserById(user._id, user)

        res.redirect('/')

    } catch (error) {
        res.redirect('/reset')
    }


}

export const updateLastConnection = async (user) => {

    user.last_connection = new Date()

    await userService.updateUserById(user._id, user)

}