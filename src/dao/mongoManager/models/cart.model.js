import mongoose from 'mongoose'

const cartCollection = 'carts'

const cartScheme = new mongoose.Schema({
    products: [{
        products: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true,
        },
        quantity: { type: Number, required: true },
    }],
})

export const CartModel = mongoose.model(cartCollection, cartScheme)