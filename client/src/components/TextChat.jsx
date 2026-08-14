import { useState } from "react";
import { Send } from "lucide-react";

function TextChat({ onSend, language, compact }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input, language);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 flex-1 bg-white/5 border border-white/10 rounded-full px-3 ${
        compact ? "py-1.5" : "py-2"
      }`}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          language === "ur" ? "Apna sawal yahan likhein..." : "Type your question..."
        }
        className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 outline-none min-w-0"
      />
      <button
        type="submit"
        className="w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center transition-colors flex-shrink-0"
      >
        <Send className="w-3.5 h-3.5 text-white" />
      </button>
    </form>
  );
}

export default TextChat;
