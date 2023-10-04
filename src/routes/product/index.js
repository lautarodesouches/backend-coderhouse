import { Router } from 'express'

// -----------------------------------------------------------------------------------------

import { addProducts, deletedProduct, getProductById, getProducts, updatedProductById } from '../../controllers/product/index.js'

// -----------------------------------------------------------------------------------------

const router = Router();

// -----------------------------------------------------------------------------------------

router.get("/", getProducts)

router.post("/", addProducts)

router.get("/:pid", getProductById)

router.put("/:pid", updatedProductById)

router.delete("/:pid", deletedProduct)

// -----------------------------------------------------------------------------------------

export default router;