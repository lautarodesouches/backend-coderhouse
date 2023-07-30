import { Router } from 'express'
import ProductManager from '../class/ProductManager/index.js'
import Response from '../class/Response/index.js'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

const productManager = new ProductManager('src/db/productos.json')

// -----------------------------------------------------------------------------------------

router.get('/', async (req, res) => {

    const limit = req.query.limit

    const products = await productManager.getData()

    if (limit < products.length) products.length = limit

    res.status(200).send(Response.success('Productos encontrados', products))

})

router.get('/:pid', async (req, res) => {

    try {

        const pid = parseInt(req.params.pid)

        const product = await productManager.getItemById(pid)

        res.status(200).send(Response.success('Producto encontrado', product))

    } catch (error) {

        res.send(Response.notFound(error.message))

    }

})

router.post('/', async (req, res) => {

    try {

        await productManager.addProduct(req.body)

        res.status(201).send(Response.added('Producto agregado'))

    } catch (error) {

        res.send(Response.error(error.message))

    }

})

router.put('/:pid', async (req, res) => {

    try {

        const pid = parseInt(req.params.pid)

        req.body.id = pid

        await productManager.updateItem(req.body)

        res.status(201).send(Response.success('Producto modificado'))

    } catch (error) {

        res.send(Response.error(error.message))

    }

})

router.delete('/:pid', async (req, res) => {

    try {

        const pid = parseInt(req.params.pid)

        await productManager.deleteItemById(pid)

        res.status(201).send(Response.success('Productos eliminado'))

    } catch (error) {

        res.send(Response.error(error.message))

    }

})

export default router