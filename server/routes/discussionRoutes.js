import express from "express";
import {
  getDiscussions,
  createDiscussion,
  addReply,
  deleteDiscussion,
} from "../controllers/discussionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", getDiscussions);
router.post("/", protect, createDiscussion);
router.post("/:id/reply", protect, addReply);
router.delete("/:id", protect, deleteDiscussion);

export default router;
