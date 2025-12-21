const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comment.controller");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/:ticketId", verifyToken, commentController.addComment);

router.get("/:ticketId", verifyToken, commentController.getCommentsByTicket);

module.exports = router;
