import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import MermaidDiagram from "../components/MermaidDiagram.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { generateDiagram } from "../services/diagramService.js";

const suggestions = [
  "Binary Search Algorithm Flow",
  "OSI Model Layers",
  "Process Lifecycle in an OS",
  "Client-Server Request Flow",
  "Bubble Sort Steps",
  "Database Normalization Stages",
];

function Whiteboard() {
  const { token } = useAuth();
  const [topic, setTopic] = useState("");
  const [diagram, setDiagram] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [renderFailed, setRenderFailed] = useState(false);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) return;

    setError("");
    setDiagram("");
    setRenderFailed(false);
    setLoading(true);
    try {
      const result = await generateDiagram(topic, token);
      setDiagram(result);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Could not generate a diagram. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="pt-24 px-4 md:px-6 max-w-4xl mx-auto pb-20 text-white">
        <h1 className="font-academic text-2xl md:text-3xl font-bold mb-2">
          Whiteboard
        </h1>
        <p className="text-slate-400 mb-6 text-sm md:text-base">
          Ask Nova to draw a diagram or flowchart for any Computer Science
          concept.
        </p>

        <form
          onSubmit={handleGenerate}
          className="flex flex-col sm:flex-row gap-2 mb-3"
        >
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Binary Search Algorithm Flow"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-indigo-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {loading ? "Drawing..." : "Draw Diagram"}
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-8">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setTopic(s)}
              className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded-full transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {loading && (
          <p className="text-indigo-300 text-sm animate-pulse">
            Nova is sketching the diagram...
          </p>
        )}

        {diagram && (
          <div>
            <MermaidDiagram
              chart={diagram}
              onError={() => setRenderFailed(true)}
            />
            {renderFailed && (
              <div className="mt-4 text-center">
                <p className="text-red-300 text-sm mb-2">
                  This diagram didn't render correctly.
                </p>
                <button
                  onClick={handleGenerate}
                  className="text-indigo-400 text-sm hover:underline"
                >
                  Try generating it again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Whiteboard;
