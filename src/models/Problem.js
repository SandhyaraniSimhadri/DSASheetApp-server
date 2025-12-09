import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
  title: String,
  youtubeUrl: String,
  leetcodeUrl: String,
  codeforcesUrl: String,
  articleUrl: String,
  level: { type: String, enum: ["easy", "medium", "hard"] },
});

export default mongoose.model("Problem", problemSchema);
