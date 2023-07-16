import express from 'express'
import ProductRouter from './routes/product.router.js'
import CartRouter from './routes/cart.router.js'
import handlebars from 'express-handlebars'
import ProductManager from './class/ProductManager/index.js'

// -----------------------------------------------------------------------------------------

import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Server } from 'socket.io'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// -----------------------------------------------------------------------------------------

const app = express()

app.use(express.json())

app.use('/static', express.static(__dirname + '/public'))

// -----------------------------------------------------------------------------------------

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// -----------------------------------------------------------------------------------------

app.use('/api/products', ProductRouter)
app.use('/api/carts', CartRouter)

// -----------------------------------------------------------------------------------------

const productManager = new ProductManager('src/db/productos.json')

app.get('/', async (req, res) => {

    const products = await productManager.getData()

    res.render('index', {
        products
    })

})

app.get('/realtimeproducts', (req, res) => {

    res.render('index', {
        products: []
    })

})

// -----------------------------------------------------------------------------------------

const PORT = 8080

const httpServer = app.listen(PORT)
const io = new Server(httpServer)

io.on('connection', socket => {

    console.log('cliente conectado')

})