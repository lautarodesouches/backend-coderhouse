import CustomError from '../../class/error/index.js'
import EErrors from '../../class/error/types.js'
import { cartService } from '../../services/index.js'

export const createCart = async (req, res) => {
    try {
        const cart = await cartService.createCart()

        res.json({ message: 'Carrito creado', payload: cart })
    } catch (e) {
        res.status(500).json({ message: 'Error al obtener los carritos' })
    }
}

export const getCarts = async (req, res) => {
    const limit = req.query.limit

    try {
        const carts = await cartService.getCarts(limit)

        res.json({ message: 'Carritos obtenidos exitosamente', payload: carts })
    } catch (error) {
        res.status(404).json({ message: 'Error al obtener los carritos' })
    }
}

export const getCartById = async (req, res) => {
    const cid = req.params.cid

    try {
        const cart = await cartService.getCartById(cid)

        res.json({ message: 'Carrito obtenido exitosamente', payload: cart })
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito' })
    }
}

export const addProductCart = async (req, res) => {
    const cid = req.params.cid

    const pid = req.params.pid

    const quantity = req.query.quantity || 1

    if (quantity === 0) {
        CustomError.createError({
            name: 'Invalid quantity',
            cause: 'Quantity can not be cero',
            message: 'Can not add product to cart',
            code: EErrors.INVALID_TYPE_ERROR
        })
    }

    try {
        const result = await cartService.addProductCart(cid, pid, quantity)

        if (!result) return res.status(404).json({ message: 'Carrito no encontrado' })

        res.json({ message: 'Producto agregado al carrito', payload: result })
    } catch (error) {
        console.log({ error })

        res.status(500).json({ message: 'Error al agregar el producto al carrito' })
    }
}

export const deleteProductCart = async (req, res) => {
    const cid = req.params.cid

    const pid = req.params.pid

    try {
        const result = await cartService.deleteProductCart(cid, pid)

        if (!result) return res.status(404).json({ message: 'Carrito no encontrado' })

        res.json({ message: 'Se ha restado 1 a la cantidad', payload: result })
    } catch (error) {
        res.status(500).json({ message: error || 'Error al eliminar el producto del carrito' })
    }
}

export const deleteCartById = async (req, res) => {
    const cid = req.params.cid

    try {
        const result = await cartService.deleteCartById(cid)

        res.json({ message: 'Carrito eliminado', payload: result })
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el carrito' })
    }
}

export const finishPurchase = async (req, res) => {
    const cid = req.params.cid

    try {
        const result = await cartService.finishPurchase(cid)

        res.json({ message: 'Compra realizada con éxito', payload: result })
    } catch (error) {
        res.status(404).json({ message: 'Error al finalizar compra' })
    }
}
