import axios from "axios";
import { API_BASE_URL } from "../config.js";

const API_URL = `${API_BASE_URL}/progress`;

export async function getProgress(courseId, token) {
  const res = await axios.get(`${API_URL}/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function markLessonComplete(courseId, lessonTitle, token) {
  const res = await axios.post(
    `${API_URL}/${courseId}/complete-lesson`,
    { lessonTitle },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
}
