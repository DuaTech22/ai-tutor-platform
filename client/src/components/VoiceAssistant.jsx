import { useState, useRef } from "react";
import { Mic, Square } from "lucide-react";

function VoiceAssistant({ onTranscript }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition isn't supported in this browser. Please use Chrome.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <button
      onClick={startListening}
      className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
        listening
          ? "bg-red-500 shadow-red-500/50"
          : "bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/40"
      }`}
    >
      {listening && (
        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
      )}
      {listening ? (
        <Square className="w-6 h-6 text-white relative z-10" fill="white" />
      ) : (
        <Mic className="w-7 h-7 text-white relative z-10" strokeWidth={2} />
      )}
    </button>
  );
}

export default VoiceAssistant;
