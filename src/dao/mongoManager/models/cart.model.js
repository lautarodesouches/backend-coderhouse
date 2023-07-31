import mongoose from 'mongoose'

const cartCollection = 'carts'

const cartScheme = new mongoose.Schema({
    products: Array
})

export const cartModel = mongoose.model(cartCollection, cartScheme)