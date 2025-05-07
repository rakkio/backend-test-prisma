import prisma from '../../db/db.js'
import { sendError, validateFields } from '../../helpers/HelperError.js'

export const createProduct = async(req, res) => {
    try {
        if (!validateFields(['name', 'price', 'quantity', 'description', 'categoryId'], req.body)) {
            return sendError(res, 400, "Tutti i campi sono richiesti")
        }

        const { name, price, quantity, description, categoryId } = req.body

        const category = await prisma.category.findUnique({
            where: { id: parseInt(categoryId) }
        })

        if (!category) {
            return sendError(res, 404, "Categoria non trovata")
        }

        const product = await prisma.product.create({ 
            data: { 
                name, 
                price: parseInt(price), 
                quantity: parseInt(quantity), 
                description,
                categoryId: parseInt(categoryId)
            },
            include: {
                category: true,
                images: true
            }
        })
        
        res.status(201).json({ 
            message: "Prodotto creato con successo",
            product 
        })
    } catch (error) {
        sendError(res, 500, "Errore nella creazione del prodotto", error)
    }
}

export const updateProduct = async(req, res) => {
    try {
        const { id } = req.params
        const { name, price, quantity, description, categoryId } = req.body
        
        // Verifica che il prodotto esista
        const existingProduct = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        })
        
        if (!existingProduct) {
            return sendError(res, 404, "Prodotto non trovato")
        }
        
        // Costruisci l'oggetto di aggiornamento
        const updateData = {}
        if (name) updateData.name = name
        if (price) updateData.price = parseInt(price)
        if (quantity) updateData.quantity = parseInt(quantity)
        if (description) updateData.description = description
        
        // Se viene fornita una categoria, verifica che esista
        if (categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: parseInt(categoryId) }
            })
            
            if (!category) {
                return sendError(res, 404, "Categoria non trovata")
            }
            
            updateData.categoryId = parseInt(categoryId)
        }
        
        // Aggiorna il prodotto
        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                images: true,
                category: true
            }
        })
        
        res.status(200).json({ 
            message: "Prodotto aggiornato con successo",
            product 
        })
    } catch (error) {
        sendError(res, 500, "Errore nell'aggiornamento del prodotto", error)
    }
}

// Elimina un prodotto
export const deleteProduct = async(req, res) => {
    try {
        const { id } = req.params
        
        // Verifica che il prodotto esista
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                images: true
            }
        })
        
        if (!product) {
            return sendError(res, 404, "Prodotto non trovato")
        }
        
        // Elimina prima tutte le immagini associate
        if (product.images.length > 0) {
            // Importa deleteFromCloudinary solo quando serve, per evitare dipendenze circolari
            const { deleteFromCloudinary } = await import('../../storage/uploaders.js')
            
            // Elimina ogni immagine da Cloudinary
            for (const image of product.images) {
                await deleteFromCloudinary(image.publicId)
            }
            
            // Elimina tutte le immagini dal database
            await prisma.image.deleteMany({
                where: { productId: parseInt(id) }
            })
        }
        
        // Ora elimina il prodotto
        await prisma.product.delete({
            where: { id: parseInt(id) }
        })
        
        res.status(200).json({ message: "Prodotto eliminato con successo" })
    } catch (error) {
        sendError(res, 500, "Errore nell'eliminazione del prodotto", error)
    }
}       
