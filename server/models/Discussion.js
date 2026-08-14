import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

const discussionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    tag: { type: String, default: "General" },
    replies: [replySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Discussion", discussionSchema);
