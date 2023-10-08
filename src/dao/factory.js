import mongoose from 'mongoose'
import config from '../config/index.js'

export let Cart
export let Product
export let User
export let Ticket

switch (config.persistence) {
    case 'MONGO':

        mongoose.connect(config.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: config.mongoDb,
        })

        const { default: ProductMongo } = await import('./mongo/product/index.js')
        const { default: CartMongo } = await import('./mongo/cart/index.js')
        const { default: UserMongo } = await import('./mongo/user/index.js')
        const { default: TicketMongo } = await import('./mongo/ticket/index.js')

        Product = ProductMongo
        Cart = CartMongo
        User = UserMongo
        Ticket = TicketMongo
        
        break

    case 'FILE':
        const { default: ProductFile } = await import('./file/product/index.js')
        const { default: CartFile } = await import('./file/cart/index.js')
        const { default: UserFile } = await import('./file/user/index.js')
        const { default: TicketFile } = await import('./file/ticket/index.js')

        Product = ProductFile
        Cart = CartFile
        User = UserFile
        Ticket = TicketFile
        
        break

    default:
        break
}

console.log(`\n--- Persistence with ${config.persistence}---`)