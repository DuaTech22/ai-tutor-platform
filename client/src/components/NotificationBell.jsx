import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE_URL } from "../config.js";

const API_URL = `${API_BASE_URL}/notifications`;

function NotificationBell() {
  const { token } = useAuth();
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const fetchCount = () => {
    if (!token) return;
    axios
      .get(`${API_URL}/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCount(res.data.count))
      .catch(() => {});
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 15000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = async () => {
    const next = !open;
    setOpen(next);
    if (next && token) {
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
        await axios.post(
          `${API_URL}/mark-read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setCount(0);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!token) return null;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={handleOpen}
        className="relative w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
      >
        <Bell className="w-4 h-4 text-slate-300" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-slate-800 border border-white/10 rounded-xl shadow-xl z-50">
          {notifications.length === 0 ? (
            <p className="text-slate-400 text-sm p-4">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className="px-4 py-3 border-b border-white/5 last:border-0"
              >
                <p className="text-slate-200 text-sm">{n.message}</p>
                <p className="text-slate-500 text-xs mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
