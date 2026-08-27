import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar.jsx";
import {
  getCourseById,
  downloadCertificate,
} from "../services/courseService.js";
import {
  getProgress,
  markLessonComplete,
} from "../services/progressService.js";
import { useAuth } from "../context/AuthContext.jsx";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openLesson, setOpenLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const { user, token } = useAuth();

  const loadProgress = () => {
    if (!token) return;
    getProgress(id, token)
      .then((p) => setCompletedLessons(p.completedLessons || []))
      .catch(() => setCompletedLessons([]));
  };

  useEffect(() => {
    getCourseById(id)
      .then(setCourse)
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
    loadProgress();
  }, [id]);

  const handleMarkComplete = async (lessonTitle) => {
    try {
      await markLessonComplete(id, lessonTitle, token);
      loadProgress();
    } catch (err) {
      console.error(err);
    }
  };

  const allLessonsComplete =
    course &&
    course.lessons &&
    course.lessons.length > 0 &&
    course.lessons.every((l) => completedLessons.includes(l.title));

  const handleCertificate = async () => {
    if (!user || !course || !allLessonsComplete) return;
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
            <p className="text-slate-400 mb-2">{course.description}</p>

            {course.lessons?.length > 0 && (
              <p className="text-slate-500 text-sm mb-8">
                {completedLessons.length} of {course.lessons.length} lessons
                completed
              </p>
            )}

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                to={`/courses/${id}/quiz`}
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Take Quiz
              </Link>

              {user && (
                <button
                  onClick={handleCertificate}
                  disabled={!allLessonsComplete}
                  title={
                    !allLessonsComplete
                      ? "Complete all lessons to unlock your certificate"
                      : ""
                  }
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                    allLessonsComplete
                      ? "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                      : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {allLessonsComplete
                    ? "Download Certificate"
                    : "🔒 Complete all lessons to unlock certificate"}
                </button>
              )}
            </div>

            <h2 className="text-xl font-semibold mb-4">Lessons</h2>
            {course.lessons && course.lessons.length > 0 ? (
              <div className="space-y-3">
                {course.lessons.map((lesson, i) => {
                  const isComplete = completedLessons.includes(lesson.title);
                  return (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                    >
                      <div className="w-full flex items-center justify-between p-4">
                        <button
                          onClick={() =>
                            setOpenLesson(openLesson === i ? null : i)
                          }
                          className="text-left flex-1 flex items-center gap-2"
                        >
                          {isComplete && (
                            <span className="text-emerald-400 text-sm">✓</span>
                          )}
                          <h3 className="font-semibold">
                            {i + 1}. {lesson.title}
                          </h3>
                        </button>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {user && !isComplete && (
                            <button
                              onClick={() => handleMarkComplete(lesson.title)}
                              className="text-indigo-400 text-xs hover:underline"
                            >
                              Mark Complete
                            </button>
                          )}
                          <span className="text-slate-500 text-sm">
                            {openLesson === i ? "hide" : "view notes"}
                          </span>
                        </div>
                      </div>

                      {openLesson === i && lesson.notes && (
                        <div className="px-4 pb-4 border-t border-white/10 pt-4">
                          <div className="markdown-notes">
                            <ReactMarkdown>{lesson.notes}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
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
