import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// REGISTER (works the same)
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const passwordHash = await User.hashPassword(password);

  await User.create({ name, email, passwordHash });

  res.json({ message: "User registered" });
});

// LOGIN - SEND TOKEN IN COOKIE
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await user.comparePassword(password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Send token inside HttpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // change to true in production with HTTPS
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Login successful", user });
});

router.get("/me", (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.userId)
      .select("-passwordHash")
      .then((user) => {
        if (!user) return res.status(401).json({ message: "User not found" });
        res.json({ user });
      });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

export default router;
