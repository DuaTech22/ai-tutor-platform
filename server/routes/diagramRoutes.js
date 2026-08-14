import express from "express";
import { generateDiagram } from "../controllers/diagramController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/generate", protect, generateDiagram);

export default router;
