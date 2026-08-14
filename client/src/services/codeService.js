import axios from "axios";

const API_URL = "http://localhost:5000/api/code";

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
