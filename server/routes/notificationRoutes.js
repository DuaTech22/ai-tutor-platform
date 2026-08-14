import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAllRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.post("/mark-read", protect, markAllRead);

export default router;
