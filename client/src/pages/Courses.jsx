import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { getCourses } from "../services/courseService.js";

function Courses() {
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
        <h1 className="text-3xl font-bold text-white mb-8">All Courses</h1>

        {loading ? (
          <p className="text-slate-400">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-slate-400">
            No courses available yet. Add some from the Admin Panel, or check
            your database connection.
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
                {course.category && (
                  <span className="inline-block mt-3 text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">
                    {course.category}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
