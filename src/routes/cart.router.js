import { Router } from 'express'
import CartManager from '../class/CartManager/index.js'
import Response from '../class/Response/index.js'

// -----------------------------------------------------------------------------------------

const router = Router()

const cartManager = new CartManager('src/db/carrito.json')

// -----------------------------------------------------------------------------------------

router.post('/', async (req, res) => {

    await cartManager.createCart()

    res.status(200).send(Response.success('Carrito creado'))

})

router.get('/:cid', async (req, res) => {

    const cid = parseInt(req.params.cid)

    const cart = await cartManager.getItemById(cid)

    res.status(200).send(Response.success('Carrito encontrado', cart))

})

router.post('/:cid/product/:pid', async (req, res) => {

    try {

        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)

        await cartManager.addProduct(cid, pid)

        res.status(201).send(Response.added('Producto agregado al carrito'))

    } catch (error) {

        res.send(Response.error(error.message))

    }

})

// -----------------------------------------------------------------------------------------

export default router