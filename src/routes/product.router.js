import { Router } from 'express'
import ProductManager from '../class/ProductManager/index.js'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

const productManager = new ProductManager('src/db/productos.json')

// -----------------------------------------------------------------------------------------

router.get('/', async (request, response) => {

    const limit = request.query.limit

    const products = await productManager.getData()
    
    if (limit < products.length) products.length = limit

    response.json(products)

})

router.get('/:pid', async (request, response) => {

    try {

        const pid = parseInt(request.params.pid)

        const product = await productManager.getItemById(pid)

        return response.json(product)

    } catch (error) {

        response.status(404).json({
            message: error.message
        })

    }

})

router.post('/', async (request, response) => {

    try {
        
        await productManager.addItem(request.body)

        response.status(201).json('Producto agregado')
        
    } catch (error) {
        
        response.status(500).json(error.message)

    }

})

router.put('/:pid', async (request, response) => {

    try {
        
        const pid = parseInt(request.params.pid)

        request.body.id = pid

        await productManager.updateItem(request.body)

        response.status(200).json('Producto modificado')
        
    } catch (error) {
        
        response.status(500).json(error.message)

    }

})

router.delete('/:pid', async (request, response) => {

    try {
        
        const pid = parseInt(request.params.pid)

        await productManager.deleteItemById(pid)

        response.status(204).json()
        
    } catch (error) {
        
        response.status(500).json(error.message)

    }

})

export default router