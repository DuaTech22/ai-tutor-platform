import express from "express";
import * as courseController from "../controllers/courseController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourseById);
router.post("/", protect, adminOnly, courseController.createCourse);
router.put("/:id", protect, adminOnly, courseController.updateCourse);
router.delete("/:id", protect, adminOnly, courseController.deleteCourse);

export default router;
