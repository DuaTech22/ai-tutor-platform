import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  type: { type: String, enum: ["mcq", "truefalse", "coding"], default: "mcq" },
  options: [String],
  correctAnswer: String,
});

const quizSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    title: String,
    questions: [questionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
