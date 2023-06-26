import express from 'express'
import ProductRouter from './routes/product.router.js'
import CartRouter from './routes/cart.router.js'

// -----------------------------------------------------------------------------------------

const app = express()

app.use(express.json())

// -----------------------------------------------------------------------------------------

app.use('/api/products', ProductRouter)
app.use('/api/carts', CartRouter)

// -----------------------------------------------------------------------------------------

const PORT = 8080

app.listen(PORT, () => console.log(`La aplicación se encuentra corriendo en el puerto ${PORT}`))