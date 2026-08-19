import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-slate-900/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-academic text-xl font-bold text-white">
          AI<span className="text-indigo-400">Tutor</span>
        </Link>

        <div className="hidden lg:flex items-center gap-6 text-sm text-slate-300">
          <Link
            to="/#how-it-works"
            className="hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link to="/courses" className="hover:text-white transition-colors">
            Courses
          </Link>
          <Link to="/forum" className="hover:text-white transition-colors">
            Forum
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className="hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          )}
          {user && (
            <Link to="/study" className="hover:text-white transition-colors">
              Notes
            </Link>
          )}
          {user && (
            <Link to="/my-notes" className="hover:text-white transition-colors">
              My Notes
            </Link>
          )}
          {user && (
            <Link to="/code" className="hover:text-white transition-colors">
              Code
            </Link>
          )}
          {user && (
            <Link
              to="/whiteboard"
              className="hover:text-white transition-colors"
            >
              Whiteboard
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-white transition-colors">
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />
          {user ? (
            <button
              onClick={logout}
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Log Out
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
