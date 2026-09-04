import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import MermaidDiagram from "../components/MermaidDiagram.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  generateDiagram,
  generatePlantUML,
} from "../services/diagramService.js";

const suggestions = [
  { label: "Binary Search Algorithm Flow", type: "flowchart" },
  { label: "OSI Model Layers", type: "flowchart" },
  { label: "Process Lifecycle in an OS", type: "flowchart" },
  { label: "Client-Server Request Flow", type: "sequence" },
  { label: "Bubble Sort Steps", type: "flowchart" },
  { label: "Database Normalization Stages", type: "flowchart" },
  { label: "Class Diagram: Student Management", type: "class" },
  { label: "ATM Withdrawal Sequence", type: "sequence" },
  { label: "Online Shopping Component", type: "component" },
];

function Whiteboard() {
  const { token } = useAuth();
  const [topic, setTopic] = useState("");
  const [diagramType, setDiagramType] = useState("flowchart");
  const [diagram, setDiagram] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [renderFailed, setRenderFailed] = useState(false);
  const [format, setFormat] = useState("mermaid"); // "mermaid" or "plantuml"

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) return;

    setError("");
    setDiagram("");
    setImageUrl("");
    setRenderFailed(false);
    setLoading(true);

    try {
      if (format === "plantuml") {
        // Use PlantUML
        const result = await generatePlantUML(topic, diagramType, token);
        setDiagram(result.diagram);
        setImageUrl(result.imageUrl);
        console.log("✅ PlantUML diagram generated!");
      } else {
        // Use Mermaid
        const result = await generateDiagram(topic, token);
        setDiagram(result);
        console.log("✅ Mermaid diagram generated!");
      }
    } catch (err) {
      console.error("❌ Diagram error:", err);

      // If PlantUML fails, try Mermaid as fallback
      if (format === "plantuml") {
        try {
          const result = await generateDiagram(topic, token);
          setDiagram(result);
          setFormat("mermaid");
          setError(
            "PlantUML failed, falling back to Mermaid. Try again if you want PlantUML.",
          );
        } catch (fallbackErr) {
          setError(
            err.response?.data?.error ||
              "Could not generate a diagram. Please try again.",
          );
        }
      } else {
        setError(
          err.response?.data?.error ||
            "Could not generate a diagram. Please try again.",
        );
      }
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
          Ask Nova to draw a diagram for any Computer Science concept. Choose
          between Mermaid (simple flowcharts) or PlantUML (advanced diagrams).
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

          {/* ⭐ FORMAT SELECTOR - Mermaid vs PlantUML */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 text-xs font-medium">Format:</span>
            <div className="flex bg-white/5 border border-white/10 rounded-full p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setFormat("mermaid")}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  format === "mermaid"
                    ? "bg-indigo-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Mermaid (Simple)
              </button>
              <button
                type="button"
                onClick={() => setFormat("plantuml")}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  format === "plantuml"
                    ? "bg-indigo-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                PlantUML (Advanced)
              </button>
            </div>
          </div>

          {/* ⭐ DIAGRAM TYPE SELECTOR - Only for PlantUML */}
          {format === "plantuml" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 text-xs font-medium">Type:</span>
              {["flowchart", "sequence", "class", "component", "activity"].map(
                (type) => (
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
                ),
              )}
            </div>
          )}
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
          <p className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {loading && (
          <p className="text-indigo-300 text-sm animate-pulse">
            Nova is sketching the diagram...
          </p>
        )}

        {/* PlantUML Diagram Display */}
        {format === "plantuml" && imageUrl && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <span className="text-indigo-400 text-xs font-medium">
                🔷 PlantUML
              </span>
              <span className="text-slate-500 text-xs">{diagramType}</span>
            </div>
            <img
              src={imageUrl}
              alt={topic}
              className="max-w-full h-auto"
              onError={() => setRenderFailed(true)}
            />
            {renderFailed && (
              <div className="mt-4 text-center">
                <p className="text-red-300 text-sm mb-2">
                  Failed to render PlantUML diagram.
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

        {/* Mermaid Diagram Display */}
        {format === "mermaid" && diagram && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-indigo-400 text-xs font-medium">
                🔶 Mermaid
              </span>
            </div>
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
