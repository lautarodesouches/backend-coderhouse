import { promises } from 'fs'

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

            this.#id = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 1) + 1

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

        if (this.areEmptyValues(product)) throw new Error(`Los campos son obligatorios`)

        if (this.isCodeRepeated(product.code)) throw new Error(`El codigo ${product.code} se encuentra en uso`)

        this.products.push({ id: this.#id, ...product })

        await this.saveProducts()

        this.incrementId()
    }

    async getProductById(id) {

        await this.getProducts()

        const productoEncontrado = this.products.find(product => product.id === id)

        if (!productoEncontrado) throw new Error('Producto no encontrado')

        return productoEncontrado

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

        const objetoEncontrado = await this.getProductById(id)

        this.products.splice(this.products.indexOf(objetoEncontrado), 1)

        await this.saveProducts()

    }

    // -----------------------------

    isCodeRepeated(code) {
        return this.products.some(product => product.code === code)
    }

    incrementId() {
        this.id++
    }

    areEmptyValues(product) {
        const values = Object.values(product)
        return values.includes(undefined) || values.includes(null)
    }

}