import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import commentController from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/:ticketId", verifyToken, commentController.addComment);
router.get("/:ticketId", verifyToken, commentController.getCommentsByTicket);

export default router;
