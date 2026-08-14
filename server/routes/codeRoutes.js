import express from "express";
import { explainCode, debugCode } from "../controllers/codeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/explain", protect, explainCode);
router.post("/debug", protect, debugCode);

export default router;
