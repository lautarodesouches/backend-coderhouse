/* ---------------------------------------- UTILS ---------------------------------------- */

const SEPARATION = '\n--------------------------\n\n'

const generateRandomStock = () => Math.round((Math.random() * 100) + 1)

const customLog = arg => console.log(SEPARATION, arg)

/* ---------------------------------------- PRODUCT ---------------------------------------- */

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

    constructor() {
        this.products = []
    }

    addProduct(
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    ) {

        const product = new Product(
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        )

        if (this.areEmptyValues(product)) throw new Error(`Los campos son obligatorios`)

        if (this.isCodeRepeated(product.code)) throw new Error(`El codigo ${product.code} se encuentra en uso`)

        this.products.push({ id: this.#id, ...product })

        this.incrementId()
    }

    getProducts() {
        return this.products
    }

    getProductById(id) {
        const productoEncontrado = this.products.find(product => product.id === id)
        if (!productoEncontrado) throw new Error('Producto no encontrado')
        return productoEncontrado
    }

    // -----------------------------

    isCodeRepeated(code) {
        return !!this.products.find(product => product.code === code)
    }

    incrementId() {
        this.#id++
    }

    areEmptyValues(product) {
        const values = Object.values(product)
        return values.includes(undefined) || values.includes(null)
    }

}

/* ---------------------------------------- TEST ---------------------------------------- */

// Se creará una instancia de la clase “ProductManager”

const productManager = new ProductManager()

customLog(productManager)

// Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []

customLog(productManager.getProducts())

try {

    /* Se llamará al método “addProduct” con los campos:
    
        title: “producto prueba”
        description:”Este es un producto prueba”
        price:200,
        thumbnail:”Sin imagen”
        code:”abc123”,
        stock:25
    */

    // El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE

    productManager.addProduct(
        'producto prueba',
        'Este es un producto prueba',
        200,
        'Sin imagen',
        'abc123',
        25
    )

    // Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado

    customLog(
        productManager.getProducts()
    )

    // Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.

    productManager.addProduct(
        'producto prueba',
        'Este es un producto prueba',
        200,
        'Sin imagen',
        'abc123',
        25
    )

} catch (error) {
    
    customLog(error.message)

}

try {

    // Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo

    customLog(productManager.getProductById(1))

} catch (error) {

    customLog(error.message)
    
}