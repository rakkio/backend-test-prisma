import express from 'express'
import cors from 'cors'
import userRoutes from './src/routes/user.routes.js'
const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["Content-Range", "X-Content-Range"]
}))

app.use(express.json())

const PORT = Bun.env.PORT || 4000

app.use('/api/user', userRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
