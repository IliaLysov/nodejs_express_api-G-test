require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})
const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./routes/auth.routes')
const dataRouter = require('./routes/data.routes')
const productRouter = require('./routes/product.routes')
const corsMiddleware = require('./middleware/cors.middleware')
const errorMiddleware = require('./middleware/error.middleware')
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 4000

app.use(corsMiddleware)
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'files')))
app.use('/api/auth', authRouter)
app.use('/api/data', dataRouter)
app.use('/api/products', productRouter)
app.use(errorMiddleware) //всегда последним


const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()