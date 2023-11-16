import express from 'express'
import session from 'express-session'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import FileStore from 'session-file-store'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import bodyParser from 'body-parser'
import compression from 'express-compression'
import swaggerJSDoc from 'swagger-jsdoc'
import SwaggerUiExpress from 'swagger-ui-express'

// -----------------------------------------------------------------------------------------

import { Server } from 'socket.io'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

// -----------------------------------------------------------------------------------------

import config from './config/index.js'
import initializePassport from './config/passport/index.js'
import errorHandler from './middleware/errors.js'

// -----------------------------------------------------------------------------------------

import { ProductManager } from './dao/file/index.js'
import { MessageModel, CartModel, ProductModel } from './dao/mongo/models/index.js'
import { SessionRoutes, CartRoutes, ChatRoutes, ProductRoutes, UserRoutes, ViewRoutes, LoggerRoutes } from './routes/index.js'
import { generateMockProducts } from './utils/index.js'
import { addLogger } from './utils/logger.js'

// -----------------------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ----------------------------------------------------------------------------------------- SESSION STORAGE

const fileStorage = FileStore(session)

// ----------------------------------------------------------------------------------------- EXPRESS

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.use(express.json())

app.use(compression({
    brotli: { enable: true, zlib: {} }
}))

app.use('/static', express.static(__dirname + '/public'))

app.use(cookieParser('CoderS3cR3tC0D3'))

app.use(session({
    //store: new fileStorage({ path: './sessions', ttl: 100, retries: 0 }),
    store: MongoStore.create({
        mongoUrl: config.mongoUrl,
        dbName: config.mongoDb,
        ttl: 100
    }),
    secret: 'secretCoder',
    resave: true,
    saveUninitialized: true
}))

app.use(addLogger)

// ----------------------------------------------------------------------------------------- MOGOOSE

try {

    await mongoose.connect(config.mongoUrl, { dbName: config.mongoDb })

    console.log('\n--- Connected to database ---')

} catch (error) {

    console.log('\n--- Cannot connect to database ' + error + '---')

    process.exit()

}

// ----------------------------------------------------------------------------------------- HANDLEBARS

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// ----------------------------------------------------------------------------------------- PASSPORT

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// ----------------------------------------------------------------------------------------- SWAGGER

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación proyecto Backend',
            description: 'Este es un proyecto para el curso de Backend en CoderHouse'
        }
    },
    apis: [
        `${__dirname}/docs/*.yaml`
    ]
}

const specs = swaggerJSDoc(swaggerOptions)

app.use('/api/docs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs))

// ----------------------------------------------------------------------------------------- ROUTERS

app.use('/', ViewRoutes)
app.use('/loggertest', LoggerRoutes)
app.use('/chat', ChatRoutes)
app.use('/api/auth', SessionRoutes)
app.use('/api/users', UserRoutes)
app.use('/api/carts', CartRoutes)
app.use('/api/products', ProductRoutes)
app.use(errorHandler)

// ----------------------------------------------------------------------------------------- 


app.get('/mockingproducts', async (req, res) => {

    const result = await generateMockProducts(100)

    res.json({ message: 'success', payload: result })

})

app.get('/realtimeproducts', async (req, res) => {

    const products = await ProductModel.find()

    res.render('realtime', {
        products
    })

})

app.get('/carts/:cid', async (req, res) => {

    const result = await CartModel.findById(req.params.cid).populate('products.product')

    const products = result.products.map(product => {
        return (
            {
                product: product.product.toObject(),
                quantity: product.quantity
            }
        )
    })

    res.render('cart', { products })

})

// ----------------------------------------------------------------------------------------- SOCKET

const httpServer = app.listen(config.port, () => {
    console.log(`\n--- Server running in port ${config.port} --> http://localhost:${config.port}/`)
})

const io = new Server(httpServer)

const productManager = new ProductManager('src/db/productos.json')

io.on('connection', socket => {

    console.log('\n+-- Cliente conectado')

    // PRODUCT

    socket.on('add-product', async data => {

        try {

            await productManager.addProduct(data)

            const products = await productManager.getData()

            io.emit('update-products', {
                products,
                message: 'Producto agregado'
            })

        } catch (error) {
            console.warn(error)
        }

    })

    socket.on('delete-product', async id => {

        await productManager.deleteItemById(parseInt(id))

        const products = await productManager.getData()

        io.emit('update-products', {
            products,
            message: 'Producto eliminado'
        })

    })

    // CHAT

    socket.on('add-message', async message => {

        await MessageModel.create(message)

        const res = await MessageModel.find()

        const chat = res.reverse()

        io.emit('update-chat', { chat })

    })

})
