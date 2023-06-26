import { promises } from 'fs'
import Cart from '../Cart/index.js'

export default class CartManager {

    #id = 1

    constructor(path) {
        this.path = path
        this.carts = []
    }

    async getCarts() {

        try {

            const cartsJson = await promises.readFile(this.path, 'utf-8')

            this.carts = JSON.parse(cartsJson)

            this.#id = this.generateId()

        } catch (error) {
            this.carts = []
        }

        return this.carts

    }

    async saveCarts() {
        await promises.writeFile(this.path, JSON.stringify(this.carts))
    }

    async createCart() {

        await this.getCarts()

        const cart = new Cart(this.#id)

        this.carts.push(cart)

        await this.saveCarts()

        this.incrementId()

    }

    async getCartById(id) {

        await this.getCarts()

        const cartFound = this.carts.find(cart => cart.id === id)

        if (!cartFound) throw new Error('Carrito no encontrado')

        return cartFound

    }

    async addProduct(cartId, productId) {

        await this.getCarts()

        if (!this.hasCartWithId(cartId)) throw new Error('Carrito no encontrado')

        if (!await this.productExists(productId)) throw new Error('Producto no existe')

        this.carts = this.carts.map(cart => {

            if (cart.id === cartId) {

                if (cart.products.some(product => product.product === productId)) {

                    cart.products.map(product => {

                        if (product.product === productId) product.quantity++
                        return product

                    })

                } else {
                    cart.products.push({ product: productId, quantity: 1 })
                }

            }

            return cart
        })

        await this.saveCarts()

    }

    hasCartWithId(id) {
        return this.carts.some(cart => cart.id === id)
    }

    async productExists(productId) {

        const productsJson = await promises.readFile('src/db/productos.json', 'utf-8')

        const products = JSON.parse(productsJson) || []

        return products.some(product => product.id === productId)

    }

    incrementId() {
        this.id++
    }

    generateId() {
        return this.carts.reduce((maxId, product) => Math.max(maxId, product.id), 1) + 1
    }

}