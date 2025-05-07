import jwt from 'jsonwebtoken'
import { sendError } from '../helpers/HelperError.js'

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 401, "Unauthorized")
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, Bun.env.JWT_SECRET, (err, decoded) => {
        if (err) return sendError(res, 401, "Unauthorized")
        req.user = decoded
        next()
    })
}

export const verifyAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN") return sendError(res, 403, "Forbidden: Admins only")
    next()
}

export const verifyUser = (req, res, next) => {
    if (req.user.role !== "USER") return sendError(res, 403, "Forbidden: Users only")
    next()
}
