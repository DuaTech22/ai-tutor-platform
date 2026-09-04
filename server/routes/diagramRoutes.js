import express from "express";
import { generateDiagram } from "../controllers/diagramController.js";
import {
  generateDiagramWithPlantUML,
  generateDiagramWithKroki,
  generateDiagramSelfHosted,
} from "../controllers/plantumlController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Existing Mermaid route
router.post("/generate", protect, generateDiagram);

// New PlantUML routes
router.post("/plantuml", protect, generateDiagramWithPlantUML);
router.post("/kroki", protect, generateDiagramWithKroki);
router.post("/selfhosted", protect, generateDiagramSelfHosted);

export default router;
