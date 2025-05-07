import prisma from '../db/db'
import jwt from 'jsonwebtoken'
import { sendError, validateFields } from '../helpers/HelperError'




const generateToken = (userId) => {
    return jwt.sign({ userId }, Bun.env.JWT_SECRET, { expiresIn: '1h' })
}



const createUser = async (req, res) => {
    try {
        if (!validateFields(['name', 'email', 'password'], req.body)) {
            return sendError(res, 400, "All fields are required")
        }
        const { name, email, password } = req.body
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) return sendError(res, 400, "User already exists")
        const hashedPassword = await Bun.password.hash(password)
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        })
        res.status(201).json({ message: "User created successfully", user })
    } catch (error) {
        sendError(res, 500, "User creation failed", error)
    }
}

const loginUser = async (req, res) => {
    try {
        if (!validateFields(['email', 'password'], req.body)) {
            return sendError(res, 400, "All fields are required")
        }
        const { email, password } = req.body
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return sendError(res, 400, "User not found")
        const isPasswordValid = await Bun.password.verify(password, user.password)
        if (!isPasswordValid) return sendError(res, 400, "Invalid password")
        const token = generateToken(user.id)
        res.status(200).json({ message: "Login successful", token })
    } catch (error) {
        sendError(res, 500, "Login failed", error)
    }
}

export { createUser, loginUser };
