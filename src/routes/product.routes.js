import { Router } from "express"
import { 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from "../controllers/Admin/product.controllers.js"
import { verifyToken, verifyAdmin } from "../auth/Auth.js"
import { getProductById , getAllProducts } from "../controllers/product.controllers.js"

const router = Router()

router.get("/", getAllProducts)
router.get("/:id", getProductById)

router.use(verifyToken, verifyAdmin)
router.post("/", createProduct)
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct)

export default router
