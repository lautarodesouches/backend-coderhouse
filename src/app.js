import express from 'express'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import FileStore from 'session-file-store'
import MongoStore from 'connect-mongo'
import { Server } from 'socket.io'
import bodyParser from 'body-parser'
//
import { dirname } from 'path'
import { fileURLToPath } from 'url'
//
import { DB_PASSWORD, DB_USER } from './constants/index.js'
//
import CartRouter from './routes/cart.router.js'
import ChatRouter from './routes/chat.router.js'
import UsersRouter from './routes/users.router.js'
import ProductRouter from './routes/product.router.js'
import AuthRouter from './routes/auth.router.js'
import ViewsRouter from './routes/views.router.js'
//
import ProductManager from './dao/fileManager/product.manager.js'
//
import { MessagesModel } from './dao/mongoManager/models/message.model.js'
import { ProductModel } from './dao/mongoManager/models/product.model.js'
import { CartModel } from './dao/mongoManager/models/cart.model.js'
//
import Response from './class/response.class.js'

const MONGO_URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.vkjgmee.mongodb.net/?retryWrites=true&w=majority`
const MONGO_DB = 'ecommerce'

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

app.use('/static', express.static(__dirname + '/public'))

app.use(cookieParser('CoderS3cR3tC0D3'))

app.use(session({
    //store: new fileStorage({ path: './sessions', ttl: 100, retries: 0 }),
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        dbName: MONGO_DB,
        ttl: 100
    }),
    secret: 'secretCoder',
    resave: true,
    saveUninitialized: true
}))

// ----------------------------------------------------------------------------------------- MOGOOSE

try {

    await mongoose.connect(MONGO_URL, { dbName: MONGO_DB })

    console.log('\n--- Connected to database ---')

} catch (error) {

    console.log('\n--- Cannot connect to database ' + error + '---')
    process.exit()

}

// ----------------------------------------------------------------------------------------- HANDLEBARS

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// ----------------------------------------------------------------------------------------- ROUTERS

app.use('/', ViewsRouter)
app.use('/api/auth', AuthRouter)
app.use('/api/products', ProductRouter)
app.use('/api/carts', CartRouter)
app.use('/api/users', UsersRouter)
app.use('/chat', ChatRouter)

// ----------------------------------------------------------------------------------------- 

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

const PORT = 8080

const httpServer = app.listen(PORT, () => {
    console.log(`\n--- Server running in port ${PORT} --> http://localhost:${PORT}/`)
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

        await MessagesModel.create(message)

        const res = await MessagesModel.find()

        const chat = res.reverse()

        io.emit('update-chat', { chat })

    })

})