import multer from 'multer'
import cloudinary from '../db/cloudinary.js'
import { sendError } from '../helpers/HelperError.js'

// Configurazione multer per memorizzare temporaneamente i file
const storage = multer.memoryStorage()

// Configurazione per i filtri dei file
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('File tipo non supportato. Per favore carica solo JPEG, JPG, PNG o WEBP.'), false)
  }
}

// Configurazione multer per entrambi i tipi di upload
export const imageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

// Middleware per gestire gli errori di upload
export const handleUploadError = (req, res, next) => {
  return (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return sendError(res, 400, 'File troppo grande')
      }
      return sendError(res, 400, `Errore di upload: ${err.message}`)
    } else if (err) {
      return sendError(res, 400, err.message)
    }
    next()
  }
}

// Funzione per caricare l'immagine su Cloudinary
export const uploadToCloudinary = async (file, folder = 'products') => {
  // Converti il buffer in una stringa base64 per Cloudinary
  const b64 = Buffer.from(file.buffer).toString('base64')
  const dataURI = `data:${file.mimetype};base64,${b64}`
  
  try {
    // Carica su Cloudinary
    const result = await cloudinary.v2.uploader.upload(dataURI, {
      folder: `china/${folder}`,
      resource_type: 'auto'
    })
    
    // Restituisci i dati dell'immagine
    return {
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      url: result.secure_url
    }
  } catch (error) {
    throw new Error(`Errore durante il caricamento su Cloudinary: ${error.message}`)
  }
}

// Funzione per eliminare un'immagine da Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.v2.uploader.destroy(publicId)
    return true
  } catch (error) {
    throw new Error(`Errore durante l'eliminazione da Cloudinary: ${error.message}`)
  }
}
