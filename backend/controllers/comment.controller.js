const { Comment, User, Ticket } = require("../models");

/* ADD COMMENT */
exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { ticketId } = req.params;

    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    // Ensure ticket exists
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const newComment = await Comment.create({
      ticket_id: ticketId,
      user_id: req.user.id,
      comment,
    });

    res.status(201).json({
      message: "Comment added",
      comment: newComment,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* GET COMMENTS FOR A TICKET */
exports.getCommentsByTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const comments = await Comment.findAll({
      where: { ticket_id: ticketId },
      order: [["created_at", "ASC"]],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "email"],
        },
      ],
    });

    res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
