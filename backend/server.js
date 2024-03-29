import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import seedRouter from './routers/seedRoutes.js'
import productRouter from './routers/productRoutes.js'
import userRouter from './routers/userRouter.js'
import orderRouter from './routers/orderRoutes.js'
dotenv.config()
const MONGODB_URI =
  'mongodb+srv://visitor:visitor@cluster0.yedts.mongodb.net/G-express?retryWrites=true&w=majority'
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected to db'))
  .catch((err) => {
    console.log(err.message)
  })
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})

app.use('/api/seed', seedRouter)
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)

const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, '/frontend/build')))
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html')),
)

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message })
})
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`app listening at port ${port}`)
})
