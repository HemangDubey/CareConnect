"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function NoticePopup() {
  const { data: session } = useSession();
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("/api/notices", {
          headers: {
            // Prefer JWT for /api/notices/seen; /api/notices (GET) is public
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.notices)) {
          // Only pick those that shouldDisplay
          const visible = data.notices.filter((n) => n.shouldDisplay);
          setQueue(visible);
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error("Failed to fetch notices", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, session?.user?.id]);

  const markSeen = async (noticeId) => {
    // Only try if we have a JWT token (manual user)
    if (!token) return;
    try {
      await fetch("/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ noticeId }),
      });
    } catch (err) {
      console.error("Failed to mark notice as seen", err);
    }
  };

  const handleClose = async () => {
    const current = queue[currentIndex];
    if (!current) return;

    if (current.displayType === "one_time") {
      await markSeen(current.id);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) {
      setQueue([]);
      setCurrentIndex(0);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  if (loading || queue.length === 0) return null;

  const current = queue[currentIndex];
  if (!current) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative mx-4 max-w-xl w-full transform rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/10 animate-[fadeIn_0.25s_ease-out,slideUp_0.25s_ease-out]">
        {/* Soft gradient glow behind card */}
        <div className="pointer-events-none absolute -inset-0.5 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-pink-500/30 blur-2xl opacity-70" />

        {/* Top accent bar */}
        <div className="h-1 w-full rounded-t-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="flex items-start justify-between px-6 pt-4 pb-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md">
              <span className="text-lg">ℹ️</span>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-indigo-500">
                Important notice
              </p>
              <h2 className="mt-0.5 text-lg font-semibold leading-snug text-slate-900">
                {current.title}
              </h2>
            </div>
          </div>

          {current.dismissible && (
            <button
              onClick={handleClose}
              className="ml-3 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Close notice"
            >
              <span className="block text-xl leading-none">&times;</span>
            </button>
          )}
        </div>

        <div className="px-6 pb-5 pt-1">
          <div
            className="prose prose-sm max-w-none text-slate-700 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{ __html: current.body }}
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-3.5 rounded-b-3xl">
          <p className="text-[11px] text-slate-500">
            {current.displayType === "one_time"
              ? "You will only see this notice once after closing."
              : "You may see this notice again on future visits."}
          </p>
          <div className="flex gap-2">
            {current.dismissible && (
              <button
                onClick={handleClose}
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Dismiss
              </button>
            )}
            {!current.dismissible && (
              <button
                onClick={handleClose}
                className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                Got it
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



