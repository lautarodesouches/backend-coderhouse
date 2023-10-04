import { productService } from '../../services/index.js'

export const getProducts = async (req, res) => {

    try {

        const limit = parseInt(req.query.limit)

        const result = await productService.getProducts(limit)

        res.json({ message: 'success', payload: result })

    } catch (error) {

        res.status(500).json({ message: 'Error al obtener los productos' })

    }

}

export const addProducts = async (req, res) => {

    const data = req.body

    try {

        const result = await productService.addProducts(data)

        res.status(201).json({ message: 'Producto agregado exitosamente', payload: result })

    } catch (error) {

        res.status(500).json({ message: 'Error al agregar el producto' })

    }

}

export const getProductById = async (req, res) => {

    const id = req.params.pid

    try {

        const result = await productService.getProductById(id)

        res.json({ message: 'Producto encontrado', payload: result })

    } catch (error) {

        res.status(500).json({ message: 'Error al obtener el producto' })

    }

}

export const updatedProductById = async (req, res) => {

    const productId = req.params.pid

    const updatedProduct = { ...req.body }

    try {

        const result = await productService.updatedProductById(productId, updatedProduct)

        res.json({ message: 'Producto actualizado exitosamente', payload: result })

    } catch (error) {

        res.status(500).json({ message: 'Error al actualizar el producto' })

    }

}

export const deletedProduct = async (req, res) => {

    const productId = req.params.pid

    try {

        const result = await productService.deleteProduct(productId)

        if (!result) return res.json({ message: 'No se pudo eliminar' })

        res.json({ message: 'Producto eliminado exitosamente', payload: result })

    } catch (error) {

        res.status(500).json({ message: 'Error al eliminar el producto' })

    }

}