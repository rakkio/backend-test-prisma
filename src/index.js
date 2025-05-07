import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes.js'
import imageRoutes from './routes/image.routes.js'
import productRoutes from './routes/product.routes.js'
import categoryRoutes from './routes/category.routes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/images', imageRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 