import express from "express";
import Topic from "../models/Topic.js";
import Problem from "../models/Problem.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET ALL TOPICS
router.get("/", authMiddleware, async (req, res) => {
  const topics = await Topic.find().sort({ order: 1 });

  // fetch all problems
  const allProblems = await Problem.find();
  const completed = req.user.completedProblems.map(id => id.toString());

  const enriched = topics.map(topic => {
    const topicProblems = allProblems.filter(p => p.topic.toString() === topic._id.toString());
    const completedCount = topicProblems.filter(p => completed.includes(p._id.toString())).length;

    return {
      ...topic._doc,
      totalProblems: topicProblems.length,
      completedProblems: completedCount,
      status: completedCount === topicProblems.length ? "Completed" : "Pending"
    };
  });

  res.json(enriched);
});

// CREATE NEW TOPIC
router.post("/", authMiddleware, async (req, res) => {
  try {
    const topic = await Topic.create(req.body);
    res.status(201).json(topic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating topic" });
  }
});

// GET PROBLEMS FOR TOPIC
router.get("/:topicId/problems", authMiddleware, async (req, res) => {
  const problems = await Problem.find({ topic: req.params.topicId });
  res.json(problems);
});

// CREATE PROBLEM UNDER TOPIC
router.post("/:topicId/problems", authMiddleware, async (req, res) => {
  try {
    const problem = await Problem.create({
      ...req.body,
      topic: req.params.topicId,
    });
    res.status(201).json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating problem" });
  }
});

export default router;
