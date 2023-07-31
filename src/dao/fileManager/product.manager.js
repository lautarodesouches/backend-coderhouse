import Product from '../../class/product.class.js'
import Manager from './manager.js'

export default class ProductManager extends Manager {

    constructor(path) {
        super(path)
    }

    // -----------------------------

    async addProduct(product) {

        await this.getData()

        const productToAdd = Object.assign(new Product(), product)

        if (!productToAdd.hasAllValuesSet()) throw new Error(`Los campos son obligatorios`)

        if (this.isCodeRepeated(product.code)) throw new Error(`El codigo ${product.code} se encuentra en uso`)

        await this.addItem(product)

    }

    // -----------------------------

    isCodeRepeated(code) {
        return this.data.some(product => product.code === code)
    }

}