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
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative rounded-lg p-3 bg-gradient-to-b from-[#8b5a2b] to-[#6b4423] shadow-2xl">
        <div
          className="relative rounded-md overflow-hidden px-5 md:px-6 py-5 md:py-6 flex flex-col"
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
            className="relative z-10 text-white/90 text-base md:text-lg mb-3 border-b border-dashed border-white/20 pb-2"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            Nova — Study Notes
          </p>

          {/* Fixed-height scrollable text area -- never grows and pushes the button below */}
          <div className="relative z-10 h-40 md:h-48 overflow-y-auto pr-1">
            {thinking ? (
              <p
                className="text-indigo-300 text-sm md:text-base animate-pulse"
                style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                writing an answer...
              </p>
            ) : text ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/90 text-sm md:text-base leading-relaxed"
                style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                {text}
              </motion.p>
            ) : (
              <p
                className="text-white/40 text-sm italic"
                style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                Ask a question — Nova will write the answer here.
              </p>
            )}
          </div>

          <div className="relative z-10 flex justify-center pt-3 mt-2 border-t border-dashed border-white/20 flex-shrink-0">
            <div className="flex flex-col items-center gap-2">
              <div className="flex bg-white/5 border border-white/10 rounded-full p-0.5 text-[10px]">
                <button
                  onClick={() => onLevelChange && onLevelChange("beginner")}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
                    level !== "advanced"
                      ? "bg-indigo-500 text-white"
                      : "text-slate-400"
                  }`}
                >
                  Beginner
                </button>
                <button
                  onClick={() => onLevelChange && onLevelChange("advanced")}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
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

        <div className="h-3 mt-1 rounded-full bg-gradient-to-b from-[#a67c52] to-[#7a5230] shadow-inner flex items-center justify-center gap-1">
          <div className="w-6 h-1.5 bg-white/80 rounded-sm" />
          <div className="w-4 h-1.5 bg-white/60 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export default Blackboard;
