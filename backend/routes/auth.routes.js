import express from "express";
import authController from "../controllers/auth.controller.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/users", verifyToken, isAdmin, authController.getAllUsers);

export default router;
