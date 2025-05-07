import prisma from '../db/db.js'
import { sendError, validateFields } from '../helpers/HelperError.js'


// Ottiene un singolo prodotto
export const getProductById = async(req, res) => {
    try {
        const { id } = req.params
        
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                images: true,
                category: true
            }
        })
        
        if (!product) {
            return sendError(res, 404, "Prodotto non trovato")
        }
        
        res.status(200).json({ product })
    } catch (error) {
        sendError(res, 500, "Errore nel recupero del prodotto", error)
    }
}


export const getAllProducts = async(req, res) => {
    try {
        const { page = 1, limit = 10, category } = req.query
        const skip = (parseInt(page) - 1) * parseInt(limit)
        
        // Costruisci i criteri di ricerca
        const where = {}
        if (category) {
            where.categoryId = parseInt(category)
        }
        
        // Ottieni il totale dei prodotti per la paginazione
        const total = await prisma.product.count({ where })
        
        // Ottieni i prodotti con immagini e categoria
        const products = await prisma.product.findMany({
            where,
            skip,
            take: parseInt(limit),
            include: {
                images: true,
                category: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        
        res.status(200).json({
            products,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page)
        })
    } catch (error) {
        sendError(res, 500, "Errore nel recupero dei prodotti", error)
    }
}
