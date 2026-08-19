import express from "express";
import {
  explainCode,
  debugCode,
  reviewCodeQuality,
} from "../controllers/codeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/explain", protect, explainCode);
router.post("/debug", protect, debugCode);
router.post("/review", protect, reviewCodeQuality);

export default router;
