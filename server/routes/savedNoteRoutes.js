import express from "express";
import {
  getSavedNotes,
  saveNote,
  deleteSavedNote,
} from "../controllers/savedNoteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getSavedNotes);
router.post("/", protect, saveNote);
router.delete("/:id", protect, deleteSavedNote);

export default router;
