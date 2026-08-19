import axios from "axios";
import { API_BASE_URL } from "../config.js";

const API_URL = `${API_BASE_URL}/courses`;
const QUIZ_URL = `${API_BASE_URL}/quizzes`;
const CERT_URL = `${API_BASE_URL}/certificates`;

export async function getCourses() {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function getCourseById(id) {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
}

export async function deleteCourse(id, token) {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getQuizzesForCourse(courseId) {
  const res = await axios.get(`${QUIZ_URL}/course/${courseId}`);
  return res.data;
}

export async function deleteQuiz(id, token) {
  const res = await axios.delete(`${QUIZ_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function submitQuizScore(token, courseId, quizId, score) {
  const res = await axios.post(
    `${QUIZ_URL}/submit-score`,
    { courseId, quizId, score },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
}

export async function downloadCertificate(token, studentName, courseTitle) {
  const res = await axios.post(
    `${CERT_URL}/generate`,
    { studentName, courseTitle },
    { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" },
  );
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "certificate.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
}
