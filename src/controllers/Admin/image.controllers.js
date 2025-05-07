import prisma from '../../db/db.js'
import { sendError } from '../../helpers/HelperError.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../../storage/uploaders.js'

export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, "Nessun file caricato")
    }

    const { productId } = req.params

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    })

    if (!product) {
      return sendError(res, 404, "Prodotto non trovato")
    }

    const imageData = await uploadToCloudinary(req.file, 'products')

    const image = await prisma.image.create({
      data: {
        publicId: imageData.publicId,
        width: imageData.width,
        height: imageData.height,
        format: imageData.format,
        url: imageData.url,
        productId: parseInt(productId)
      }
    })

    res.status(201).json({
      message: "Immagine caricata con successo",
      image
    })
  } catch (error) {
    sendError(res, 500, "Errore durante il caricamento dell'immagine", error)
  }
}

export const uploadCategoryImage = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, "Nessun file caricato")
    }

    const { categoryId } = req.params

    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) }
    })

    if (!category) {
      return sendError(res, 404, "Categoria non trovata")
    }

    const imageData = await uploadToCloudinary(req.file, 'categories')

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(categoryId) },
      data: { image: imageData.url }
    })

    res.status(200).json({
      message: "Immagine della categoria aggiornata con successo",
      category: updatedCategory
    })
  } catch (error) {
    sendError(res, 500, "Errore durante l'aggiornamento dell'immagine della categoria", error)
  }
}

export const deleteProductImage = async (req, res) => {
  try {
    const { imageId } = req.params

    const image = await prisma.image.findUnique({
      where: { id: parseInt(imageId) }
    })

    if (!image) {
      return sendError(res, 404, "Immagine non trovata")
    }

    // Elimina da Cloudinary
    await deleteFromCloudinary(image.publicId)

    // Elimina l'immagine dal database
    await prisma.image.delete({
      where: { id: parseInt(imageId) }
    })

    res.status(200).json({
      message: "Immagine eliminata con successo"
    })
  } catch (error) {
    sendError(res, 500, "Errore durante l'eliminazione dell'immagine", error)
  }
}

export const getProductImages = async (req, res) => {
  try {
    const { productId } = req.params

    const images = await prisma.image.findMany({
      where: { productId: parseInt(productId) }
    })

    res.status(200).json(images)
  } catch (error) {
    sendError(res, 500, "Errore durante il recupero delle immagini", error)
  }
} 