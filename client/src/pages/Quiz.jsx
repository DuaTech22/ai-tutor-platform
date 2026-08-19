import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import {
  getQuizzesForCourse,
  submitQuizScore,
} from "../services/courseService.js";
import { useAuth } from "../context/AuthContext.jsx";

function Quiz() {
  const { id: courseId } = useParams();
  const { token } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    getQuizzesForCourse(courseId)
      .then((quizzes) => setQuiz(quizzes[0] || null))
      .catch(() => setQuiz(null))
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleSelect = (option) => {
    if (answered) return;

    const question = quiz.questions[current];
    const isCorrect = option === question.correctAnswer;

    setSelected(option);
    setAnswered(true);
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = async () => {
    setSelected(null);
    setAnswered(false);

    if (current + 1 < quiz.questions.length) {
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
      if (token) {
        try {
          await submitQuizScore(token, courseId, quiz._id, score);
        } catch (err) {
          console.error("Could not save score:", err);
        }
      }
    }
  };

  const getOptionStyle = (option) => {
    const question = quiz.questions[current];

    if (!answered) {
      return "bg-white/5 hover:bg-white/10 border-white/10";
    }

    if (option === question.correctAnswer) {
      return "bg-emerald-500/20 border-emerald-400 text-emerald-200";
    }

    if (option === selected && option !== question.correctAnswer) {
      return "bg-red-500/20 border-red-400 text-red-200";
    }

    return "bg-white/5 border-white/10 opacity-50";
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="pt-24 px-6 max-w-xl mx-auto pb-16 text-white text-center">
        {loading ? (
          <p className="text-slate-400">Loading quiz...</p>
        ) : !quiz ? (
          <p className="text-slate-400">
            No quiz available for this course yet.
          </p>
        ) : finished ? (
          <div>
            <h2 className="text-2xl font-bold mb-2">Quiz Complete! 🎉</h2>
            <p className="text-slate-300">
              Score: {score} / {quiz.questions.length}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-slate-400 text-sm mb-2">
              Question {current + 1} of {quiz.questions.length}
            </p>
            <h2 className="text-xl font-bold mb-6">
              {quiz.questions[current].question}
            </h2>
            <div className="space-y-3 text-left">
              {quiz.questions[current].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={answered}
                  className={`block w-full text-left border rounded-lg p-3 transition-colors ${getOptionStyle(opt)}`}
                >
                  {opt}
                  {answered &&
                    opt === quiz.questions[current].correctAnswer && (
                      <span className="float-right text-emerald-300 text-xs">
                        ✓ Correct
                      </span>
                    )}
                  {answered &&
                    opt === selected &&
                    opt !== quiz.questions[current].correctAnswer && (
                      <span className="float-right text-red-300 text-xs">
                        ✗ Your answer
                      </span>
                    )}
                </button>
              ))}
            </div>

            {answered && (
              <button
                onClick={handleNext}
                className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
              >
                {current + 1 < quiz.questions.length
                  ? "Next Question"
                  : "Finish Quiz"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
