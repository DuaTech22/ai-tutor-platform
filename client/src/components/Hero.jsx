import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import RobotScene from "./robot/RobotScene.jsx";
import Blackboard from "./Blackboard.jsx";
import ChatWidget from "./ChatWidget.jsx";
import { askTutor, playSpeech } from "../services/aiService.js";

function Hero() {
  // ... (all the same functions, keep as is)

  return (
    // ✅ Updated: better mobile padding
    <section className="relative bg-slate-900 overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-8 md:pb-12 px-3 sm:px-4">
      {/* Background blobs - keep as is */}

      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4 md:px-6 flex flex-col items-center text-center">
        {/* Badge - keep as is */}

        {/* ✅ Updated: smaller heading on mobile */}
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

        {/* Robot + Blackboard - keep as is */}
        <div className="flex flex-col md:flex-row items-start justify-center gap-4 sm:gap-6 md:gap-8 w-full mb-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center items-center flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px] mx-auto md:mx-0"
          >
            <RobotScene emotion={emotion} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto md:mx-0 w-full max-w-xs sm:max-w-sm"
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

        {/* Button - keep as is */}
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

        {/* ✅ Updated: Stats with better mobile sizing */}
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

        {/* Feature cards - keep as is */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
          {/* ... cards ... */}
        </div>
      </div>

      <ChatWidget onEmotionChange={setEmotion} onThinkingChange={setThinking} />
    </section>
  );
}

export default Hero;
