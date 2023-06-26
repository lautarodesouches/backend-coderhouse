import { Router } from 'express'
import CartManager from '../class/CartManager/index.js'

// -----------------------------------------------------------------------------------------

const router = Router()

const cartManager = new CartManager('src/db/carrito.json')

// -----------------------------------------------------------------------------------------

router.post('/', async (req, res) => {

    await cartManager.createCart()

    res.status(201).json('Carrito creado')

})

router.get('/:cid', async (req, res) => {

    const cid = parseInt(req.params.cid)

    const cart = await cartManager.getCartById(cid)

    res.status(200).json(cart)

})

router.post('/:cid/product/:pid', async (req, res) => {

    try {
        
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)
    
        await cartManager.addProduct(cid, pid)
    
        res.status(201).json('Producto agregado al carrito')

    } catch (error) {
        
        res.status(500).json(error.message)

    }

})

// -----------------------------------------------------------------------------------------

export default router