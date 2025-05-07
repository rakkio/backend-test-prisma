import prisma from '../../db/db.js'
import { sendError } from '../../helpers/HelperError.js'

export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 12} = req.query
        const users = await prisma.user.findMany({
            skip: (page - 1) * limit,
            take: limit
        })
        const totalUsers = await prisma.user.count()
        const totalPages = Math.ceil(totalUsers / limit)
        res.status(200).json({ users, totalPages })
    } catch (error) {
        sendError(res, 500, "User retrieval failed", error)
    }
}
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params
        const { name, email, password } = req.body
        const user = await prisma.user.update({ where: { id: userId }, data: { name, email, password } })
        res.status(200).json({ user })
    } catch (error) {
        sendError(res, 500, "User update failed", error)
    }
}       

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params
        await prisma.user.delete({ where: { id: userId } })
        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        sendError(res, 500, "User deletion failed", error)
    }
}


