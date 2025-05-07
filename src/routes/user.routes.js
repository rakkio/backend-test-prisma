import { Router } from "express"
import { createUser, loginUser, getUserById } from "../controllers/user.controllers.js"
import { getAllUsers, getUserById, updateUser, deleteUser} from "../controllers/Admin/user.controllers.js"
import { verifyToken, verifyAdmin } from "../auth/Auth.js"
    
const router = Router();

// User Routes
router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/me", verifyToken, getUserById)

// Admin Routes
router.get("/", verifyAdmin, getAllUsers)
router.get("/:userId", verifyAdmin, getUserById)
router.put("/:userId", verifyAdmin, updateUser)
router.delete("/:userId", verifyAdmin, deleteUser)

export default router;