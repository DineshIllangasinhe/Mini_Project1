const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticket.controller");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, ticketController.createTicket);

router.get("/", verifyToken, ticketController.getTickets);

router.get("/:id", verifyToken, ticketController.getTicketById);

router.patch("/:id", verifyToken, ticketController.updateTicket);

router.put("/:id/assign", verifyToken, isAdmin, ticketController.assignTicket);

module.exports = router;
