import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import ChatPanel from "./ChatPanel.jsx";

function ChatWidget({ onEmotionChange, onTextChange, onThinkingChange }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40 flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? (
          <X className="w-6 h-6 md:w-7 md:h-7 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-50"
          >
            <ChatPanel
              onEmotionChange={onEmotionChange}
              onTextChange={onTextChange}
              onThinkingChange={onThinkingChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatWidget;
