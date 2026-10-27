// "use client";

// import { useEffect, useState } from "react";

// export default function AdminNoticesPage() {
//   const [notices, setNotices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const [form, setForm] = useState({
//     id: null,
//     title: "",
//     body: "",
//     startDate: "",
//     endDate: "",
//     enabled: true,
//     displayType: "every_visit",
//     dismissible: true,
//     priority: 0,
//   });

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

//   const fetchNotices = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch("/api/admin/notices", {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.error || "Failed to fetch notices");
//       }
//       setNotices(data.notices || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotices();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const resetForm = () => {
//     setForm({
//       id: null,
//       title: "",
//       body: "",
//       startDate: "",
//       endDate: "",
//       enabled: true,
//       displayType: "every_visit",
//       dismissible: true,
//       priority: 0,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");

//     try {
//       const payload = {
//         title: form.title,
//         body: form.body,
//         startDate: form.startDate,
//         endDate: form.endDate,
//         enabled: form.enabled,
//         displayType: form.displayType,
//         dismissible: form.dismissible,
//         priority: Number(form.priority) || 0,
//       };

//       const method = form.id ? "PUT" : "POST";
//       const url = form.id
//         ? `/api/admin/notices/${form.id}`
//         : "/api/admin/notices";

//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.error || "Failed to save notice");
//       }

//       resetForm();
//       fetchNotices();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleEdit = (notice) => {
//     setForm({
//       id: notice._id || notice.id,
//       title: notice.title,
//       body: notice.body,
//       startDate: notice.startDate
//         ? new Date(notice.startDate).toISOString().slice(0, 16)
//         : "",
//       endDate: notice.endDate
//         ? new Date(notice.endDate).toISOString().slice(0, 16)
//         : "",
//       enabled: notice.enabled,
//       displayType: notice.displayType,
//       dismissible: notice.dismissible,
//       priority: notice.priority ?? 0,
//     });
//   };

//   const handleToggleEnabled = async (notice) => {
//     try {
//       const res = await fetch(`/api/admin/notices/${notice._id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//         body: JSON.stringify({ enabled: !notice.enabled }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.error || "Failed to update status");
//       }
//       fetchNotices();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleDelete = async (notice) => {
//     if (!window.confirm("Are you sure you want to delete this notice?")) return;
//     try {
//       const res = await fetch(`/api/admin/notices/${notice._id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.error || "Failed to delete notice");
//       }
//       fetchNotices();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="flex-1 p-6 md:p-10">
//       <h1 className="text-2xl font-bold mb-4">Site Notices</h1>

//       {error && (
//         <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="mb-8 space-y-4 rounded-lg bg-white p-4 shadow-sm border border-gray-200"
//       >
//         <h2 className="text-lg font-semibold">
//           {form.id ? "Edit Notice" : "Create Notice"}
//         </h2>
//         <div className="grid gap-4 md:grid-cols-2">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Title
//             </label>
//             <input
//               type="text"
//               value={form.title}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, title: e.target.value }))
//               }
//               required
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Priority (lower = higher priority)
//             </label>
//             <input
//               type="number"
//               value={form.priority}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, priority: e.target.value }))
//               }
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Body (HTML allowed)
//           </label>
//           <textarea
//             value={form.body}
//             onChange={(e) =>
//               setForm((f) => ({ ...f, body: e.target.value }))
//             }
//             required
//             rows={4}
//             className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>
//         <div className="grid gap-4 md:grid-cols-2">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Start Date
//             </label>
//             <input
//               type="datetime-local"
//               value={form.startDate}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, startDate: e.target.value }))
//               }
//               required
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               End Date
//             </label>
//             <input
//               type="datetime-local"
//               value={form.endDate}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, endDate: e.target.value }))
//               }
//               required
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//         </div>
//         <div className="grid gap-4 md:grid-cols-3">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Display Type
//             </label>
//             <select
//               value={form.displayType}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, displayType: e.target.value }))
//               }
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="every_visit">Every Visit</option>
//               <option value="one_time">One Time per User</option>
//             </select>
//           </div>
//           <div className="flex items-end space-x-4">
//             <label className="inline-flex items-center text-sm text-gray-700">
//               <input
//                 type="checkbox"
//                 checked={form.enabled}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, enabled: e.target.checked }))
//                 }
//                 className="mr-2"
//               />
//               Enabled
//             </label>
//             <label className="inline-flex items-center text-sm text-gray-700">
//               <input
//                 type="checkbox"
//                 checked={form.dismissible}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, dismissible: e.target.checked }))
//                 }
//                 className="mr-2"
//               />
//               Dismissible
//             </label>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <button
//             type="submit"
//             disabled={saving}
//             className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
//           >
//             {saving ? "Saving..." : form.id ? "Update Notice" : "Create Notice"}
//           </button>
//           {form.id && (
//             <button
//               type="button"
//               onClick={resetForm}
//               className="text-sm text-gray-600 hover:underline"
//             >
//               Cancel edit
//             </button>
//           )}
//         </div>
//       </form>

