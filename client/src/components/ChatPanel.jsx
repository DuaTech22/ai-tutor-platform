import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VoiceAssistant from "./VoiceAssistant.jsx";
import TextChat from "./TextChat.jsx";
import { askTutor, playSpeech } from "../services/aiService.js";

function ChatPanel({ onEmotionChange, onTextChange, onThinkingChange }) {
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [language, setLanguage] = useState("en");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const speakAnswer = async (text, lang) => {
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio.currentTime = 0;
    }

    try {
      const audio = await playSpeech(text, lang);
      window.currentAudio = audio;
      audio.onended = () => {
        if (onEmotionChange) onEmotionChange("idle");
      };
    } catch (error) {
      console.error("Playback error:", error);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio.currentTime = 0;
    }
    setThinking(false);
    if (onEmotionChange) onEmotionChange("idle");
    if (onThinkingChange) onThinkingChange(false);
  };

  const handleSend = async (text, lang) => {
    const finalLang = lang || language;

    window.speechSynthesis.cancel();
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio.currentTime = 0;
    }

    setMessages((prev) => [...prev, { role: "user", text, lang: finalLang }]);
    setThinking(true);
    if (onEmotionChange) onEmotionChange("celebrate");
    if (onThinkingChange) onThinkingChange(true);

    try {
      const answer = await askTutor(text, finalLang);
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        { role: "nova", text: answer, lang: finalLang },
      ]);
      if (onThinkingChange) onThinkingChange(false);
      if (onTextChange) onTextChange(answer);
      speakAnswer(answer, finalLang);
    } catch (error) {
      setThinking(false);
      console.error("AI request failed:", error);
      const fallback =
        finalLang === "ur"
          ? "Maazrat, mujhe jawab dene mein mushkil hui. Dobara koshish karein."
          : "Sorry, I had trouble answering that. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "nova", text: fallback, lang: finalLang },
      ]);
      if (onThinkingChange) onThinkingChange(false);
      if (onTextChange) onTextChange(fallback);
      speakAnswer(fallback, finalLang);
      if (onEmotionChange) onEmotionChange("idle");
    }
  };

  return (
    <div className="w-[90vw] max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col overflow-hidden">
      {/* Shared language toggle for both text and voice */}
      <div className="flex justify-center pt-3">
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
      </div>

      <div className="h-72 md:h-80 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && !thinking && (
          <p className="text-slate-500 text-sm text-center m-auto">
            Ask Nova anything — type or use the mic below.
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-500 text-white rounded-br-sm"
                  : "bg-white/10 text-slate-200 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        <AnimatePresence>
          {thinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 px-4 py-2 rounded-2xl rounded-bl-sm">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-white/10 p-3 flex items-center gap-2">
        <TextChat onSend={handleSend} language={language} compact />
        <VoiceAssistant
          onTranscript={handleSend}
          onStop={handleStop}
          compact
          language={language}
          onLanguageChange={setLanguage}
        />
      </div>
    </div>
  );
}

export default ChatPanel;
