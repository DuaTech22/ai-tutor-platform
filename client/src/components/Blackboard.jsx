import { motion } from "framer-motion";
import VoiceAssistant from "./VoiceAssistant.jsx";

function Blackboard({
  text,
  thinking,
  onTranscript,
  onStop,
  level,
  onLevelChange,
}) {
  return (
    // ✅ Made WIDER - increased max width
    <div className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] mx-auto">
      <div className="relative rounded-lg p-2 sm:p-3 bg-gradient-to-b from-[#8b5a2b] to-[#6b4423] shadow-2xl">
        <div
          className="relative rounded-md overflow-hidden px-3 sm:px-4 py-3 sm:py-4 flex flex-col"
          style={{
            background: "#111111",
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.6)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          <p
            className="relative z-10 text-white/90 text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 border-b border-dashed border-white/20 pb-1.5 sm:pb-2 flex-shrink-0"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            Nova — Study Notes
          </p>

          <div className="relative z-10 h-28 sm:h-32 md:h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent">
            {thinking ? (
              <p
                className="text-indigo-300 text-xs sm:text-sm animate-pulse"
                style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                writing an answer...
              </p>
            ) : text ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/90 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words"
                style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                {text}
              </motion.p>
            ) : (
              <p
                className="text-white/40 text-xs sm:text-sm italic"
                style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                Ask a question — Nova will write the answer here.
              </p>
            )}
          </div>

          <div className="relative z-10 flex justify-center pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 border-t border-dashed border-white/20 flex-shrink-0">
            <div className="flex flex-col items-center gap-1 sm:gap-1.5">
              <div className="flex bg-white/5 border border-white/10 rounded-full p-0.5 text-[8px] sm:text-[10px]">
                <button
                  onClick={() => onLevelChange && onLevelChange("beginner")}
                  className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-colors ${
                    level !== "advanced"
                      ? "bg-indigo-500 text-white"
                      : "text-slate-400"
                  }`}
                >
                  Beginner
                </button>
                <button
                  onClick={() => onLevelChange && onLevelChange("advanced")}
                  className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-colors ${
                    level === "advanced"
                      ? "bg-indigo-500 text-white"
                      : "text-slate-400"
                  }`}
                >
                  Advanced
                </button>
              </div>
              <VoiceAssistant
                onTranscript={onTranscript}
                onStop={onStop}
                compact
              />
            </div>
          </div>
        </div>

        <div className="h-2 sm:h-3 mt-1 rounded-full bg-gradient-to-b from-[#a67c52] to-[#7a5230] shadow-inner flex items-center justify-center gap-1">
          <div className="w-4 sm:w-6 h-1 sm:h-1.5 bg-white/80 rounded-sm" />
          <div className="w-3 sm:w-4 h-1 sm:h-1.5 bg-white/60 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export default Blackboard;
