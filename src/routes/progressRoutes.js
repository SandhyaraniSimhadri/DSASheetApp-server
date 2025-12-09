import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  res.json({ completedProblems: req.user.completedProblems });
});

router.post("/toggle", authMiddleware, async (req, res) => {
  const { problemId, completed } = req.body;
  const user = await User.findById(req.user._id);

  if (completed) user.completedProblems.push(problemId);
  else user.completedProblems = user.completedProblems.filter(id => id != problemId);

  await user.save();
  res.json({ completedProblems: user.completedProblems });
});

// SAVE LAST TOPIC
router.post("/save-last-topic", authMiddleware, async (req, res) => {
  const { topicId } = req.body;

  req.user.lastTopicId = topicId;
  await req.user.save();

  res.json({ message: "Last topic saved" });
});

export default router;
