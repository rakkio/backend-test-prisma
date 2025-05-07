import prisma from '../db/db'
import jwt from 'jsonwebtoken'


const generateToken = (userId) => {
    return jwt.sign({ userId }, Bun.env.JWT_SECRET, { expiresIn: '1h' })
}

const createUser = async ( req, res ) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: {email}
        })
        if (existingUser){ 
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const hashedPassword = await Bun.password.hash(password)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
            res.status(201).json({
                message: "User created successfully",
                user
            })
        } catch (error) {
            res.status(500).json({
                message: "User creation failed",
                error: error.message
            })
    }
}
export { createUser };