import axios from "axios";
import { API_BASE_URL } from "../config.js";

const API_URL = `${API_BASE_URL}/diagram`;

// ✅ Mermaid function
export async function generateDiagram(topic, token) {
  const res = await axios.post(
    `${API_URL}/generate`,
    { topic },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.diagram;
}

// ✅ PlantUML function - MUST HAVE THIS
export async function generatePlantUML(topic, diagramType, token) {
  const res = await axios.post(
    `${API_URL}/plantuml`,
    { topic, diagramType: diagramType || "flowchart" },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data; // { diagram, imageUrl, svgUrl, format }
}
