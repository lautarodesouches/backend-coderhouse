import { Router } from 'express'
import Response from '../class/response.class.js'
import { ProductModel } from '../dao/mongoManager/models/product.model.js'
import { ObjectId } from 'mongodb'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

router.get('/', async (req, res) => {

    const { limit, page, sort, query } = req.query

    const products = await ProductModel.find()

    if (limit < products.length) products.length = limit

    res.status(200).send(Response.success('Productos encontrados', products))

})

router.get('/:pid', async (req, res) => {

    try {

        const pid = req.params.pid

        const product = await ProductModel.findById(pid)

        if (!product) throw new Error('Producto no encontrado')

        res.status(200).send(Response.success('Producto encontrado', product))

    } catch (error) {

        res.status(404).send(Response.notFound(error.message))

    }

})

router.post('/', async (req, res) => {

    try {

        await ProductModel.create(req.body)

        res.status(201).send(Response.added('Producto agregado'))

    } catch (error) {

        res.status(500).send(Response.error(error.message))

    }

})

router.put('/:pid', async (req, res) => {

    try {

        const filter = { _id: new ObjectId(req.params.pid) }

        const update = {
            $set: {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                thumnail: req.body.thumnail,
                code: req.body.code,
                stock: req.body.stock,
                status: req.body.status,
                category: req.body.category
            }
        }

        await ProductModel.updateOne(filter, update)

        res.status(201).send(Response.success('Producto modificado'))

    } catch (error) {

        res.status(500).send(Response.error(error.message))

    }

})

router.delete('/:pid', async (req, res) => {

    try {

        const filter = { _id: new ObjectId(req.params.pid) }

        await ProductModel.deleteOne(filter)

        res.status(204).send(Response.success('Productos eliminado'))

    } catch (error) {

        res.status(500).send(Response.error(error.message))

    }

})

export default router