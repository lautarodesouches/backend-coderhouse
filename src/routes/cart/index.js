import { Router } from 'express'

// -----------------------------------------------------------------------------------------

import { addProductCart, createCart, deleteCartById, deleteProductCart, finishPurchase, getCartById, getCarts } from '../../controllers/carts/index.js'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

router.post('/', createCart)

router.get('/', getCarts)

router.get('/:cid', getCartById)

router.post('/:cid/:pid', addProductCart)

router.delete('/:cid/:pid', deleteProductCart)

router.delete('/:cid', deleteCartById)

router.post('/purchase/:cid', finishPurchase)

// -----------------------------------------------------------------------------------------

export default router