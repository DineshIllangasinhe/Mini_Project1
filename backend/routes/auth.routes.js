const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/users", verifyToken, isAdmin, authController.getAllUsers);

module.exports = router;
