import axios from "axios";
import { API_BASE_URL } from "../config.js";

const API_URL = `${API_BASE_URL}/auth`;

export async function registerUser(name, email, password) {
  const res = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
  });
  return res.data;
}

export async function loginUser(email, password) {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
}
