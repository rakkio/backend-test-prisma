import { Router } from "express"
import { 
  uploadProductImage, 
  uploadCategoryImage, 
  deleteProductImage, 
  getProductImages 
} from "../controllers/Admin/image.controllers.js"
import { verifyToken, verifyAdmin } from "../auth/Auth.js"
import { imageUpload, handleUploadError } from "../storage/uploaders.js"

const router = Router()

router.use(verifyToken, verifyAdmin)

router.post(
  "/products/:productId",
  imageUpload.single('image'),
  (req, res, next) => {
    const handler = handleUploadError(req, res, next)
    handler(null) 
  },
  uploadProductImage
)

router.get("/products/:productId", getProductImages)
router.delete("/products/:imageId", deleteProductImage)

router.post(
  "/categories/:categoryId",
  imageUpload.single('image'),
  (req, res, next) => {
    const handler = handleUploadError(req, res, next)
    handler(null) 
  },
  uploadCategoryImage
)

export default router 