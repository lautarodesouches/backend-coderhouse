import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { ProductModel } from '../../dao/mongo/index.js'
import { ResponseClass } from '../../class/index.js'

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

    res.status(200).send(ResponseClass.success(products))

})

router.get('/:pid', async (req, res) => {

    try {

        const pid = req.params.pid

        const product = await ProductModel.findById(pid)

        if (!product) throw new Error('Producto no encontrado')

        res.status(200).send(ResponseClass.success(product))

    } catch (error) {

        res.status(404).send(ResponseClass.e(error.message))

    }

})

router.post('/', async (req, res) => {

    try {

        await ProductModel.create(req.body)

        res.status(201).send(ResponseClass.succe())

    } catch (error) {

        res.status(500).send(ResponseClass.error(error.message))

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

        res.status(201).send(ResponseClass.success())

    } catch (error) {

        res.status(500).send(ResponseClass.error(error.message))

    }

})

router.delete('/:pid', async (req, res) => {

    try {

        const filter = { _id: new ObjectId(req.params.pid) }

        await ProductModel.deleteOne(filter)

        res.status(204).send(ResponseClass.success())

    } catch (error) {

        res.status(500).send(ResponseClass.error(error.message))

    }

})

export default router