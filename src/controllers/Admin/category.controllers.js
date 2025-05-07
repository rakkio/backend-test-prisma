import prisma from '../../db/db.js'
import { sendError, validateFields } from '../../helpers/HelperError.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../../storage/uploaders.js'

export const createCategory = async (req, res) => {
    try {
        if (!validateFields(['name'], req.body)) {
            return sendError(res, 400, "Il nome della categoria è richiesto")
        }
        const { name } = req.body
        const existingCategory = await prisma.category.findFirst({
            where: { name }
        })
        if (existingCategory) {
            return sendError(res, 400, "Esiste già una categoria con questo nome")
        }
        
        // Immagine di default per le categorie se non viene caricata un'immagine
        let image = "https://res.cloudinary.com/youraccountname/image/upload/china/default/placeholder_category.png"
        
        if (req.file) {
            const imageData = await uploadToCloudinary(req.file, 'categories')
            image = imageData.url
        }
        
        const category = await prisma.category.create({
            data: { 
                name,
                image
            }
        })
        
        res.status(201).json({
            message: "Categoria creata con successo",
            category
        })
    } catch (error) {
        sendError(res, 500, "Errore nella creazione della categoria", error)
    }
}


export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body
        
        const existingCategory = await prisma.category.findUnique({
            where: { id: parseInt(id) }
        })
        
        if (!existingCategory) {
            return sendError(res, 404, "Categoria non trovata")
        }
        
        const updateData = {}
        if (name) updateData.name = name
        
        if (req.file) {
            const imageData = await uploadToCloudinary(req.file, 'categories')
            updateData.image = imageData.url
        }
        
        const category = await prisma.category.update({
            where: { id: parseInt(id) },
            data: updateData
        })
        
        res.status(200).json({
            message: "Categoria aggiornata con successo",
            category
        })
    } catch (error) {
        sendError(res, 500, "Errore nell'aggiornamento della categoria", error)
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) },
            include: {
                products: true
            }
        })
        
        if (!category) {
            return sendError(res, 404, "Categoria non trovata")
        }
        
        if (category.products.length > 0) {
            return sendError(res, 400, "Impossibile eliminare la categoria: ci sono prodotti associati")
        }
        await prisma.category.delete({
            where: { id: parseInt(id) }
        })
        res.status(200).json({ message: "Categoria eliminata con successo" })
    } catch (error) {
        sendError(res, 500, "Errore nell'eliminazione della categoria", error)
    }
} 