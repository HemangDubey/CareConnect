"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Mail, Home, AlertCircle, CheckCircle, XCircle, Clock, MapPin, Phone, FileText, User, Building2, ChevronDown, ChevronUp, QrCode, CreditCard } from "lucide-react";
import { useRef } from "react";

export default function HomeRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [openDetailsId, setOpenDetailsId] = useState(null);

  // Add custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    onConfirm: null,
    onCancel: null,
    title: '',
    message: '',
    actionType: '' // approve or reject
  });

  function openConfirm({ title, message, onConfirm, onCancel = () => {}, actionType }) {
    setConfirmModal({ open: true, title, message, onConfirm, onCancel, actionType });
  }
  function closeConfirm() { setConfirmModal(modal => ({ ...modal, open: false })); }

  const fetchRequests = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/home-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (result.success) {
        setRequests(result.data || []);
      } else {
        setError(result.message || result.error || "Failed to fetch home requests");
      }
    } catch (err) {
      console.error("Error fetching home requests:", err);
      setError("An error occurred while fetching home requests");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const handleApprove = async (requestId) => {
    openConfirm({
      title: "Approve Request?",
      message: "Are you sure you want to approve this request? This will create a Home and HomeAdmin account.",
      actionType: "approve",
      onConfirm: async () => {
        closeConfirm();
        try {
          setActionLoading(requestId);
          setError(null);
          setSuccessMessage(null);
          const token = localStorage.getItem("admin_token");

          const response = await fetch(`/api/home-requests/${requestId}/approve`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const result = await response.json();

          if (result.success) {
            setSuccessMessage(`Request approved! Temporary password: ${result.data.tempPassword} (Please send this to the admin via email)`);
            fetchRequests();
            setTimeout(() => setSuccessMessage(null), 10000); // Show for 10 seconds
          } else {
            setError(result.error || "Failed to approve request");
          }
        } catch (err) {
          console.error("Error approving request:", err);
          setError("An error occurred while approving request");
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  const handleReject = async (requestId) => {
    openConfirm({
      title: "Reject Request?",
      message: "Are you sure you want to reject this request? This action cannot be undone.",
      actionType: "reject",
      onConfirm: async () => {
        closeConfirm();
        try {
          setActionLoading(requestId);
          setError(null);
          setSuccessMessage(null);
          const token = localStorage.getItem("admin_token");

          const response = await fetch(`/api/home-requests/${requestId}/reject`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const result = await response.json();

          if (result.success) {
            setSuccessMessage("Request rejected successfully!");
            fetchRequests();
            setTimeout(() => setSuccessMessage(null), 3000);
          } else {
            setError(result.error || "Failed to reject request");
          }
        } catch (err) {
          console.error("Error rejecting request:", err);
          setError("An error occurred while rejecting request");
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Approved: "bg-green-100 text-green-800 border-green-200",
      Rejected: "bg-red-100 text-red-800 border-red-200",
    };

    const icons = {
      Pending: <Clock className="w-4 h-4" />,
      Approved: <CheckCircle className="w-4 h-4" />,
      Rejected: <XCircle className="w-4 h-4" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.Pending}`}>
        {icons[status]}
        {status}
      </span>
    );
  };

  const filteredRequests = filterStatus === "all" 
    ? requests 
    : requests.filter(req => req.status === filterStatus);

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading home requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <ConfirmationModal {...confirmModal} onCancel={() => {confirmModal.onCancel?.(); closeConfirm();}}/>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Home Registration Requests</h1>
              <p className="text-gray-600">Manage registration requests from orphanages and old age homes</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <div className="flex gap-2">
              {["all", "Pending", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status === "all" ? "All" : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="ml-auto">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Requests Table */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No requests found</h3>
            <p className="text-gray-500">
              {filterStatus === "all" 
                ? "No home registration requests have been submitted yet."
                : `No ${filterStatus.toLowerCase()} requests found.`}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Home Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Admin Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <React.Fragment key={request._id}>
                      <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            {request.homePhoto ? (
                              <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                <img 
                                  src={request.homePhoto} 
                                  alt={request.homeName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-gray-900">{request.homeName}</div>
                              {request.description && (
                                <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {request.description}
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                <MapPin className="w-3 h-3" />
                                <span className="line-clamp-1">{request.address}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">{request.adminName}</div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Mail className="w-3 h-3" />
                                {request.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {request.phone}
                          </div>
                          {request.documentUrl && (
                            <a
                              href={request.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-1"
                            >
                              <FileText className="w-3 h-3" />
                              View Document
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {request.status === "Pending" && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApprove(request._id)}
                                disabled={actionLoading === request._id}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm font-medium"
                              >
                                {actionLoading === request._id ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(request._id)}
                                disabled={actionLoading === request._id}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm font-medium"
                              >
                                {actionLoading === request._id ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <XCircle className="w-3 h-3" />
                                )}
                                Reject
                              </button>
                            </div>
                          )}
                          {request.status !== "Pending" && (
                            <span className="text-sm text-gray-400 italic">
                              {request.status === "Approved" ? "Processed" : "Rejected"}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            className="ml-2 inline-flex items-center px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700 gap-1 hover:bg-blue-50 border border-gray-200"
                            onClick={() => setOpenDetailsId(openDetailsId === request._id ? null : request._id)}
                          >
                            Details {openDetailsId === request._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                      {/* Dropdown details row */}
                      {openDetailsId === request._id && (
                        <tr className="bg-blue-50">
                          <td colSpan={7} className="px-8 py-5 border-t border-blue-100 text-sm align-top">
                            <div className="flex flex-wrap gap-8 items-start">
                              {/* QR IMAGE SECTION */}
                              <div className="flex flex-col items-center">
                                <span className="mb-1 font-medium text-gray-700 flex items-center gap-1"><QrCode className="w-4 h-4" /> UPI QR Code</span>
                                {request.upi?.qrImageUrl ? (
                                  <img
                                    src={request.upi.qrImageUrl}
                                    alt="QR code"
                                    className="w-32 h-32 object-contain rounded border border-gray-300 bg-white shadow"
                                  />
                                ) : (
                                  <span className="text-xs text-gray-400 italic mt-3">Not provided</span>
                                )}
                              </div>
                              {/* UPI ID SECTION */}
                              <div className="flex flex-col justify-center">
                                <span className="font-medium text-gray-700 flex items-center gap-1"><CreditCard className="w-4 h-4"/> UPI ID</span>
                                <span className="text-base font-mono text-blue-900 bg-blue-100 py-1 px-3 rounded-lg mt-2">
                                  {request.upi?.vpa || <span className="text-xs text-gray-400">Not provided</span>}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConfirmationModal({ open, title, message, onConfirm, onCancel, actionType }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all animate-fadeIn">
      <div className="bg-white/95 rounded-3xl shadow-2xl px-8 py-10 max-w-md w-full animate-scaleIn border border-gray-200 relative">
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          {actionType==="approve" ? <CheckCircle className="w-10 h-10 text-green-600 mb-2"/> : <XCircle className="w-10 h-10 text-red-600 mb-2"/>}
          <h3 className="text-2xl font-bold mb-1 text-gray-900">{title}</h3>
          <p className="text-gray-600 text-base font-medium mb-2 max-w-xs mx-auto">{message}</p>
        </div>
        <div className="flex gap-5 items-center justify-center pt-2">
          <button
            className={
              actionType==="approve"
                ? "px-7 py-2 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md focus:outline-none"
                : "px-7 py-2 text-lg font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md focus:outline-none"
            }
            onClick={onConfirm}
          >
            {actionType==="approve" ? 'Yes, Approve' : 'Yes, Reject'}
          </button>
          <button
            className="px-7 py-2 text-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl border border-gray-300 focus:outline-none"
            onClick={onCancel || closeConfirm}
          >
            Cancel
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.22s both; }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.89); } to { opacity:1; transform:scale(1); } }
        .animate-scaleIn { animation: scaleIn 0.28s both cubic-bezier(.3,.75,.38,1.1);}
      `}</style>
    </div>
  );
}

