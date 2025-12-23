import { Ticket, User } from "../models/index.js";
import { Op } from "sequelize";

export const createTicket = async (req, res) => {
  const { title, description, priority } = req.body;
  const ticket = await Ticket.create({ title, description, priority, created_by: req.user.id });
  res.status(201).json({ message: "Ticket created", ticket });
};

export const getTickets = async (req, res) => {
  const { status, q, page = 1, limit = 5 } = req.query;
  const where = {};

  if (req.user.role === "user") where.created_by = req.user.id;
  if (status) where.status = status;
  if (q) {
    where[Op.or] = [
      { title: { [Op.like]: `%${q}%` } },
      { description: { [Op.like]: `%${q}%` } }
    ];
  }

  const { rows, count } = await Ticket.findAndCountAll({
    where,
    limit: Number(limit),
    offset: (page - 1) * limit,
    order: [["created_at", "DESC"]],
    include: [
      { model: User, as: "creator", attributes: ["id", "email"] },
      { model: User, as: "assignee", attributes: ["id", "email"] }
    ]
  });

  res.json({ page, limit, total: count, data: rows });
};
