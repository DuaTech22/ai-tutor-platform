import axios from "axios";
import { API_BASE_URL } from "../config.js";

const API_URL = `${API_BASE_URL}/code`;

export async function explainCode(code, language, token) {
  const res = await axios.post(
    `${API_URL}/explain`,
    { code, language },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.explanation;
}

export async function debugCode(code, language, errorMessage, token) {
  const res = await axios.post(
    `${API_URL}/debug`,
    { code, language, errorMessage },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.result;
}

export async function reviewCodeQuality(code, language, token) {
  const res = await axios.post(
    `${API_URL}/review`,
    { code, language },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.review;
}
