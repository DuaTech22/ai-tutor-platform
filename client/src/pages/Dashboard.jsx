import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getCourses } from "../services/courseService.js";
import Navbar from "../components/Navbar.jsx";

function Dashboard() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="pt-24 px-6 max-w-6xl mx-auto pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-academic text-3xl font-bold text-white">
              Welcome back, {user?.name} 👋
            </h1>
            <p className="text-slate-400 mt-1">
              Here's your learning overview.
            </p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 rounded-lg px-4 py-2 transition-colors"
          >
            Log Out
          </button>
        </div>

        <Link
          to="/study"
          className="block bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-xl p-6 mb-8 hover:from-indigo-500/30 hover:to-purple-500/30 transition-colors"
        >
          <h3 className="text-white font-semibold mb-1">✨ Study with Nova</h3>
          <p className="text-slate-400 text-sm">
            Generate university-level notes and a quiz on any Computer Science
            topic, instantly.
          </p>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm mb-1">Courses Available</h3>
            <p className="text-3xl font-bold text-white">{courses.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm mb-1">Lessons Completed</h3>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm mb-1">Certificates Earned</h3>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white mb-4">Your Courses</h2>

        {loading ? (
          <p className="text-slate-400">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-slate-400">
            No courses yet. An admin needs to add some, or your database isn't
            connected — check your <code className="text-indigo-300">MONGO_URI</code> in{" "}
            <code className="text-indigo-300">server/.env</code>.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-white font-semibold mb-2">{course.title}</h3>
                <p className="text-slate-400 text-sm">{course.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
