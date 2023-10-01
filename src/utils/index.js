import bycrypt from 'bcrypt'

export const createHash = password => bycrypt.hashSync(password, bycrypt.genSaltSync(10))

export const isPasswordValid = (user, password) => bycrypt.compareSync(password, user.password)

// ----------------

import jsw from 'jsonwebtoken'
import config from '../config/index.js'

export const generateToken = user => jsw.sign({ user }, config.jwtSecret, { expiresIn: '24h' })

export const extractCookie = req => (req && req.cookies) && req.cookies[config.jwtCookieName]