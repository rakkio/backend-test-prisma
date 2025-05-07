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
const loginUser = async ( req, res ) => { 
    try { 
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) { 
            return res.status(400).json({
                message: "User not found"
            })
        }
        const isPasswordValid = await Bun.password.verify(password, user.password)
        if (!isPasswordValid) { 
            return res.status(400).json({
                message: "Invalid password"
            })
        }
        const token = generateToken(user.id)
        res.status(200).json({
            message: "Login successful",
            token
        })
    } catch (error) { 
        res.status(500).json({
            message: "Login failed",
            error: error.message
        })
    }
}
export { createUser, loginUser };
