import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password_hash: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({ message: "User registered", userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ accessToken: token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.findAll({ where: { role: "user" }, attributes: ["id", "email"] });
  res.json(users);
};

export default { register, login, getAllUsers };
