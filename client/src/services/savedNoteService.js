import axios from "axios";
import { API_BASE_URL } from "../config.js";

const API_URL = `${API_BASE_URL}/saved-notes`;

export async function getSavedNotes(token) {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function saveNote(topic, notes, level, token) {
  const res = await axios.post(
    API_URL,
    { topic, notes, level },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
}

export async function deleteSavedNote(id, token) {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
