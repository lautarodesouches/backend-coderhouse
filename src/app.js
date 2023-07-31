import express from 'express'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import CartRouter from './routes/cart.router.js'
import UsersRouter from './routes/users.router.js'
import ProductRouter from './routes/product.router.js'
import ProductManager from './dao/fileManager/product.manager.js'
import { Server } from 'socket.io'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { DB_PASSWORD, DB_USER } from './constants/index.js'

// -----------------------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ----------------------------------------------------------------------------------------- EXPRESS

const app = express()

app.use(express.json())

app.use('/static', express.static(__dirname + '/public'))

// ----------------------------------------------------------------------------------------- MOGOOSE

try {

    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.vkjgmee.mongodb.net/?retryWrites=true&w=majority`, {
        dbName: 'ecommerce'
    })

    console.log('Connected to database')

} catch (error) {

    console.log('Cannot connect to database ' + error)
    process.exit()

}

// ----------------------------------------------------------------------------------------- HANDLEBARS

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// ----------------------------------------------------------------------------------------- ROUTERS

app.use('/api/products', ProductRouter)
app.use('/api/carts', CartRouter)
app.use('/api/users', UsersRouter)

// ----------------------------------------------------------------------------------------- PRODUCT MANAGER

const productManager = new ProductManager('src/db/productos.json')

app.get('/', async (req, res) => {

    const products = await productManager.getData()

    res.render('index', {
        products
    })

})

app.get('/realtimeproducts', async (req, res) => {

    const products = await productManager.getData()

    res.render('realtime', {
        products
    })

})

// ----------------------------------------------------------------------------------------- SOCKET

const PORT = 8080

const httpServer = app.listen(PORT)
const io = new Server(httpServer)

io.on('connection', socket => {

    console.log('cliente conectado')

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

})