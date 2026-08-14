import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: [String],
    quizScores: [{ quizId: String, score: Number }],
  },
  { timestamps: true }
);

export default mongoose.model("Progress", progressSchema);
