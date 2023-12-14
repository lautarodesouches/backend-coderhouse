import Stripe from 'stripe'
import config from '../../config/index.js'

export default class PaymentService {
    constructor() {
        this.stripe = new Stripe(config.stripeKey)
    }

    createPayment = async data => {
        const paymentIntent = this.stripe.paymentIntents.create(data)

        return paymentIntent
    }
}
