import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false, theme: "dark" });

let diagramCounter = 0;

function MermaidDiagram({ chart, onError }) {
  const ref = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!chart || !ref.current) return;

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
        setError("Could not render this diagram.");
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
