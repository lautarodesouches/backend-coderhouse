import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { ResponseClass } from '../../class/index.js'
import { CartModel, ProductModel } from '../../dao/mongo/index.js'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

router.get('/:cid', async (req, res) => {

    const cid = req.params.cid

    const cart = await CartModel.find({ _id: cid })

    if (!cart) throw new Error('Carrito no encontrado')

    res.status(200).send(ResponseClass.success(cart))

})

router.post('/', async (req, res) => {

    const cart = await CartModel.create({ products: [] })

    res.status(201).send(ResponseClass.success(cart))

})

router.post('/:cid/product/:pid', async (req, res) => {

    try {

        const cid = req.params.cid
        const pid = req.params.pid

        await checkIfProductExits(pid)

        const cart = await checkIfCartExists(cid)

        // Set filter

        const filter = {
            _id: new ObjectId(cid)
        }

        // Set update info

        let update = {}

        // Search if product exists in cart

        const productInCart = cart.products.find(list => list.product._id.equals(pid))

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

        res.status(201).send(ResponseClass.success())

    } catch (error) {

        res.status(500).send(ResponseClass.error(error.message))

    }

})

router.delete('/:cid/products/:pid', async (req, res) => {

    try {

        const cid = req.params.cid
        const pid = req.params.pid

        const cart = await checkIfCartExists(cid)

        const product = cart.products.find(list => list.product._id.equals(pid))

        await CartModel.updateOne(
            { _id: cid },
            {
                $pull:
                {
                    products: product
                }
            }
        )

        res.status(201).send(ResponseClass.success())

    } catch (error) {

        res.status(500).send(ResponseClass.error(error.message))

    }

})

router.delete('/:cid/', async (req, res) => {

    try {

        const cid = req.params.cid

        const cart = await checkIfCartExists(cid)

        await CartModel.updateOne(
            { _id: cid },
            {
                $set:
                {
                    products: []
                }
            }
        )

        res.status(201).send(ResponseClass.success())

    } catch (error) {

        res.status(500).send(ResponseClass.error(error.message))

    }

})

router.put('/:cid/', async (req, res) => {

    try {

        const cid = req.params.cid

        const cart = await checkIfCartExists(cid)

        await CartModel.updateOne(
            { _id: cid },
            {
                $set:
                {
                    'products': req.body
                }
            }
        )

        res.status(201).send(ResponseClass.success())

    } catch (error) {

        res.status(500).send(ResponseClass.error(error.message))

    }

})

router.put('/:cid/products/:pid/', async (req, res) => {

    try {

        const cid = req.params.cid
        const pid = req.params.pid

        const cart = await checkIfCartExists(cid)

        await CartModel.updateOne(
            { _id: cid, 'products.product': pid },
            {
                $set:
                {
                    'products.$.quantity': req.body.quantity
                }
            }
        )

        res.status(201).send(ResponseClass.success())

    } catch (error) {

        res.status(500).send(ResponseClass.error(error.message))

    }

})

const checkIfProductExits = async pid => {

    const product = await ProductModel.findById(pid)

    if (!product) throw new Error('Producto inexistente')

    return product

}

const checkIfCartExists = async cid => {

    const cart = await CartModel.findById(cid)

    if (!cart) throw new Error('Carrito inexistente')

    return cart

}

// -----------------------------------------------------------------------------------------

export default router