import mongoose from 'mongoose'

const productCollection = 'products'

const productScheme = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumnail: { type: Array, required: true },
    code: { type: String, required: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, required: true },
    category: { type: String, required: true },
})

export const productModel = mongoose.model(productCollection, productScheme)