import mongoose from 'mongoose'

const productCollection = 'products'

const productScheme = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    code: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumnail: { type: Array, required: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, required: true },
    category: { type: String, required: true },
})

export const ProductModel = mongoose.model(productCollection, productScheme)