// file: app/homes/[id]/components/NoticeModal.jsx
// Client component: Modal UI for displaying notices

"use client";
import { useEffect, useRef } from "react";
import { X, AlertCircle, Info, CheckCircle } from "lucide-react";

export default function NoticeModal({ notice, onClose, onDismiss, homeId }) {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Focus trap and prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (modalRef.current) {
      modalRef.current.focus();
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const getPriorityStyles = () => {
    switch (notice.priority) {
      case "high":
        return {
          bg: "bg-red-50 border-red-200",
          badge: "bg-red-500 text-white",
          icon: <AlertCircle className="w-6 h-6 text-red-600" />,
        };
      case "medium":
        return {
          bg: "bg-amber-50 border-amber-200",
          badge: "bg-amber-500 text-white",
          icon: <Info className="w-6 h-6 text-amber-600" />,
        };
      case "low":
        return {
          bg: "bg-blue-50 border-blue-200",
          badge: "bg-blue-500 text-white",
          icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
        };
      default:
        return {
          bg: "bg-gray-50 border-gray-200",
          badge: "bg-gray-500 text-white",
          icon: <Info className="w-6 h-6 text-gray-600" />,
        };
    }
  };

  const styles = getPriorityStyles();

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDismiss = async () => {
    if (notice.showOnce && onDismiss) {
      await onDismiss(notice._id);
    }
    onClose();
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === backdropRef.current) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-title"
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${styles.bg} border-2 ${styles.bg.split(" ")[1]}`}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between rounded-t-2xl">
          <div className="flex items-start gap-4 flex-1">
            <div className="mt-1">{styles.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2
                  id="notice-title"
                  className="text-2xl font-bold text-gray-900"
                >
                  {notice.title}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${styles.badge}`}
                >
                  {notice.priority.toUpperCase()}
                </span>
              </div>
              {notice.endAt && (
                <p className="text-sm text-gray-600">
                  Active until {formatDate(notice.endAt)}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close notice"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div
            className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-between gap-4 rounded-b-2xl">
          <div className="text-sm text-gray-500">
            {notice.showOnce && (
              <span className="flex items-center gap-1">
                <Info className="w-4 h-4" />
                This notice will not appear again
              </span>
            )}
          </div>
          <div className="flex gap-3">
            {notice.showOnce && (
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Don&apos;t show again
              </button>
            )}
            <button
              onClick={onClose}
              className={`px-6 py-2 ${styles.badge} hover:opacity-90 rounded-lg font-medium transition-opacity text-white`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