//       <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
//         <div className="flex items-center justify-between mb-3">
//           <h2 className="text-lg font-semibold">Existing Notices</h2>
//           {loading && (
//             <span className="text-xs text-gray-500">Loading...</span>
//           )}
//         </div>
//         {notices.length === 0 && !loading && (
//           <p className="text-sm text-gray-500">No notices configured yet.</p>
//         )}
//         <ul className="divide-y divide-gray-100">
//           {notices.map((n) => (
//             <li key={n._id} className="py-3 flex items-start justify-between">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-medium text-gray-900">
//                     {n.title}
//                   </span>
//                   <span className="text-xs rounded-full px-2 py-0.5 bg-gray-100 text-gray-600">
//                     {n.displayType === "one_time"
//                       ? "One time per user"
//                       : "Every visit"}
//                   </span>
//                   <span className="text-xs text-gray-400">
//                     Priority: {n.priority ?? 0}
//                   </span>
//                   <span
//                     className={`text-xs rounded-full px-2 py-0.5 ${
//                       n.enabled
//                         ? "bg-green-100 text-green-700"
//                         : "bg-gray-200 text-gray-600"
//                     }`}
//                   >
//                     {n.enabled ? "Enabled" : "Disabled"}
//                   </span>
//                 </div>
//                 <p className="mt-1 max-w-xl text-xs text-gray-600 line-clamp-2">
//                   {n.body}
//                 </p>
//                 <p className="mt-1 text-xs text-gray-400">
//                   {n.startDate
//                     ? new Date(n.startDate).toLocaleString()
//                     : ""}{" "}
//                   —{" "}
//                   {n.endDate ? new Date(n.endDate).toLocaleString() : ""}
//                 </p>
//               </div>
//               <div className="flex items-center gap-2 ml-4">
//                 <button
//                   type="button"
//                   onClick={() => handleEdit(n)}
//                   className="text-xs px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleToggleEnabled(n)}
//                   className="text-xs px-2 py-1 rounded-md border border-indigo-300 text-indigo-700 hover:bg-indigo-50"
//                 >
//                   {n.enabled ? "Disable" : "Enable"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleDelete(n)}
//                   className="text-xs px-2 py-1 rounded-md border border-red-300 text-red-700 hover:bg-red-50"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { Bell, Plus, Edit2, Power, Trash2, Calendar, AlertCircle, CheckCircle, Sparkles, Eye, Clock } from 'lucide-react';

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: null,
    title: "",
    body: "",
    startDate: "",
    endDate: "",
    enabled: true,
    displayType: "every_visit",
    dismissible: true,
    priority: 0,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  const fetchNotices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/notices", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch notices");
      }
      setNotices(data.notices || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      body: "",
      startDate: "",
      endDate: "",
      enabled: true,
      displayType: "every_visit",
      dismissible: true,
      priority: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        title: form.title,
        body: form.body,
        startDate: form.startDate,
        endDate: form.endDate,
        enabled: form.enabled,
        displayType: form.displayType,
        dismissible: form.dismissible,
        priority: Number(form.priority) || 0,
      };

      const method = form.id ? "PUT" : "POST";
      const url = form.id
        ? `/api/admin/notices/${form.id}`
        : "/api/admin/notices";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save notice");
      }

      resetForm();
      fetchNotices();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (notice) => {
    setForm({
      id: notice._id || notice.id,
      title: notice.title,
      body: notice.body,
      startDate: notice.startDate
        ? new Date(notice.startDate).toISOString().slice(0, 16)
        : "",
      endDate: notice.endDate
        ? new Date(notice.endDate).toISOString().slice(0, 16)
        : "",
      enabled: notice.enabled,
      displayType: notice.displayType,
      dismissible: notice.dismissible,
      priority: notice.priority ?? 0,
    });
  };

  const handleToggleEnabled = async (notice) => {
    try {
      const res = await fetch(`/api/admin/notices/${notice._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ enabled: !notice.enabled }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }
      fetchNotices();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (notice) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      const res = await fetch(`/api/admin/notices/${notice._id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete notice");
      }
      fetchNotices();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Site Notices
          </h1>
        </div>
        <p className="text-slate-600 ml-14">Manage announcements and notifications for your users</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 px-5 py-4 flex items-start gap-3 shadow-sm animate-slideDown">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-red-700 font-medium">{error}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="mb-8 rounded-2xl bg-white shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              {form.id ? <Edit2 className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
            </div>
            <h2 className="text-xl font-bold text-white">
              {form.id ? "Edit Notice" : "Create New Notice"}
            </h2>
          </div>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-medium rounded-lg transition-all"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Title and Priority */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Title
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                  placeholder="Enter notice title"
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Priority
                  <span className="text-xs text-slate-500 font-normal">(lower number = higher priority)</span>
                </label>
                <input
                  type="number"
                  value={form.priority}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, priority: e.target.value }))
                  }
                  placeholder="0"
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Body */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                Body
                <span className="text-red-500">*</span>
                <span className="text-xs text-slate-500 font-normal">(HTML allowed)</span>
              </label>
              <textarea
                value={form.body}
                onChange={(e) =>
                  setForm((f) => ({ ...f, body: e.target.value }))
                }
                required
                rows={5}
                placeholder="Enter notice content (HTML tags supported)"
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-vertical"
              />
            </div>

            {/* Date Range */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Start Date
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                  required
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  End Date
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                  required
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Display Settings */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  Display Type
                </label>
                <select
                  value={form.displayType}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, displayType: e.target.value }))
                  }
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                >
                  <option value="every_visit">Every Visit</option>
                  <option value="one_time">One Time per User</option>
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <label className="inline-flex items-center px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.enabled}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, enabled: e.target.checked }))
                    }
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-slate-700 group-hover:text-blue-700">
                    Enabled
                  </span>
                </label>
              </div>
              <div className="flex flex-col justify-end">
                <label className="inline-flex items-center px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.dismissible}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dismissible: e.target.checked }))
                    }
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-slate-700 group-hover:text-blue-700">
                    Dismissible
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t-2 border-slate-100">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    {form.id ? <CheckCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {form.id ? "Update Notice" : "Create Notice"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="rounded-2xl bg-white shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Existing Notices</h2>
            {notices.length > 0 && (
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white">
                {notices.length}
              </span>
            )}
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          )}
        </div>

        <div className="p-6">
          {notices.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No notices configured yet</p>
              <p className="text-sm text-slate-400 mt-1">Create your first notice using the form above</p>
            </div>
          )}

          <ul className="space-y-4">
            {notices.map((n) => (
              <li
                key={n._id}
                className="group p-5 rounded-xl border-2 border-slate-200 hover:border-blue-300 bg-gradient-to-br from-slate-50 to-white hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title and Badges */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-base">
                        {n.title}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          n.enabled
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                            : "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${n.enabled ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                        {n.enabled ? "Active" : "Disabled"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 border border-blue-200">
                        <Eye className="w-3 h-3" />
                        {n.displayType === "one_time" ? "One time" : "Every visit"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 border border-purple-200">
                        <Clock className="w-3 h-3" />
                        Priority: {n.priority ?? 0}
                      </span>
                    </div>

                    {/* Body */}
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {n.body}
                    </p>

                    {/* Date Range */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {n.startDate ? new Date(n.startDate).toLocaleString() : ""}
                        {" → "}
                        {n.endDate ? new Date(n.endDate).toLocaleString() : ""}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(n)}
                      className="p-2 rounded-lg border-2 border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleEnabled(n)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        n.enabled
                          ? "border-slate-200 text-slate-600 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700"
                          : "border-green-200 text-green-600 hover:border-green-400 hover:bg-green-50"
                      }`}
                      title={n.enabled ? "Disable" : "Enable"}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(n)}
                      className="p-2 rounded-lg border-2 border-slate-200 text-slate-600 hover:border-red-400 hover:bg-red-50 hover:text-red-700 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </div>
  );
}