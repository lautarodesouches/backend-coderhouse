import mongoose from 'mongoose'

const cartCollection = 'carts'

const cartScheme = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true,
            },
            quantity: { type: Number, required: true },
        }
    ],
})

cartScheme.pre('find', function () {
    this.populate('products.product')
})

export const CartModel = mongoose.model(cartCollection, cartScheme)