import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export async function registerUser(name, email, password) {
  const res = await axios.post(`${API_URL}/register`, { name, email, password });
  return res.data;
}

export async function loginUser(email, password) {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
}
