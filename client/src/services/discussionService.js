import axios from "axios";
import { API_BASE_URL } from "../config.js";

const API_URL = `${API_BASE_URL}/discussions`;

export async function getDiscussions() {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function createDiscussion(title, body, tag, token) {
  const res = await axios.post(
    API_URL,
    { title, body, tag },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
}

export async function addReply(discussionId, body, token) {
  const res = await axios.post(
    `${API_URL}/${discussionId}/reply`,
    { body },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
}

export async function deleteDiscussion(discussionId, token) {
  const res = await axios.delete(`${API_URL}/${discussionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
