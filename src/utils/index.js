import bycrypt from 'bcrypt'

export const createHash = password => bycrypt.hashSync(password, bycrypt.genSaltSync(10))

export const isPasswordValid = (user, password) => bycrypt.compareSync(password, user.password)

// ----------------

import jsw from 'jsonwebtoken'
import config from '../config/index.js'

export const generateToken = user => jsw.sign({ user }, config.jwtSecret, { expiresIn: '24h' })

export const extractCookie = req => (req && req.cookies) && req.cookies[config.jwtCookieName]

// ----------------

import { faker } from '@faker-js/faker'

export const generateMockProducts = async qty => {

    const products = []

    for (let i = 0; i < qty; i++) {

        products.push({
            "_id": faker.number.int({ min: 1000000 }),
            "title": faker.airline.airplane(),
            "description": faker.airline.aircraftType(),
            "price": faker.number.float({ min: 100, max: 10000 }),
            "thumnail": faker.image.url(),
            "code": faker.number.int(),
            "stock": faker.number.int({ max: 10 }),
            "status": !!faker.number.binary(),
            "category": faker.airline.aircraftType()
        })

    }

    return products

}