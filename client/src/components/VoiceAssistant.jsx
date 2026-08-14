import { useState, useRef } from "react";
import { Mic, Square, X } from "lucide-react";
import { convertToRoman } from "../services/aiService.js";

function VoiceAssistant({ onTranscript, onStop, compact }) {
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en");
  const recognitionRef = useRef(null);

  const stopEverything = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    window.speechSynthesis.cancel();
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio.currentTime = 0;
      window.currentAudio = null;
    }
    setListening(false);
    if (onStop) onStop();
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition isn't supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "ur" ? "ur-PK" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = async (event) => {
      let transcript = event.results[0][0].transcript;

      if (language === "ur") {
        try {
          transcript = await convertToRoman(transcript);
        } catch (err) {
          console.error("Roman conversion failed:", err);
        }
      }

      onTranscript(transcript, language);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => setLanguage(language === "en" ? "ur" : "en")}
          className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-slate-300 hover:bg-white/10 transition-colors"
          title="Toggle language"
        >
          {language === "en" ? "EN" : "UR"}
        </button>

        <button
          onClick={startListening}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            listening
              ? "bg-red-500"
              : "bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          }`}
        >
          {listening && (
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
          )}
          {listening ? (
            <Square className="w-4 h-4 text-white relative z-10" fill="white" />
          ) : (
            <Mic className="w-4 h-4 text-white relative z-10" strokeWidth={2} />
          )}
        </button>

        <button
          onClick={stopEverything}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
          title="Stop"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex bg-white/5 border border-white/10 rounded-full p-1 text-xs">
        <button
          onClick={() => setLanguage("en")}
          className={`px-3 py-1 rounded-full transition-colors ${
            language === "en" ? "bg-indigo-500 text-white" : "text-slate-400"
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage("ur")}
          className={`px-3 py-1 rounded-full transition-colors ${
            language === "ur" ? "bg-indigo-500 text-white" : "text-slate-400"
          }`}
        >
          Urdu
        </button>
      </div>

      <div className="flex items-center gap-3">
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

        <button
          onClick={stopEverything}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
          title="Stop"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}

export default VoiceAssistant;
