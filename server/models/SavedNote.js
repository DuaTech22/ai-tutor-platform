import mongoose from "mongoose";

const savedNoteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    notes: { type: String, required: true },
    level: { type: String, default: "beginner" },
  },
  { timestamps: true },
);

export default mongoose.model("SavedNote", savedNoteSchema);
