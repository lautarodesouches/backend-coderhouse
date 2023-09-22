import bycrypt from 'bcrypt'

export const createHash = password => bycrypt.hashSync(password, bycrypt.genSaltSync(10))

export const isPasswordValid = (user, password) => bycrypt.compareSync(password, user.password)

// ----------------

import jsw from 'jsonwebtoken'
import { JWT_COOKIE_NAME, JWT_SECRET } from '../constants/index.js'

export const generateToken = user => jsw.sign({ user }, JWT_SECRET, { expiresIn: '24h' })

export const extractCookie = req => (req && req.cookies) && req.cookies[JWT_COOKIE_NAME]