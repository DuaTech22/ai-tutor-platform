import axios from "axios";

const API_URL = "http://localhost:5000/api/ai";

export async function askTutor(question, language = "en", level = "beginner") {
  const res = await axios.post(`${API_URL}/ask`, { question, language, level });
  return res.data.answer;
}

export async function playSpeech(text, language = "en") {
  const response = await axios.post(
    `${API_URL}/speak`,
    { text, language },
    { responseType: "blob" }
  );

  const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
  return audio;
}

export async function convertToRoman(text) {
  const res = await axios.post(`${API_URL}/to-roman`, { text });
  return res.data.roman;
}
