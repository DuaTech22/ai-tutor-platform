import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar.jsx";
import {
  getCourseById,
  downloadCertificate,
  getQuizzesForCourse,
} from "../services/courseService.js";
import { getProgress } from "../services/progressService.js";
import { useAuth } from "../context/AuthContext.jsx";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openLesson, setOpenLesson] = useState(null);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const { user, token } = useAuth();

  const checkQuizCompletion = async () => {
    if (!token) return;
    try {
      const quizzes = await getQuizzesForCourse(id);
      if (!quizzes || quizzes.length === 0) {
        setHasCompletedQuiz(false);
        return;
      }

      const progress = await getProgress(id, token);
      const quizIds = quizzes.map((q) => q._id);
      const completed = (progress.quizScores || []).some((score) =>
        quizIds.includes(score.quizId),
      );
      setHasCompletedQuiz(completed);
    } catch (err) {
      setHasCompletedQuiz(false);
    }
  };

  useEffect(() => {
    getCourseById(id)
      .then(setCourse)
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
    checkQuizCompletion();
  }, [id]);

  const handleCertificate = async () => {
    if (!user || !course || !hasCompletedQuiz) return;
    try {
      await downloadCertificate(token, user.name, course.title);
    } catch (err) {
      alert("Could not generate certificate. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="pt-24 px-6 max-w-4xl mx-auto pb-16 text-white">
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : !course ? (
          <p className="text-slate-400">Course not found.</p>
        ) : (
          <>
            <h1 className="font-academic text-3xl font-bold mb-2">
              {course.title}
            </h1>
            <p className="text-slate-400 mb-8">{course.description}</p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                to={`/courses/${id}/quiz`}
                onClick={() => setTimeout(checkQuizCompletion, 500)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Take Quiz
              </Link>

              {user && (
                <button
                  onClick={handleCertificate}
                  disabled={!hasCompletedQuiz}
                  title={
                    !hasCompletedQuiz
                      ? "Complete the course quiz to unlock your certificate"
                      : ""
                  }
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                    hasCompletedQuiz
                      ? "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                      : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {hasCompletedQuiz
                    ? "🎓 Download Certificate"
                    : "🔒 Complete the quiz to unlock certificate"}
                </button>
              )}
            </div>

            <h2 className="text-xl font-semibold mb-4">Lessons</h2>
            {course.lessons && course.lessons.length > 0 ? (
              <div className="space-y-3">
                {course.lessons.map((lesson, i) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenLesson(openLesson === i ? null : i)}
                      className="w-full text-left p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <h3 className="font-semibold">
                        {i + 1}. {lesson.title}
                      </h3>
                      <span className="text-slate-500 text-sm">
                        {openLesson === i ? "hide" : "view notes"}
                      </span>
                    </button>

                    {openLesson === i && lesson.notes && (
                      <div className="px-4 pb-4 border-t border-white/10 pt-4">
                        <div className="markdown-notes">
                          <ReactMarkdown>{lesson.notes}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">
                No lessons added to this course yet.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
