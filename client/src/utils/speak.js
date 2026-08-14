// Fallback browser-based text-to-speech utility (kept for reference).
// The app primarily uses the backend playSpeech() in aiService.js instead.
export function speak(text, onEnd) {
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1.1;

  if (onEnd) utterance.onend = onEnd;

  window.speechSynthesis.speak(utterance);
}
