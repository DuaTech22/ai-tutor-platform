import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: "/#how-it-works", label: "Features", show: true },
    { to: "/courses", label: "Courses", show: true },
    { to: "/forum", label: "Forum", show: true },
    { to: "/dashboard", label: "Dashboard", show: !!user },
    { to: "/study", label: "Notes", show: !!user },
    { to: "/my-notes", label: "My Notes", show: !!user },
    { to: "/code", label: "Code", show: !!user },
    { to: "/whiteboard", label: "Whiteboard", show: !!user },
    { to: "/admin", label: "Admin", show: user?.role === "admin" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-slate-900/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="font-academic text-xl font-bold text-white"
          onClick={() => setMenuOpen(false)}
        >
          AI<span className="text-indigo-400">Tutor</span>
        </Link>

        <div className="hidden lg:flex items-center gap-6 text-sm text-slate-300">
          {links
            .filter((l) => l.show)
            .map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
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

        {/* Mobile: notification bell + hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <NotificationBell />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-9 h-9 flex items-center justify-center text-white"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="lg:hidden bg-slate-900/95 border-t border-white/10 px-4 py-4 flex flex-col gap-3">
          {links
            .filter((l) => l.show)
            .map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="text-slate-300 hover:text-white text-sm py-1"
              >
                {l.label}
              </Link>
            ))}
          <div className="border-t border-white/10 pt-3 mt-1">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-sm text-slate-300 hover:text-white"
              >
                Log Out
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-slate-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
