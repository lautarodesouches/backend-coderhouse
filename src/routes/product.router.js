import { Router } from 'express'
import Response from '../class/response.class.js'
import { ProductModel } from '../dao/mongoManager/models/product.model.js'
import { ObjectId } from 'mongodb'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

router.get('/', async (req, res) => {

    let { limit, page, query, sort } = req.query

    const filter = query ? { title: query } : {}

    const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1
    }

    const products = await ProductModel.paginate(filter, options)

    res.status(200).send(Response.success(products))

})

router.get('/:pid', async (req, res) => {

    try {

        const pid = req.params.pid

        const product = await ProductModel.findById(pid)

        if (!product) throw new Error('Producto no encontrado')

        res.status(200).send(Response.success(product))

    } catch (error) {

        res.status(404).send(Response.e(error.message))

    }

})

router.post('/', async (req, res) => {

    try {

        await ProductModel.create(req.body)

        res.status(201).send(Response.succe())

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

        res.status(201).send(Response.success())

    } catch (error) {

        res.status(500).send(Response.error(error.message))

    }

})

router.delete('/:pid', async (req, res) => {

    try {

        const filter = { _id: new ObjectId(req.params.pid) }

        await ProductModel.deleteOne(filter)

        res.status(204).send(Response.success())

    } catch (error) {

        res.status(500).send(Response.error(error.message))

    }

})

export default router