import axios from "axios";

const API_URL = "http://localhost:5000/api/diagram";

export async function generateDiagram(topic, token) {
  const res = await axios.post(
    `${API_URL}/generate`,
    { topic },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.diagram;
}
