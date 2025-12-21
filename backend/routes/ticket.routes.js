const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticket.controller");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

/* CREATE TICKET */
router.post("/", verifyToken, ticketController.createTicket);

/* GET ALL TICKETS */
router.get("/", verifyToken, ticketController.getTickets);

/* GET SINGLE TICKET */
router.get("/:id", verifyToken, ticketController.getTicketById);

/* UPDATE TICKET */
router.patch("/:id", verifyToken, ticketController.updateTicket);

/* ASSIGN TICKET (ADMIN ONLY) */
router.put("/:id/assign", verifyToken, isAdmin, ticketController.assignTicket);

module.exports = router;
