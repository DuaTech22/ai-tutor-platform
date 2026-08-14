import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { getQuizzesForCourse, submitQuizScore } from "../services/courseService.js";
import { useAuth } from "../context/AuthContext.jsx";

function Quiz() {
  const { id: courseId } = useParams();
  const { token } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuizzesForCourse(courseId)
      .then((quizzes) => setQuiz(quizzes[0] || null))
      .catch(() => setQuiz(null))
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleAnswer = async (selected) => {
    const question = quiz.questions[current];
    const isCorrect = selected === question.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (current + 1 < quiz.questions.length) {
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
      if (token) {
        try {
          await submitQuizScore(token, courseId, quiz._id, newScore);
        } catch (err) {
          console.error("Could not save score:", err);
        }
      }
    }
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
    </div>
  );
}

export default Quiz;
