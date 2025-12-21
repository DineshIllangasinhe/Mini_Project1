const { Ticket, User } = require("../models");
const { Op } = require("sequelize");

/* CREATE TICKET (User) */
exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      created_by: req.user.id,
    });

    res.status(201).json({
      message: "Ticket created",
      ticket,
    });
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* GET TICKETS (RBAC + FILTER + SEARCH + PAGINATION) */
exports.getTickets = async (req, res) => {
  try {
    const { status, q, page = 1, limit = 5 } = req.query;

    const where = {};

    // RBAC: normal user sees only own tickets
    if (req.user.role === "user") {
      where.created_by = req.user.id;
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Search
    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await Ticket.findAndCountAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [["created_at", "DESC"]],
      include: [
        { model: User, as: "creator", attributes: ["id", "email"] },
        { model: User, as: "assignee", attributes: ["id", "email"] },
      ],
    });

    res.json({
      page: Number(page),
      limit: Number(limit),
      total: count,
      data: rows,
    });
  } catch (error) {
    console.error("Get tickets error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* GET SINGLE TICKET */
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "email"] },
        { model: User, as: "assignee", attributes: ["id", "email"] },
      ],
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // RBAC: user can only access own ticket
    if (req.user.role === "user" && ticket.created_by !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Get ticket error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* UPDATE TICKET */
exports.updateTicket = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // RBAC: user can update only own ticket
    if (req.user.role === "user" && ticket.created_by !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await ticket.update({ title, description, status });

    res.json({ message: "Ticket updated" });
  } catch (error) {
    console.error("Update ticket error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ASSIGN TICKET (Admin) */
exports.assignTicket = async (req, res) => {
  try {
    const { assigned_to } = req.body;

    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await ticket.update({ assigned_to });

    res.json({ message: "Ticket assigned" });
  } catch (error) {
    console.error("Assign ticket error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
