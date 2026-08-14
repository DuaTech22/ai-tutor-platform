import express from "express";
import { askTutor, convertToRoman } from "../controllers/aiController.js";
import { textToSpeech } from "../controllers/ttsController.js";

const router = express.Router();
router.post("/ask", askTutor);
router.post("/speak", textToSpeech);
router.post("/to-roman", convertToRoman);

export default router;
