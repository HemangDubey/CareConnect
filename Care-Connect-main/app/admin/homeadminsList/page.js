"use client";

import React, { useState, useEffect } from "react";
import { Users, RefreshCw, Mail, Home, AlertCircle, Edit2, Trash2, X, Save, User, Lock, Check, AlertTriangle } from "lucide-react";

export default function HomeAdminsListPage() {
  const [homeAdmins, setHomeAdmins] = useState([]);
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    homeId: "",
  });

  const fetchHomeAdmins = async () => {
    try {
      setError(null);
      const response = await fetch("/api/homeadmins");
      const result = await response.json();

      if (result.success) {
        setHomeAdmins(result.data || []);
      } else {
        setError(result.error || "Failed to fetch home admins");
      }
    } catch (err) {
      console.error("Error fetching home admins:", err);
      setError("An error occurred while fetching home admins");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch homes for the edit form
  const fetchHomes = async () => {
    try {
      const response = await fetch("/api/admin/homes");
      const result = await response.json();
      if (result.success) {
        setHomes(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching homes:", err);
    }
  };

  useEffect(() => {
    fetchHomeAdmins();
    fetchHomes();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHomeAdmins();
  };

  // Handle edit button click
  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name || "",
      email: admin.email || "",
      password: "", // Don't pre-fill password
      homeId: admin.home?._id || "",
    });
    setShowEditModal(true);
    setError(null);
    setSuccessMessage(null);
  };

  // Handle delete button click
  const handleDeleteClick = (admin) => {
    setDeleteConfirm(admin);
    setError(null);
    setSuccessMessage(null);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/homeadmins/${deleteConfirm._id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Home admin deleted successfully!");
        setDeleteConfirm(null);
        fetchHomeAdmins();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.error || "Failed to delete home admin");
      }
    } catch (err) {
      console.error("Error deleting home admin:", err);
      setError("An error occurred while deleting home admin");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle edit form submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Name and email are required");
      return;
    }

    try {
      setActionLoading(true);
      const updateData = {
        name: formData.name,
        email: formData.email,
        homeId: formData.homeId || null,
      };

      // Only include password if it's provided
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/homeadmins/${editingAdmin._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Home admin updated successfully!");
        setShowEditModal(false);
        setEditingAdmin(null);
        setFormData({ name: "", email: "", password: "", homeId: "" });
        fetchHomeAdmins();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.error || "Failed to update home admin");
      }
    } catch (err) {
      console.error("Error updating home admin:", err);
      setError("An error occurred while updating home admin");
    } finally {
      setActionLoading(false);
    }
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingAdmin(null);
    setFormData({ name: "", email: "", password: "", homeId: "" });
    setError(null);
  };

  // Determine status - for now, we'll consider all active if they have a home assigned
  const getStatus = (admin) => {
    if (admin.home) {
      return { label: "Active", color: "bg-green-100 text-green-700 border-green-200" };
    }
    return { label: "Inactive", color: "bg-gray-100 text-gray-700 border-gray-200" };
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                👥 Home Admin List
              </h1>
              <p className="text-slate-600 text-sm mt-2 font-medium">View and manage all home administrators</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6 flex items-start gap-3">
            <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Success</h3>
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                    <div className="w-20 h-8 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : homeAdmins.length === 0 ? (
          /* Empty State */
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No Home Admins Found</h3>
            <p className="text-slate-500">
              There are no home administrators registered yet.
            </p>
          </div>
        ) : (
          /* Table */
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5" />
                All Home Admins ({homeAdmins.length})
              </h2>
            </div>

            {/* Desktop Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Associated Home
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {homeAdmins.map((admin) => {
                    const status = getStatus(admin);
                    return (
                      <tr
                        key={admin._id}
                        className="hover:bg-slate-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-semibold text-sm">
                                {admin.name?.charAt(0).toUpperCase() || "A"}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {admin.name || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-slate-600">
                            <Mail className="w-4 h-4 mr-2 text-slate-400" />
                            {admin.email || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-slate-600">
                            {admin.home ? (
                              <>
                                <Home className="w-4 h-4 mr-2 text-slate-400" />
                                <div>
                                  <div className="font-medium text-slate-900">
                                    {admin.home.name || "N/A"}
                                  </div>
                                  {admin.home.location && (
                                    <div className="text-xs text-slate-500">
                                      {admin.home.location}
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : (
                              <span className="text-slate-400 italic">Not assigned</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full border ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(admin)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(admin)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-200">
              {homeAdmins.map((admin) => {
                const status = getStatus(admin);
                return (
                  <div key={admin._id} className="p-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-semibold">
                            {admin.name?.charAt(0).toUpperCase() || "A"}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{admin.name || "N/A"}</div>
                          <div className="text-sm text-slate-600 flex items-center mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            {admin.email || "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${status.color}`}
                        >
                          {status.label}
                        </span>
                        <button
                          onClick={() => handleEdit(admin)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(admin)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {admin.home && (
                      <div className="flex items-center text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        <Home className="w-4 h-4 mr-2 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-900">
                            {admin.home.name || "N/A"}
                          </div>
                          {admin.home.location && (
                            <div className="text-xs text-slate-500">{admin.home.location}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Edit Home Admin</h2>
                <button
                  onClick={handleCloseEditModal}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter admin name"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password (optional)"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                {/* Home Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Assign to Home
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none bg-white text-black cursor-pointer"
                    value={formData.homeId}
                    onChange={(e) => setFormData({ ...formData, homeId: e.target.value })}
                  >
                    <option value="">Select a home (optional)</option>
                    {homes.map((home) => (
                      <option key={home._id} value={home._id}>
                        {home.name} - {home.location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Error message in modal */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Update
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Confirm Delete</h2>
                </div>
                <p className="text-slate-600">
                  Are you sure you want to delete home admin <span className="font-semibold text-slate-900">{deleteConfirm.name}</span>? This action cannot be undone.
                </p>
              </div>

              <div className="p-6 flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={actionLoading}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

