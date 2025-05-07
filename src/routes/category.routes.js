import { Router } from "express"
import { 
    createCategory, 
    getAllCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory 
} from "../controllers/Admin/category.controllers.js"
import { verifyToken, verifyAdmin } from "../auth/Auth.js"
import { imageUpload, handleUploadError } from "../storage/uploaders.js"

const router = Router()

// Rotte pubbliche (accessibili a tutti)
router.get("/", getAllCategories)
router.get("/:id", getCategoryById)

// Rotte protette (solo admin)
router.use(verifyToken, verifyAdmin)

// Middleware per l'upload delle immagini
const handleCategoryImage = (req, res, next) => {
    imageUpload.single('image')(req, res, (err) => {
        const handler = handleUploadError(req, res, next)
        handler(err)
    })
}

// CRUD per le categorie
router.post("/", handleCategoryImage, createCategory)
router.put("/:id", handleCategoryImage, updateCategory)
router.delete("/:id", deleteCategory)

export default router 