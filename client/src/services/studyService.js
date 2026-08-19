import axios from "axios";
import { API_BASE_URL } from "../config.js";

const API_URL = `${API_BASE_URL}/generate`;

export async function generateNotes(topic, level, token) {
  const res = await axios.post(
    `${API_URL}/notes`,
    { topic, level },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.notes;
}

export async function generateQuiz(topic, notes, level, token) {
  const res = await axios.post(
    `${API_URL}/quiz`,
    { topic, notes, level },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.questions;
}
