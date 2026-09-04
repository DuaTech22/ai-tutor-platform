import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// ✅ Initialize with suppressErrorRendering to hide debug messages
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  maxTextSize: 100000,
  suppressErrorRendering: true, // ← THIS HIDES THE "Syntax error" MESSAGE
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: "basis",
  },
});

let diagramCounter = 0;

function MermaidDiagram({ chart, onError }) {
  const ref = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!chart || !ref.current) return;

    // ✅ Skip if chart is too short
    if (chart.length < 10) {
      setError("Diagram code is too short. Please try again.");
      if (onError) onError();
      return;
    }

    // ✅ Validate it starts correctly
    const trimmed = chart.trim();
    if (!trimmed.startsWith("flowchart") && !trimmed.startsWith("graph")) {
      setError("Invalid diagram format. Please try again.");
      if (onError) onError();
      return;
    }

    diagramCounter += 1;
    const id = `mermaid-diagram-${diagramCounter}`;

    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
          setError("");
        }
      })
      .catch((err) => {
        console.error("Mermaid render error:", err);
        setError(
          "Could not render this diagram. Try a simpler topic or generate again.",
        );
        if (onError) onError();
      });
  }, [chart]);

  if (error) {
    return <p className="text-red-300 text-sm">{error}</p>;
  }

  return (
    <div
      ref={ref}
      className="bg-white/5 rounded-xl p-4 md:p-6 overflow-x-auto"
    />
  );
}

export default MermaidDiagram;
