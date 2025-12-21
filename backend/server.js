require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { sequelize } = require("./models");

const authRoutes = require("./routes/auth.routes");
const ticketRoutes = require("./routes/ticket.routes");
const commentRoutes = require("./routes/comment.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tickets", ticketRoutes);
app.use("/comments", commentRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
