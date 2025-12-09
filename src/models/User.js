import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  completedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
  lastTopicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", default: null }
});


userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export default mongoose.model("User", userSchema);
