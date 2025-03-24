import { Router } from "express";
import { Register, Login } from "../controllers/AuthController.js";
import { index, update } from "../controllers/ProfileController.js";
import AuthMiddleware from "../middleware/Authenticate.js";
const router = Router();
router.post("/auth/register", Register);
router.post("/auth/login", Login);
router.get("/profile", AuthMiddleware, index);
router.put("/profile/:userId", AuthMiddleware, update);

export default router;
