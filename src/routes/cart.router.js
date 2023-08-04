import { Router } from 'express'
import Response from '../class/response.class.js'
import { CartModel } from '../dao/mongoManager/models/cart.model.js'
import { ProductModel } from '../dao/mongoManager/models/product.model.js'
import { ObjectId } from 'mongodb'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

router.post('/', async (req, res) => {

    const cart = await CartModel.create({ products: [] })

    res.status(201).send(Response.success('Carrito creado', cart))

})

router.get('/:cid', async (req, res) => {

    const cid = req.params.cid

    const cart = await CartModel.findById(cid)

    if (!cart) throw new Error('Carrito no encontrado')

    res.status(200).send(Response.success('Carrito encontrado', cart))

})

router.post('/:cid/product/:pid', async (req, res) => {

    try {

        const cid = req.params.cid
        const pid = req.params.pid

        // Validate if product exits

        const product = await ProductModel.findById(pid)

        if (!product) throw new Error('Producto inexistente')

        // Validate if cart exits

        const cart = await CartModel.findById(cid)

        if (!cart) throw new Error('Carrito inexistente')

        // Set filter

        const filter = {
            _id: new ObjectId(cid)
        }

        // Set update info

        let update = {}

        // Search if product exists in cart

        const productInCart = cart.products.find(product => product.product === pid)

        if (productInCart) {

            productInCart.quantity += 1

            update = { $set: { products: cart.products } }

        } else {

            update = {
                $push: {
                    products: {
                        product: pid,
                        quantity: 1
                    }
                }
            }

        }

        await CartModel.updateOne(filter, update)

        res.status(201).send(Response.added('Producto agregado al carrito'))

    } catch (error) {

        res.status(500).send(Response.error(error.message))

    }

})

// -----------------------------------------------------------------------------------------

export default router