import { cartService, ticketService, userService } from '../../services/index.js'
import PaymentService from '../../services/payment/index.js'
import Mail from '../../utils/mail.js'

export const paymentIntent = async (req, res) => {
    try {
        const email = req.session.email

        const user = await userService.getUserByEmail(email)

        const cart = await cartService.getCartById(user.cartId)

        const amount = cart.products.reduce(
            (accumulator, currentValue) => accumulator + currentValue.quantity * currentValue.product.price,
            0
        )

        console.log({ amount })

        const charge = {
            amount,
            currency: 'usd',
            description: 'Compra en X store'
        }

        const paymentService = new PaymentService()

        const today = new Date()

        const ticket = await ticketService.createTicket({
            code: today.getTime(),
            purchase_datetime: today,
            amount,
            purchaser: email
        })

        console.log({ ticket })

        const result = await paymentService.createPayment(charge)

        //

        const mailer = new Mail()

        const title = 'Muchas gracias por tu compra'

        const html = `
        <h1>${title}</h1>
        <h2>Datos de la compra:</h2>
        <h3>${today.toLocaleDateString()}</h3>
        <h3>Código: ${ticket.code}</h3>
        <h3>Total: ${ticket.amount}</h3>
        <hr>
        <h3>Productos:</h3>
        ${cart.products.map(
            item =>
                `
            <h5>${item.product.title}</h5>
            <h5>${item.quantity}</h5>
            `
        )}
        `

        await mailer.send(email, title, html)

        //

        await cartService.deleteCartById(user.cartId)

        //

        return res.send({ message: 'Pago exitoso', payload: result })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 'error', message: 'Ha ocurrido un error' })
    }
}
