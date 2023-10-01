import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

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

productScheme.plugin(mongoosePaginate)

export default mongoose.model(productCollection, productScheme)