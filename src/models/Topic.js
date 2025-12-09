import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  title: String,
  description: String,
  order: Number,
});

export default mongoose.model("Topic", topicSchema);
