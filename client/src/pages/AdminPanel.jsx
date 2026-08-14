import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import {
  getCourses,
  deleteCourse,
  getQuizzesForCourse,
  deleteQuiz,
} from "../services/courseService.js";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

function AdminPanel() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const [quizCourseId, setQuizCourseId] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const [quizMessage, setQuizMessage] = useState("");
  const [existingQuizzes, setExistingQuizzes] = useState([]);

  const [genTopic, setGenTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState("");

  const loadCourses = () => {
    getCourses()
      .then(setCourses)
      .catch(() => setCourses([]));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (quizCourseId) {
      getQuizzesForCourse(quizCourseId)
        .then(setExistingQuizzes)
        .catch(() => setExistingQuizzes([]));
    } else {
      setExistingQuizzes([]);
    }
  }, [quizCourseId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post(
        "http://localhost:5000/api/courses",
        { title, description, category, lessons: [] },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTitle("");
      setDescription("");
      setCategory("");
      setMessage("Course created successfully.");
      loadCourses();
    } catch (err) {
      setMessage(err.response?.data?.error || "Could not create course.");
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    try {
      await deleteCourse(id, token);
      loadCourses();
    } catch (err) {
      alert(err.response?.data?.error || "Could not delete course.");
    }
  };

  const handleGenerateCourse = async (e) => {
    e.preventDefault();
    setGenMessage("");
    setGenerating(true);
    try {
      await axios.post(
        "http://localhost:5000/api/generate/course",
        { topic: genTopic },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setGenTopic("");
      setGenMessage("Course generated and saved successfully.");
      loadCourses();
    } catch (err) {
      setGenMessage(
        err.response?.data?.error ||
          "Could not generate course. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setQuizMessage("");

    if (!quizCourseId) {
      setQuizMessage("Please select a course first.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/quizzes",
        { course: quizCourseId, title: quizTitle, questions },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setQuizMessage("Quiz created successfully.");
      setQuizTitle("");
      setQuestions([
        { question: "", options: ["", "", "", ""], correctAnswer: "" },
      ]);
      getQuizzesForCourse(quizCourseId).then(setExistingQuizzes);
    } catch (err) {
      setQuizMessage(err.response?.data?.error || "Could not create quiz.");
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      await deleteQuiz(id, token);
      getQuizzesForCourse(quizCourseId).then(setExistingQuizzes);
    } catch (err) {
      alert(err.response?.data?.error || "Could not delete quiz.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="pt-24 px-6 max-w-4xl mx-auto pb-16 text-white">
        <h1 className="font-academic text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-slate-500 text-xs mb-8">
          Note: your account needs role "admin" in the database for these
          actions to work.
        </p>

        {/* AI Course Generation */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-400/20 rounded-xl p-6 mb-10">
          <h2 className="font-semibold mb-1">
            ✨ Generate a Full Course with AI
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            Give Nova a topic and she'll design a complete course with full
            lessons.
          </p>
          {genMessage && (
            <p className="text-sm text-indigo-300 mb-3">{genMessage}</p>
          )}
          <form onSubmit={handleGenerateCourse} className="flex gap-2">
            <input
              placeholder="e.g. Operating Systems Fundamentals"
              required
              value={genTopic}
              onChange={(e) => setGenTopic(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            />
            <button
              type="submit"
              disabled={generating}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              {generating ? "Generating..." : "Generate Course"}
            </button>
          </form>
        </div>

        {/* Manual Course Creation */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
          <h2 className="font-semibold mb-4">Add a Course Manually</h2>
          {message && <p className="text-sm text-indigo-300 mb-3">{message}</p>}
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              placeholder="Course title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
              rows={3}
            />
            <input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            />
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-5 py-2 rounded-lg transition-colors"
            >
              Create Course
            </button>
          </form>
        </div>

        {/* Quiz Creation + Delete */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
          <h2 className="font-semibold mb-4">Manage Quizzes</h2>
          {quizMessage && (
            <p className="text-sm text-indigo-300 mb-3">{quizMessage}</p>
          )}

          <select
            value={quizCourseId}
            onChange={(e) => setQuizCourseId(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 mb-4"
          >
            <option value="" className="bg-slate-800">
              Select a course
            </option>
            {courses.map((c) => (
              <option key={c._id} value={c._id} className="bg-slate-800">
                {c.title}
              </option>
            ))}
          </select>

          {quizCourseId && existingQuizzes.length > 0 && (
            <div className="mb-4 space-y-2">
              <p className="text-xs text-slate-500">
                Existing quizzes for this course:
              </p>
              {existingQuizzes.map((q) => (
                <div
                  key={q._id}
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                >
                  <span className="text-sm">{q.title}</span>
                  <button
                    onClick={() => handleDeleteQuiz(q._id)}
                    className="text-red-400 text-xs hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleCreateQuiz} className="space-y-4">
            <input
              placeholder="Quiz title"
              required
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            />

            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-400">
                    Question {qIndex + 1}
                  </p>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-400 text-xs hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  placeholder="Question text"
                  required
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(qIndex, "question", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
                />
                {q.options.map((opt, oIndex) => (
                  <input
                    key={oIndex}
                    placeholder={`Option ${oIndex + 1}`}
                    required
                    value={opt}
                    onChange={(e) =>
                      updateOption(qIndex, oIndex, e.target.value)
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 text-sm"
                  />
                ))}
                <input
                  placeholder="Correct answer (must match one option exactly)"
                  required
                  value={q.correctAnswer}
                  onChange={(e) =>
                    updateQuestion(qIndex, "correctAnswer", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 text-sm"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="text-indigo-400 text-sm hover:underline"
            >
              + Add another question
            </button>

            <button
              type="submit"
              className="block bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-5 py-2 rounded-lg transition-colors"
            >
              Create Quiz
            </button>
          </form>
        </div>

        {/* Existing Courses with Delete */}
        <h2 className="font-semibold mb-4">Existing Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <div
              key={c._id}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-slate-400 text-sm">{c.description}</p>
                  {c.lessons?.length > 0 && (
                    <p className="text-xs text-slate-500 mt-2">
                      {c.lessons.length} lesson
                      {c.lessons.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteCourse(c._id)}
                  className="text-red-400 text-xs hover:underline flex-shrink-0 ml-3"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
