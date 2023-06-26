import { promises } from 'fs'
import Product from '../Product/index.js'

export default class ProductManager {

    #id = 1

    constructor(path) {
        this.path = path
        this.products = []
    }

    async getProducts() {

        try {

            const productsJson = await promises.readFile(this.path, 'utf-8')

            this.products = JSON.parse(productsJson)

            this.#id = this.generateId()

        } catch (error) {
            this.products = []
        }

        return this.products

    }

    async saveProducts() {
        await promises.writeFile(this.path, JSON.stringify(this.products))
    }

    async addProduct(product) {

        await this.getProducts()

        const productToAdd = Object.assign(new Product(), product)
        
        if (!productToAdd.hasAllValuesSet()) throw new Error(`Los campos son obligatorios`)

        if (this.isCodeRepeated(product.code)) throw new Error(`El codigo ${product.code} se encuentra en uso`)

        this.products.push({ id: this.#id, ...product })

        await this.saveProducts()

        this.incrementId()

    }

    async getProductById(id) {

        await this.getProducts()

        const productFound = this.products.find(product => product.id === id)

        if (!productFound) throw new Error('Producto no encontrado')

        return productFound

    }

    async updateProduct(productToUpdate) {

        let products = await this.getProducts()

        this.products = products.map(product => {

            if (product.id === productToUpdate.id) product = { ...productToUpdate }

            return product

        })

        await this.saveProducts()

    }

    async deleteProduct(id) {

        await this.getProducts()

        const productFound = await this.getProductById(id)

        this.products.splice(this.products.indexOf(productFound), 1)

        await this.saveProducts()

    }

    // -----------------------------

    isCodeRepeated(code) {
        return this.products.some(product => product.code === code)
    }

    incrementId() {
        this.id++
    }

    generateId() {
        return this.products.reduce((maxId, product) => Math.max(maxId, product.id), 1) + 1
    }

}