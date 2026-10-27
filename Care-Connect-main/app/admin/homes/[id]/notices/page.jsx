// file: app/admin/homes/[id]/notices/page.jsx
// Admin UI: List, create, edit, and delete notices for a specific home

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Save, X, Bell, AlertCircle, Info, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function HomeNoticesPage({ params }) {
  const { id } = params;
  const router = useRouter();
  
  const [notices, setNotices] = useState([]);
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [form, setForm] = useState({
    title: "",
    content: "",
    startAt: "",
    endAt: "",
    priority: "medium",
    showOnce: false,
    enabled: true,
  });

  // Fetch home details
  useEffect(() => {
    async function fetchHome() {
      try {
        const res = await fetch(`/api/homes/${id}`);
        const data = await res.json();
        setHome(data);
      } catch (error) {
        console.error("Error fetching home:", error);
        toast.error("Failed to load home details");
      }
    }
    fetchHome();
  }, [id]);

  // Fetch notices
  const fetchNotices = async () => {
    try {
      setLoading(true);
      // Admin endpoint - fetch all notices (including disabled)
      const res = await fetch(`/api/homes/${id}/notices?admin=true`);
      const data = await res.json();
      if (data.success) {
        setNotices(data.notices || []);
      } else {
        toast.error("Failed to fetch notices");
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
      toast.error("Error loading notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      setActionLoading(true);
      const url = editingId 
        ? `/api/homes/${id}/notices/${editingId}`
        : `/api/homes/${id}/notices`;
      const method = editingId ? "PUT" : "POST";

      const body = {
        ...form,
        createdBy: "admin-placeholder", // TODO: Replace with actual admin ID from auth
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "Notice updated!" : "Notice created!");
        setForm({
          title: "",
          content: "",
          startAt: "",
          endAt: "",
          priority: "medium",
          showOnce: false,
          enabled: true,
        });
        setEditingId(null);
        setShowForm(false);
        fetchNotices();
      } else {
        toast.error(data.error || "Failed to save notice");
      }
    } catch (error) {
      console.error("Error saving notice:", error);
      toast.error("Error saving notice");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (notice) => {
    setEditingId(notice._id);
    setForm({
      title: notice.title,
      content: notice.content,
      startAt: notice.startAt ? new Date(notice.startAt).toISOString().slice(0, 16) : "",
      endAt: notice.endAt ? new Date(notice.endAt).toISOString().slice(0, 16) : "",
      priority: notice.priority,
      showOnce: notice.showOnce,
      enabled: notice.enabled,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (noticeId) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      setActionLoading(true);
      const res = await fetch(`/api/homes/${id}/notices/${noticeId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Notice deleted!");
        fetchNotices();
      } else {
        toast.error(data.error || "Failed to delete notice");
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Error deleting notice");
    } finally {
      setActionLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowForm(false);
    setForm({
      title: "",
      content: "",
      startAt: "",
      endAt: "",
      priority: "medium",
      showOnce: false,
      enabled: true,
    });
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "medium":
        return <Info className="w-5 h-5 text-amber-600" />;
      case "low":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading && !home) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 rounded-xl shadow-sm mb-8 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                📢 Notices Management
              </h1>
              <p className="text-slate-600 text-sm mt-2 font-medium">
                {home?.name || "Loading..."}
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) cancelEdit();
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              {showForm ? "Cancel" : "Create Notice"}
            </button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Notice" : "Create New Notice"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Content * (HTML allowed)
                  </label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Start Date/Time (optional)
                    </label>
                    <input
                      type="datetime-local"
                      name="startAt"
                      value={form.startAt}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      End Date/Time (optional)
                    </label>
                    <input
                      type="datetime-local"
                      name="endAt"
                      value={form.endAt}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="showOnce"
                      checked={form.showOnce}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-black">
                      Show once per user
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="enabled"
                      checked={form.enabled}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-black">
                      Enabled
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : editingId ? (
                    <Save className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {actionLoading
                    ? editingId
                      ? "Updating..."
                      : "Creating..."
                    : editingId
                    ? "Update Notice"
                    : "Create Notice"}
                </button>

                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notices List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              All Notices ({notices.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
            </div>
          ) : notices.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notices found
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first notice to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                    !notice.enabled ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getPriorityIcon(notice.priority)}
                        <h3 className="text-xl font-semibold text-gray-900">
                          {notice.title}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityStyles(
                            notice.priority
                          )}`}
                        >
                          {notice.priority.toUpperCase()}
                        </span>
                        {!notice.enabled && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                            DISABLED
                          </span>
                        )}
                        {notice.showOnce && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            SHOW ONCE
                          </span>
                        )}
                      </div>

                      <div
                        className="text-gray-700 mb-3 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: notice.content }}
                      />

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {notice.startAt && (
                          <span>
                            Starts: {new Date(notice.startAt).toLocaleString()}
                          </span>
                        )}
                        {notice.endAt && (
                          <span>
                            Ends: {new Date(notice.endAt).toLocaleString()}
                          </span>
                        )}
                        <span>
                          Created: {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(notice)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(notice._id)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

