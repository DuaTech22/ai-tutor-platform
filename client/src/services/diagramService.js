import axios from "axios";
import { API_BASE_URL } from "../config.js";

const API_URL = `${API_BASE_URL}/diagram`;

export async function generateDiagram(topic, token) {
  const res = await axios.post(
    `${API_URL}/generate`,
    { topic },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.diagram;
}
