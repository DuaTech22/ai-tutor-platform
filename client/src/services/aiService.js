import axios from "axios";

const API_URL = "http://localhost:5000/api/ai";

export async function askTutor(question) {
  const res = await axios.post(`${API_URL}/ask`, { question });
  return res.data.answer;
}
