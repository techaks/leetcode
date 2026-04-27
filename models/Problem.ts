import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },

  description: { type: String, required: true },
  constraints: { type: String, required: true },

  // 🔥 Examples (UI show)
  examples: [
    {
      input: String,
      output: String,
    },
  ],

  // 🔥 Test cases
  publicTestCases: [
    {
      input: Object,
      output: String,
    },
  ],

  privateTestCases: [
    {
      input: Object,
      output: String,
    },
  ],

  // 🔥 Function name (important)
  functionName: {
    type: String,
    required: true,
  },

  // 🔥 Templates (user sees)
  templates: {
    cpp: { type: String, required: true },
    python: { type: String, required: true },
  },

  // 🔥 Wrappers (system uses)
  wrappers: {
    cpp: { type: String, required: true },
    python: { type: String, required: true },
  },

}, { timestamps: true });

export default mongoose.models.Problem ||
  mongoose.model("Problem", ProblemSchema);