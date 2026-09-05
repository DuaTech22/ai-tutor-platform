import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { generatePlantUML } from "../services/diagramService.js";

const suggestions = [
  { label: "Binary Search Algorithm Flow", type: "flowchart" },
  { label: "OSI Model Layers", type: "flowchart" },
  { label: "Process Lifecycle in an OS", type: "flowchart" },
  { label: "Client-Server Request Flow", type: "sequence" },
  { label: "Bubble Sort Steps", type: "flowchart" },
  { label: "Database Normalization Stages", type: "flowchart" },
  { label: "Student Management System", type: "component" },
  { label: "ATM Withdrawal Sequence", type: "sequence" },
];

function Diagram() {
  const { token } = useAuth();
  const [topic, setTopic] = useState("");
  const [diagramType, setDiagramType] = useState("flowchart");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [renderFailed, setRenderFailed] = useState(false);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) return;

    setError("");
    setImageUrl("");
    setRenderFailed(false);
    setLoading(true);

    try {
      const result = await generatePlantUML(topic, diagramType, token);
      setImageUrl(result.imageUrl);
    } catch (err) {
      console.error("❌ Diagram error:", err);
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
          Diagram
        </h1>
        <p className="text-slate-400 mb-6 text-sm md:text-base">
          Enter a topic and Nova will generate a diagram for you.
        </p>

        <form onSubmit={handleGenerate} className="flex flex-col gap-3 mb-3">
          <div className="flex flex-col sm:flex-row gap-2">
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
          </div>

          {/* Diagram Type Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 text-xs font-medium">Type:</span>
            {["flowchart", "sequence", "component"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDiagramType(type)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  diagramType === type
                    ? "bg-indigo-500 text-white"
                    : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </form>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2 mb-8">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => {
                setTopic(s.label);
                setDiagramType(s.type);
              }}
              className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded-full transition-colors"
            >
              {s.label}
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

        {/* PlantUML Diagram Display */}
        {imageUrl && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 overflow-hidden">
            <img
              src={imageUrl}
              alt={topic}
              className="max-w-full h-auto"
              onError={() => setRenderFailed(true)}
            />
            {renderFailed && (
              <div className="mt-4 text-center">
                <p className="text-red-300 text-sm mb-2">
                  Failed to render diagram. Try again.
                </p>
                <button
                  onClick={handleGenerate}
                  className="text-indigo-400 text-sm hover:underline"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Diagram;
