export function speak(text, onEnd) {
  // Stop any currently playing speech first
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1.1;
  utterance.lang = "en-US";

  if (onEnd) utterance.onend = onEnd;

  window.speechSynthesis.speak(utterance);
}
