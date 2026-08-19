import SavedNote from "../models/SavedNote.js";

export async function getSavedNotes(req, res) {
  try {
    const notes = await SavedNote.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch saved notes" });
  }
}

export async function saveNote(req, res) {
  try {
    const { topic, notes, level } = req.body;

    if (!topic || !notes) {
      return res.status(400).json({ error: "Topic and notes are required" });
    }

    const savedNote = await SavedNote.create({
      user: req.user.id,
      topic,
      notes,
      level: level || "beginner",
    });

    res.status(201).json(savedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save notes" });
  }
}

export async function deleteSavedNote(req, res) {
  try {
    const note = await SavedNote.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!note) return res.status(404).json({ error: "Note not found" });

    await SavedNote.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete note" });
  }
}
