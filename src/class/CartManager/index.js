import { promises } from 'fs'
import Cart from '../Cart/index.js'
import Manager from '../Manager/index.js'

export default class CartManager extends Manager {

    constructor(path) {
        super(path)
    }

    async createCart() {

        await this.getData()

        console.log("ID ------------ " + this.id);

        const cart = new Cart(this.id)

        this.data.push(cart)

        await this.saveData()

        this.incrementId()

    }

    async addProduct(cartId, productId) {

        await this.getData()

        if (!this.hasCartWithId(cartId)) throw new Error('Carrito no encontrado')

        if (!await this.productExists(productId)) throw new Error('Producto no existe')

        this.data = this.data.map(cart => {

            if (cart.id !== cartId) return cart

            if (cart.products.some(product => product.product === productId)) {

                cart.products.map(product => {

                    if (product.product === productId) product.quantity++
                    return product

                })

            } else {
                cart.products.push({ product: productId, quantity: 1 })
            }

            return cart
        })

        await this.saveData()

    }

    hasCartWithId(id) {
        return this.data.some(cart => cart.id === id)
    }

    async productExists(productId) {

        const productsJson = await promises.readFile('src/db/productos.json', 'utf-8')

        const products = JSON.parse(productsJson) || []

        return products.some(product => product.id === productId)

    }

}