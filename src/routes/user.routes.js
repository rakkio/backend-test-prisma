import { Router } from "express"
import { createUser, loginUser, getUserById } from "../controllers/user.controllers.js"
import { verifyToken } from "../auth/Auth.js"
    
const router = Router();

router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/me", verifyToken, getUserById)

export default router;