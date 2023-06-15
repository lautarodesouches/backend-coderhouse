import express from 'express'
import ProductManager from './class/ProductManager/index.js'

// -----------------------------------------------------------------------------------------

const app = express()

app.use(express.json())

// -----------------------------------------------------------------------------------------

const productManager = new ProductManager('src/db/products.json')

// -----------------------------------------------------------------------------------------

app.get('/products', async (request, response) => {

    const limit = request.query.limit

    const products = await productManager.getProducts()

    if (limit < products.length) products.length = limit

    response.json(products)

})

app.get('/products/:pid', async (request, response) => {

    try {

        const pid = parseInt(request.params.pid)

        const product = await productManager.getProductById(pid)

        return response.json(product)

    } catch (error) {

        response.status(404).json({
            message: error.message
        })

    }

})

// -----------------------------------------------------------------------------------------

const PORT = 8080

app.listen(PORT, () => console.log(`La aplicación se encuentra corriendo en el puerto ${PORT}`))