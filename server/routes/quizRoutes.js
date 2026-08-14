import express from "express";
import * as quizController from "../controllers/quizController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/course/:courseId", quizController.getQuizzesByCourse);
router.get("/:id", quizController.getQuizById);
router.post("/", protect, adminOnly, quizController.createQuiz);
router.delete("/:id", protect, adminOnly, quizController.deleteQuiz);
router.post("/submit-score", protect, quizController.submitQuizScore);

export default router;
