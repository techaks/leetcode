 import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    authorName: { type: String, required: true },
    authorEmail: { type: String, required: true },
    content: { type: String, required: true, maxlength: 1000 },


   likes: {
  type: [String],
  default: [],  
},
  },
  { timestamps: true }
);

export default mongoose.models.Post ||
  mongoose.model("Post", PostSchema);