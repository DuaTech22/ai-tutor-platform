import { useState } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { explainCode, debugCode } from "../services/codeService.js";

const languages = [
  "javascript",
  "python",
  "java",
  "cpp",
  "c",
  "csharp",
  "typescript",
];

function CodingAssistant() {
  const { token } = useAuth();
  const [code, setCode] = useState(
    "// Paste or write your code here, then click Explain or Debug",
  );
  const [language, setLanguage] = useState("javascript");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");

  const handleExplain = async () => {
    setError("");
    setResult("");
    setMode("explain");
    setLoading(true);
    try {
      const explanation = await explainCode(code, language, token);
      setResult(explanation);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDebug = async () => {
    setError("");
    setResult("");
    setMode("debug");
    setLoading(true);
    try {
      const debugResult = await debugCode(code, language, errorMessage, token);
      setResult(debugResult);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="pt-24 px-6 max-w-6xl mx-auto pb-20 text-white">
        <h1 className="font-academic text-3xl font-bold mb-2">
          Coding Assistant
        </h1>
        <p className="text-slate-400 mb-6">
          Paste your code and let Nova explain it line by line, or help you
          debug an error.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
              >
                {languages.map((l) => (
                  <option key={l} value={l} className="bg-slate-800">
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/10">
              <Editor
                height="400px"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{ fontSize: 14, minimap: { enabled: false } }}
              />
            </div>

            <input
              placeholder="Optional: paste the error message you're seeing"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              className="w-full mt-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />

            <div className="flex gap-3 mt-3">
              <button
                onClick={handleExplain}
                disabled={loading}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                {loading && mode === "explain"
                  ? "Explaining..."
                  : "Explain Code"}
              </button>
              <button
                onClick={handleDebug}
                disabled={loading}
                className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                {loading && mode === "debug" ? "Debugging..." : "Debug / Fix"}
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 min-h-[400px]">
            <h2 className="font-semibold mb-3 text-slate-300 text-sm">
              Nova's Response
            </h2>
            {error && (
              <p className="text-red-300 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {loading ? (
              <p className="text-indigo-300 text-sm animate-pulse">
                Nova is thinking through your code...
              </p>
            ) : result ? (
              <div className="markdown-notes">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">
                Your explanation or debugging results will appear here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodingAssistant;
