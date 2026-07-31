import express from "express";
import { askTutor } from "../controllers/aiController.js";

const router = express.Router();
router.post("/ask", askTutor);

export default router;
