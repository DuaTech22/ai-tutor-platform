import express from "express";
import {
  getProgress,
  markLessonComplete,
} from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/:courseId", protect, getProgress);
router.post("/:courseId/complete-lesson", protect, markLessonComplete);

export default router;
