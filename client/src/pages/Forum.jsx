import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getDiscussions,
  createDiscussion,
  addReply,
  deleteDiscussion,
} from "../services/discussionService.js";

const tags = [
  "General",
  "Data Structures",
  "Algorithms",
  "OOP",
  "Databases",
  "OS",
  "Networks",
];

function Forum() {
  const { user, token } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("General");
  const [error, setError] = useState("");

  const load = () => {
    getDiscussions()
      .then(setDiscussions)
      .catch(() => setDiscussions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createDiscussion(title, body, tag, token);
      setTitle("");
      setBody("");
      setTag("General");
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not post discussion.");
    }
  };

  const handleReply = async (discussionId) => {
    if (!replyText.trim()) return;
    try {
      await addReply(discussionId, replyText, token);
      setReplyText("");
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (discussionId) => {
    if (!window.confirm("Delete this discussion? This cannot be undone."))
      return;
    try {
      await deleteDiscussion(discussionId, token);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Could not delete discussion.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="pt-24 px-6 max-w-3xl mx-auto pb-20 text-white">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-academic text-3xl font-bold">Discussion Forum</h1>
          {user && (
            <button
              onClick={() => setShowForm((s) => !s)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {showForm ? "Cancel" : "New Discussion"}
            </button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8 space-y-3"
          >
            {error && <p className="text-red-300 text-sm">{error}</p>}
            <input
              placeholder="Discussion title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            />
            <textarea
              placeholder="What's your question or topic?"
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            />
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            >
              {tags.map((t) => (
                <option key={t} value={t} className="bg-slate-800">
                  {t}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-5 py-2 rounded-lg transition-colors"
            >
              Post
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-slate-400">Loading discussions...</p>
        ) : discussions.length === 0 ? (
          <p className="text-slate-400">
            No discussions yet. Be the first to ask a question!
          </p>
        ) : (
          <div className="space-y-4">
            {discussions.map((d) => (
              <div
                key={d._id}
                className="bg-white/5 border border-white/10 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">
                    {d.tag}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      by {d.userName}
                    </span>
                    {(user?.id === d.user || user?.role === "admin") && (
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="text-red-400 text-xs hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{d.title}</h3>
                <p className="text-slate-300 text-sm mb-3">{d.body}</p>

                <button
                  onClick={() => setExpanded(expanded === d._id ? null : d._id)}
                  className="text-indigo-400 text-xs hover:underline"
                >
                  {d.replies.length} repl{d.replies.length === 1 ? "y" : "ies"}{" "}
                  — {expanded === d._id ? "hide" : "view"}
                </button>

                {expanded === d._id && (
                  <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                    {d.replies.map((r, i) => (
                      <div key={i} className="text-sm">
                        <span className="text-indigo-300 font-medium">
                          {r.userName}:
                        </span>{" "}
                        <span className="text-slate-300">{r.body}</span>
                      </div>
                    ))}

                    {user && (
                      <div className="flex gap-2 mt-3">
                        <input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
                        />
                        <button
                          onClick={() => handleReply(d._id)}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    )}
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

export default Forum;
