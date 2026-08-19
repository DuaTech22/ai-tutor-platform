import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getSavedNotes,
  deleteSavedNote,
} from "../services/savedNoteService.js";

function SavedNotes() {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);

  const load = () => {
    getSavedNotes(token)
      .then(setNotes)
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this saved note?")) return;
    try {
      await deleteSavedNote(id, token);
      load();
    } catch (err) {
      alert("Could not delete note.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="pt-24 px-6 max-w-4xl mx-auto pb-20 text-white">
        <h1 className="font-academic text-3xl font-bold mb-2">
          My Saved Notes
        </h1>
        <p className="text-slate-400 mb-8">
          Notes you've saved from the Notes page, for quick review anytime.
        </p>

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : notes.length === 0 ? (
          <p className="text-slate-400">
            No saved notes yet. Go to the Notes page, generate some notes, and
            click "Save Notes".
          </p>
        ) : (
          <div className="space-y-3">
            {notes.map((n) => (
              <div
                key={n._id}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                <div className="w-full flex items-center justify-between p-4">
                  <button
                    onClick={() => setOpen(open === n._id ? null : n._id)}
                    className="text-left flex-1"
                  >
                    <h3 className="font-semibold">{n.topic}</h3>
                    <p className="text-slate-500 text-xs mt-1">
                      {n.level} level · saved{" "}
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <button
                      onClick={() => setOpen(open === n._id ? null : n._id)}
                      className="text-indigo-400 text-xs hover:underline"
                    >
                      {open === n._id ? "hide" : "view"}
                    </button>
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="text-red-400 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {open === n._id && (
                  <div className="px-4 pb-4 border-t border-white/10 pt-4">
                    <div className="markdown-notes">
                      <ReactMarkdown>{n.notes}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedNotes;
