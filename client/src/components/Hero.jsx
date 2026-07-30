import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import RobotScene from "./robot/RobotScene.jsx";
import VoiceAssistant from "./VoiceAssistant.jsx";
import { speak } from "../utils/speak.js";

function Hero() {
  const [transcript, setTranscript] = useState("");

  const handleTranscript = (text) => {
    setTranscript(text);
    speak(
      "Great question! Binary Search works by repeatedly dividing the search range in half.",
      () => {},
    );
  };

  return (
    <section className="relative min-h-screen bg-slate-900 overflow-hidden flex flex-col items-center justify-center pt-20 pb-20">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-white mb-0"
        >
          Meet <span className="text-indigo-400">Nova</span>, Your Personal AI
          Tutor
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center items-center w-full -mt-8 -mb-60"
        >
          <RobotScene emotion="idle" />
        </motion.div>

        {/* Mic button right below the robot */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center gap-2 mb-6 translate-x-55"
        >
          <VoiceAssistant onTranscript={handleTranscript} />
          {transcript && (
            <p className="text-slate-400 text-sm">You said: "{transcript}"</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            to="/register"
            className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-8 py-3 rounded-lg transition-colors"
          >
            Start Learning Free
          </Link>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            {
              title: "AI-Powered",
              desc: "Personalized explanations for every student",
            },
            {
              title: "Interactive",
              desc: "Voice assistant and live coding help",
            },
            {
              title: "Track Progress",
              desc: "Quizzes, certificates, and dashboards",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 text-left"
            >
              <h3 className="text-white font-semibold mb-2">{card.title}</h3>
              <p className="text-slate-400 text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
