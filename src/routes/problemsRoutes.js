import express from "express";
import Problem from "../models/Problem.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const problems = await Problem.find().select("_id title level topic");
    res.json(problems);
  } catch (err) {
    console.error("Problem fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
