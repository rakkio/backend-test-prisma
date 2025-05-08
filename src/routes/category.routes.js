import { Router } from "express"
import { 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from "../controllers/Admin/category.controllers.js"
import { verifyToken, verifyAdmin } from "../auth/Auth.js"
import { imageUpload, handleUploadError } from "../storage/uploaders.js"
import { getAllCategories, getCategoryById } from "../controllers/category.controllers.js"

const router = Router()

router.get("/", getAllCategories)
router.get("/:id", getCategoryById)

router.use(verifyToken, verifyAdmin)

const handleCategoryImage = (req, res, next) => {
    imageUpload.single('image')(req, res, (err) => {
        const handler = handleUploadError(req, res, next)
        handler(err)
    })
}

router.post("/", handleCategoryImage, createCategory)
router.put("/:id", handleCategoryImage, updateCategory)
router.delete("/:id", deleteCategory)

export default router 