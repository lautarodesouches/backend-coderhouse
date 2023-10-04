import { ProductModel } from '../models/index.js'

export default class Product {

    getProducts = async (limit) => {

        if (!limit) return ProductModel.find()

        const products = await ProductModel.find()

        return products.slice(0, limit)

    }

    addProducts = async (data) => await ProductModel.create(data)

    getProductById = async (id) => await ProductModel.findById(id)

    updatedProductById = async (id, updatedProduct) => {

        const update = {
            $set: updatedProduct,
        }

        return await ProductModel.findByIdAndUpdate(id, update, {
            new: true,
        })
    }

    deleteProduct = async (id) => await ProductModel.findByIdAndDelete(id)

}