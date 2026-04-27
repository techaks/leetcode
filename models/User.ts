import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  // 🔥 solved problems + date
  solvedProblems: [
    {
      problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
      solvedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // 🔥 streak system
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
  },

  lastSolvedDate: {
    type: String, // "YYYY-MM-DD"
    default: null,
  },
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);