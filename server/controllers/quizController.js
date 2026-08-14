import Quiz from "../models/Quiz.js";
import Progress from "../models/Progress.js";
import { createNotification } from "./notificationController.js";

export const getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch quizzes" });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch quiz" });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: "Could not create quiz" });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete quiz" });
  }
};

export const submitQuizScore = async (req, res) => {
  try {
    const { courseId, quizId, score } = req.body;
    const userId = req.user.id;

    let progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
      progress = await Progress.create({
        user: userId,
        course: courseId,
        completedLessons: [],
        quizScores: [{ quizId, score }],
      });
    } else {
      progress.quizScores.push({ quizId, score });
      await progress.save();
    }

    res.json(progress);

    createNotification(
      userId,
      `You scored ${score} on a quiz. Keep up the great work!`,
      "quiz",
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save quiz score" });
  }
};
