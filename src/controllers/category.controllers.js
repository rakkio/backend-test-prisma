import prisma from '../db/db.js'
import { sendError } from '../helpers/HelperError.js'

export const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                products: {
                    select: {
                        id: true
                    }
                }
            }
        })
        
        const formattedCategories = categories.map(category => ({
            id: category.id,
            name: category.name,
            image: category.image,
            productsCount: category.products.length,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        }))
        
        res.status(200).json(formattedCategories)
    } catch (error) {
        sendError(res, 500, "Errore nel recupero delle categorie", error)
    }
}


export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) },
            include: {
                products: {
                    include: {
                        images: true
                    }
                }
            }
        })
        
        if (!category) {
            return sendError(res, 404, "Categoria non trovata")
        }
        
        res.status(200).json(category)
    } catch (error) {
        sendError(res, 500, "Errore nel recupero della categoria", error)
    }
}
