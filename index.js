/* ---------------------------------------- IMPORTS -------------------------------------- */

const fs = require('fs')

/* ---------------------------------------- CONSTANTS ------------------------------------ */

const PATH = 'productos.json'

const SEPARATION = '\n--------------------------\n\n'

/* ---------------------------------------- UTILS ---------------------------------------- */

const customLog = arg => console.log(SEPARATION, arg)

/* ---------------------------------------- PRODUCT -------------------------------------- */

class Product {

    constructor(title, description, price, thumnail, code, stock) {
        this.title = title
        this.description = description
        this.price = price
        this.thumnail = thumnail
        this.code = code
        this.stock = stock
    }

}

/* ---------------------------------------- PRODUCT_MANAGER ---------------------------------------- */

class ProductManager {

    #id = 1

    constructor(path) {
        this.path = path
        this.products = []
    }

    async getProducts() {

        try {

            const productsJson = await fs.promises.readFile(this.path, 'utf-8')

            this.products = JSON.parse(productsJson)

            this.#id = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 1) + 1

        } catch (error) {
            this.products = []
        }

        return this.products

    }

    async saveProducts() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.products))
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

/* ---------------------------------------- TEST ---------------------------------------- */

const test = async () => {

    try {

        // Se creará una instancia de la clase “ProductManager”

        const productManager = new ProductManager(PATH)

        customLog(productManager)

        // Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []

        let getProducts = await productManager.getProducts()

        customLog(getProducts)

        /* Se llamará al método “addProduct” con los campos:
        
            title: “producto prueba”
            description:”Este es un producto prueba”
            price:200,
            thumbnail:”Sin imagen”
            code:”abc123”,
            stock:25
    
        */

        // El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE

        await productManager.addProduct(
            new Product(
                'producto prueba',
                'Este es un producto prueba',
                200,
                'Sin imagen',
                'abc123',
                25
            )
        )

        // Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado

        getProducts = await productManager.getProducts()

        customLog(getProducts)

        // Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado,
        // en caso de no existir, debe arrojar un error.

        const productoEncontrado = await productManager.getProductById(1)

        customLog(productoEncontrado)

        // Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto,
        // se evaluará que no se elimine el id y que sí se haya hecho la actualización.

        const productToUpdate = {
            id: 1,
            ...(new Product(
                'producto prueba',
                'Este es un producto prueba',
                199,
                'Sin imagen',
                'abc123',
                25
            ))
        }

        await productManager.updateProduct(productToUpdate)

        getProducts = await productManager.getProducts()

        customLog(getProducts)

        // Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto 
        // o que arroje un error en caso de no existir.

        await productManager.deleteProduct(1)

        getProducts = await productManager.getProducts()

        customLog(getProducts)

    } catch (error) {

        customLog(error)

    }

}

test()