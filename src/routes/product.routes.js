import { Router } from "express"
import { 
    createProduct, 
    getAllProducts, 
    
    updateProduct, 
    deleteProduct 
} from "../controllers/Admin/product.controllers.js"
import { verifyToken, verifyAdmin } from "../auth/Auth.js"
import { getProductById } from "../controllers/product.controllers.js"

const router = Router()

// Rotte pubbliche (accessibili a tutti)
router.get("/", getAllProducts)
router.get("/:id", getProductById)

// Rotte protette (solo admin)
router.use(verifyToken, verifyAdmin)
router.post("/", createProduct)
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct)

export default router
