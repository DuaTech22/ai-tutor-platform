import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-academic text-lg font-bold text-white">
            AI<span className="text-indigo-400">Tutor</span>
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Final Year Project — AI-Powered Learning Platform
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
          <Link to="/courses" className="hover:text-white transition-colors">
            Courses
          </Link>
          <Link to="/forum" className="hover:text-white transition-colors">
            Forum
          </Link>
          <Link to="/code" className="hover:text-white transition-colors">
            Coding Assistant
          </Link>
          <Link to="/whiteboard" className="hover:text-white transition-colors">
            Whiteboard
          </Link>
        </div>

        <p className="text-slate-600 text-xs">
          © {new Date().getFullYear()} AI Tutor. Built with React, Node.js &
          Groq AI.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
