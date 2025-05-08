import express from 'express'
import cors from 'cors'
import userRoutes from './src/routes/user.routes.js'
import imageRoutes from './src/routes/image.routes.js'
import productRoutes from './src/routes/product.routes.js'
import categoryRoutes from './src/routes/category.routes.js'
const app = express()

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["Content-Range", "X-Content-Range"]
}))

app.use(express.json())

const PORT = Bun.env.PORT || 4000

app.use('/api/user', userRoutes)
app.use('/api/users', userRoutes)
app.use('/api/images', imageRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

