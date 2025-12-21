const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comment.controller");
const { verifyToken } = require("../middleware/authMiddleware");

/* ADD COMMENT */
router.post("/:ticketId", verifyToken, commentController.addComment);

/* GET COMMENTS FOR TICKET */
router.get("/:ticketId", verifyToken, commentController.getCommentsByTicket);

module.exports = router;
