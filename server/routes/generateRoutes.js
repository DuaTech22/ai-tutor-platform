import express from "express";
import { generateNotes, generateQuiz, generateCourse } from "../controllers/generateController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/notes", protect, generateNotes);
router.post("/quiz", protect, generateQuiz);
router.post("/course", protect, adminOnly, generateCourse);

export default router;
