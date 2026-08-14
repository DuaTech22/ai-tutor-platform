import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext.jsx";
import { generateNotes, generateQuiz } from "../services/studyService.js";

const suggestedTopics = [
  "Arrays and Linked Lists",
  "Binary Search Trees",
  "Recursion",
  "Big-O Notation",
  "Process Scheduling (OS)",
  "Normalization (DBMS)",
  "TCP vs UDP",
  "Object-Oriented Programming Principles",
];

function Study() {
  const { token } = useAuth();
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("beginner");
  const [notes, setNotes] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [error, setError] = useState("");

  const [quiz, setQuiz] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleGenerateNotes = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) return;

    setError("");
    setNotes("");
    setQuiz(null);
    setFinished(false);
    setLoadingNotes(true);

    try {
      const result = await generateNotes(topic, level, token);
      setNotes(result);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Could not generate notes. Please try again."
      );
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setError("");
    setLoadingQuiz(true);
    setQuiz(null);
    setCurrent(0);
    setScore(0);
    setFinished(false);

    try {
      const questions = await generateQuiz(topic, notes, level, token);
      setQuiz(questions);
    } catch (err) {
      setError(
        err.response?.data?.error || "Could not generate a quiz. Please try again."
      );
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleAnswer = (selected) => {
    const isCorrect = selected === quiz[current].correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (current + 1 < quiz.length) {
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="pt-24 px-6 max-w-4xl mx-auto pb-20 text-white">
        <h1 className="font-academic text-3xl font-bold mb-2">Study with Nova</h1>
        <p className="text-slate-400 mb-8">
          Enter any Computer Science topic — Nova will generate university-level
          notes, then a quiz to test your understanding.
        </p>

        <form onSubmit={handleGenerateNotes} className="flex gap-2 mb-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Binary Search Trees, Process Scheduling, Normalization..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-indigo-400"
          />
          <button
            type="submit"
            disabled={loadingNotes}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {loadingNotes ? "Generating..." : "Generate Notes"}
          </button>
        </form>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-slate-400">Level:</span>
          <div className="flex bg-white/5 border border-white/10 rounded-full p-1 text-xs">
            <button
              onClick={() => setLevel("beginner")}
              className={`px-3 py-1 rounded-full transition-colors ${
                level === "beginner" ? "bg-indigo-500 text-white" : "text-slate-400"
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => setLevel("advanced")}
              className={`px-3 py-1 rounded-full transition-colors ${
                level === "advanced" ? "bg-indigo-500 text-white" : "text-slate-400"
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {suggestedTopics.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTopic(t);
              }}
              className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded-full transition-colors"
            >
              {t}
            </button>
          ))}
        </div>

        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {notes && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
            <div className="markdown-notes">
              <ReactMarkdown>{notes}</ReactMarkdown>
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={loadingQuiz}
              className="mt-6 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              {loadingQuiz ? "Generating quiz..." : "Test Yourself: Generate a Quiz"}
            </button>
          </div>
        )}

        {quiz && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 text-center">
            {finished ? (
              <div>
                <h2 className="text-2xl font-bold mb-2">Quiz Complete! 🎉</h2>
                <p className="text-slate-300 mb-4">
                  Score: {score} / {quiz.length}
                </p>
                <button
                  onClick={handleGenerateQuiz}
                  className="text-indigo-400 hover:underline text-sm"
                >
                  Generate a new quiz on this topic
                </button>
              </div>
            ) : (
              <div>
                <p className="text-slate-400 text-sm mb-2">
                  Question {current + 1} of {quiz.length}
                </p>
                <h2 className="text-xl font-bold mb-6">
                  {quiz[current].question}
                </h2>
                <div className="space-y-3 text-left">
                  {quiz[current].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className="block w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Study;
