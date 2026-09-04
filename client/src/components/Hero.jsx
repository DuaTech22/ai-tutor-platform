import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import RobotScene from "./robot/RobotScene.jsx";
import Blackboard from "./Blackboard.jsx";
import ChatWidget from "./ChatWidget.jsx";
import { askTutor, playSpeech } from "../services/aiService.js";

function Hero() {
  const [emotion, setEmotion] = useState("idle");
  const [level, setLevel] = useState("beginner");
  const [boardText, setBoardText] = useState("");
  const [thinking, setThinking] = useState(false);
  const requestIdRef = useRef(0);

  const speakWithBoardSync = async (text, lang, requestId) => {
    setBoardText("");

    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio.currentTime = 0;
    }
    if (window.currentTypingTimer) {
      clearInterval(window.currentTypingTimer);
      window.currentTypingTimer = null;
    }

    try {
      const audio = await playSpeech(text, lang);

      if (requestId !== requestIdRef.current) {
        audio.pause();
        return;
      }

      window.currentAudio = audio;

      const startTyping = (duration) => {
        const words = text.split(" ");
        const interval = duration / words.length;

        let index = 0;
        const timer = setInterval(() => {
          if (requestId !== requestIdRef.current) {
            clearInterval(timer);
            return;
          }
          if (index < words.length) {
            setBoardText((prev) =>
              prev ? prev + " " + words[index] : words[index],
            );
            index++;
          } else {
            clearInterval(timer);
          }
        }, interval);

        window.currentTypingTimer = timer;
      };

      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        startTyping(audio.duration * 1000);
      } else {
        audio.onloadedmetadata = () => {
          if (requestId !== requestIdRef.current) return;
          startTyping(audio.duration * 1000);
        };
        setTimeout(() => {
          if (
            !window.currentTypingTimer &&
            requestId === requestIdRef.current
          ) {
            const estimatedDuration = text.split(" ").length * 400;
            startTyping(estimatedDuration);
          }
        }, 500);
      }

      audio.onended = () => {
        if (window.currentTypingTimer) clearInterval(window.currentTypingTimer);
        window.currentTypingTimer = null;
        if (requestId === requestIdRef.current) {
          setBoardText(text);
          setEmotion("idle");
        }
      };
    } catch (error) {
      console.error("Playback error:", error);
      if (requestId === requestIdRef.current) {
        setBoardText(text);
        setEmotion("idle");
      }
    }
  };

  const handleBoardTranscript = async (text, lang) => {
    requestIdRef.current += 1;
    const thisRequestId = requestIdRef.current;

    window.speechSynthesis.cancel();
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio.currentTime = 0;
    }
    if (window.currentTypingTimer) {
      clearInterval(window.currentTypingTimer);
      window.currentTypingTimer = null;
    }

    setBoardText("");
    setThinking(true);
    setEmotion("celebrate");

    try {
      const answer = await askTutor(text, lang, level);

      if (thisRequestId !== requestIdRef.current) return;

      setThinking(false);
      speakWithBoardSync(answer, lang, thisRequestId);
    } catch (error) {
      if (thisRequestId !== requestIdRef.current) return;

      setThinking(false);
      console.error("AI request failed:", error);
      const fallback =
        lang === "ur"
          ? "Maazrat, mujhe jawab dene mein mushkil hui. Dobara koshish karein."
          : "Sorry, I had trouble answering that. Please try again.";
      speakWithBoardSync(fallback, lang, thisRequestId);
    }
  };

  const handleBoardStop = () => {
    requestIdRef.current += 1;

    window.speechSynthesis.cancel();
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio.currentTime = 0;
    }
    if (window.currentTypingTimer) {
      clearInterval(window.currentTypingTimer);
      window.currentTypingTimer = null;
    }
    setThinking(false);
    setBoardText("");
    setEmotion("idle");
  };

  return (
    <section className="relative bg-slate-900 overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-8 md:pb-12 px-3 sm:px-4">
      {/* Animated moving background blobs */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, 25, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 right-1/3 w-56 h-56 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4 md:px-6 flex flex-col items-center text-center">
        {/* Floating credibility badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: [0, -4, 0] }}
          transition={{
            opacity: { duration: 0.5 },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs text-slate-300 mb-4 sm:mb-6"
        >
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          AI-Powered Learning Platform — Learn Smarter with Nova
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-academic text-2xl sm:text-3xl md:text-6xl font-bold text-white mb-3 sm:mb-4"
        >
          Meet{" "}
          <motion.span
            className="text-indigo-400 inline-block"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Nova
          </motion.span>
          , Your Personal AI Tutor
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-slate-400 max-w-xl mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base"
        >
          Ask a question by voice or text, in English or Roman Urdu, and get a
          clear, spoken explanation instantly. Generate study notes, quizzes,
          diagrams, and get coding help — all in one place.
        </motion.p>

        {/* ✅ Robot + Blackboard section - Robot Centered */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full mb-0">
          {/* Robot - Centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center items-center flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] mx-auto"
          >
            <RobotScene emotion={emotion} />
          </motion.div>

          {/* Blackboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px]"
          >
            <Blackboard
              text={boardText}
              thinking={thinking}
              onTranscript={handleBoardTranscript}
              onStop={handleBoardStop}
              level={level}
              onLevelChange={setLevel}
            />
          </motion.div>
        </div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-3 sm:mt-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/register"
              className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-colors shadow-lg shadow-indigo-500/20 text-sm sm:text-base"
            >
              Start Learning Free
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full mt-8 sm:mt-12 md:mt-16 mb-12 sm:mb-16 border-y border-white/10 py-6 sm:py-8"
        >
          {[
            { value: "24/7", label: "AI Tutor Availability" },
            { value: "2", label: "Languages Supported" },
            { value: "10+", label: "CS Subject Areas" },
            { value: "100%", label: "Free to Get Started" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <p className="font-academic text-xl sm:text-2xl md:text-3xl font-bold text-white">
                {stat.value}
              </p>
              <p className="text-slate-500 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1 leading-tight">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
          {[
            {
              title: "AI-Powered Tutoring",
              desc: "Personalized, step-by-step explanations for every Computer Science topic.",
            },
            {
              title: "Voice & Text, Bilingual",
              desc: "Ask by speaking or typing, in English or Roman Urdu — Nova responds either way.",
            },
            {
              title: "Notes, Quizzes & Diagrams",
              desc: "Generate university-level study notes, self-test quizzes, and visual diagrams instantly.",
            },
            {
              title: "Coding Assistant",
              desc: "Paste your code and get a line-by-line explanation or help fixing a bug.",
            },
            {
              title: "Discussion Forum",
              desc: "Ask questions and discuss topics with other students in the community.",
            },
            {
              title: "Track Your Progress",
              desc: "Quiz scores, courses, and downloadable certificates, all in your dashboard.",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.4)" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 text-left cursor-default"
            >
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                {card.title}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <ChatWidget onEmotionChange={setEmotion} onThinkingChange={setThinking} />
    </section>
  );
}

export default Hero;
