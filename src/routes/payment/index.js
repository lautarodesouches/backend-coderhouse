import { Router } from 'express'
import { paymentIntent } from '../../controllers/payment/index.js'

const router = Router()

router.post('/intent', paymentIntent)

export default router
