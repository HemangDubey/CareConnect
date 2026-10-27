// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function HomeAdminDashboard() {
//     const [admin, setAdmin] = useState(null);
//     const [requests, setRequests] = useState([]);
//     const [newRequest, setNewRequest] = useState({ title: "", description: "" });
//     const router = useRouter();

//     //   useEffect(() => {
//     //     const storedAdmin = localStorage.getItem("homeAdmin");
//     //     if (!storedAdmin) {
//     //       router.push("/home-admin/login");
//     //     } else {
//     //       const adminData = JSON.parse(storedAdmin);
//     //       setAdmin(adminData);

//     //       fetchRequests(adminData.home._id);
//     //     }
//     //   }, []);

//     //   async function fetchRequests(id) {
//     //     const res = await fetch(`/api/homes/${id}/requests`);
//     //     const data = await res.json();
//     //     if (data.success) setRequests(data.requests);
//     //   }

//     //   async function handleCreateRequest(e) {
//     //     e.preventDefault();
//     //     const res = await fetch(`/api/homes/${admin.home._id}/requests`, {
//     //       method: "POST",
//     //       headers: { "Content-Type": "application/json" },
//     //       body: JSON.stringify({ ...newRequest, homeAdmin: admin.id }),
//     //     });
//     //     const data = await res.json();
//     //     if (data.success) {
//     //       setRequests((prev) => [...prev, data.request]);
//     //       setNewRequest({ title: "", description: "" });
//     //     }
//     //   }

//     async function fetchRequests(id, token) {
//         const res = await fetch(`/api/homes/${id}/requests`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         if (data.success) setRequests(data.requests);
//     }

//     useEffect(() => {
//         const storedAdmin = localStorage.getItem("homeAdmin");
//         const token = localStorage.getItem("homeAdminToken");

//         if (!storedAdmin || !token) {
//             router.push("/home-admin/login");
//         } else {
//             const adminData = JSON.parse(storedAdmin);
//             setAdmin(adminData);

//             fetchRequests(adminData.home._id, token);
//         }
//     }, []);

//     async function handleCreateRequest(e) {
//         e.preventDefault();
//         const token = localStorage.getItem("homeAdminToken");

//         const res = await fetch(`/api/homes/${admin.home._id}/requests`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({ ...newRequest }),
//         });
//         const data = await res.json();
//         if (data.success) {
//             setRequests((prev) => [...prev, data.request]);
//             setNewRequest({ title: "", description: "" });
//         }
//     }

//     if (!admin) return null;

//     return (
//         <div className="min-h-screen bg-gray-50 p-8">
//             <h1 className="text-3xl font-bold text-purple-700 mb-6">🏠 HomeAdmin Dashboard</h1>

//             {/* Admin Details */}
//             <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
//                 <h2 className="text-xl font-semibold">{admin.name}</h2>
//                 <p className="text-gray-600">{admin.email}</p>
//             </div>

//             {/* Home Details */}
//             <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
//                 <h2 className="text-xl font-semibold">{admin.home.name}</h2>
//                 <p className="text-gray-600">{admin.home.description}</p>
//                 <p className="text-sm mt-2">📍 {admin.home.location}</p>
//             </div>

//             {/* Create Request */}
//             <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
//                 <h3 className="text-lg font-semibold mb-4">➕ Create New Request</h3>
//                 <form onSubmit={handleCreateRequest} className="space-y-4">
//                     <input
//                         type="text"
//                         placeholder="Request title"
//                         value={newRequest.title}
//                         onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
//                         className="w-full p-3 border rounded-xl"
//                         required
//                     />
//                     <textarea
//                         placeholder="Request description"
//                         value={newRequest.description}
//                         onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
//                         className="w-full p-3 border rounded-xl"
//                         required
//                     />
//                     <button
//                         type="submit"
//                         className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700"
//                     >
//                         Create Request
//                     </button>
//                 </form>
//             </div>

//             {/* Requests List */}
//             <div className="bg-white p-6 rounded-2xl shadow-md">
//                 <h3 className="text-lg font-semibold mb-4">📋 Your Requests</h3>
//                 {requests.length > 0 ? (
//                     <ul className="space-y-3">
//                         {requests.map((req) => (
//                             <li
//                                 key={req._id}
//                                 className="p-4 bg-purple-50 rounded-xl border border-purple-100"
//                             >
//                                 <p className="font-semibold text-purple-800">{req.title}</p>
//                                 <p className="text-sm text-gray-600">{req.description}</p>
//                                 <span
//                                     className={`text-xs px-2 py-1 mt-2 inline-block rounded-full ${req.status === "active"
//                                             ? "bg-green-100 text-green-700"
//                                             : "bg-gray-200 text-gray-600"
//                                         }`}
//                                 >
//                                     {req.status}
//                                 </span>
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p className="text-sm text-gray-500">No requests yet.</p>
//                 )}
//             </div>
//         </div>
//     );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyHomeAdminToken } from "@/lib/authUtils";
import { LogOut, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function HomeAdminDashboard() {
    const [admin, setAdmin] = useState(null);
    const [requests, setRequests] = useState([]);
    const [donations, setDonations] = useState([]);
    const [volunteerRequests, setVolunteerRequests] = useState([]);
    const [newRequest, setNewRequest] = useState({ title: "", description: "", status: "active" });
    const [newVolunteerRequest, setNewVolunteerRequest] = useState({
        title: "",
        description: "",
        numberOfVolunteersRequired: "",
        dateTime: "",
        location: "",
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [donationsLoading, setDonationsLoading] = useState(false);
    const [volunteerRequestsLoading, setVolunteerRequestsLoading] = useState(false);
    const [selectedVolunteerRequest, setSelectedVolunteerRequest] = useState(null);
    const [requestVolunteers, setRequestVolunteers] = useState([]);
    const [volunteersLoading, setVolunteersLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [requestActionLoading, setRequestActionLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'donations', 'volunteers', or 'notices'
    const [notices, setNotices] = useState([]);
    const [noticesLoading, setNoticesLoading] = useState(false);
    const [newNotice, setNewNotice] = useState({
        title: "",
        content: "",
        startAt: "",
        endAt: "",
        priority: "medium",
        showOnce: false,
        enabled: true,
    });
    const [editingNoticeId, setEditingNoticeId] = useState(null);
    const [editingRequestId, setEditingRequestId] = useState(null);
    const router = useRouter();

    async function fetchRequests(id, token) {
        const res = await fetch(`/api/homes/${id}/requests`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setRequests(data.requests);
    }

    async function fetchDonations(token) {
        setDonationsLoading(true);
        try {
            const res = await fetch(`/api/donations`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) setDonations(data.donations || []);
        } catch (error) {
            console.error("Error fetching donations:", error);
        } finally {
            setDonationsLoading(false);
        }
    }

    async function updateDonationStatus(donationId, newStatus) {
        try {
            const token = localStorage.getItem("homeAdminToken");
            const res = await fetch(`/api/donations/${donationId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                // Update local state
                setDonations((prev) =>
                    prev.map((donation) =>
                        donation._id === donationId
                            ? { ...donation, status: newStatus }
                            : donation
                    )
                );
            } else {
                toast.error(data.message || "Failed to update donation status");
            }
        } catch (error) {
            console.error("Error updating donation status:", error);
            toast.error("An error occurred while updating donation status");
        }
    }

    useEffect(() => {
        // Verify token validity
        if (!verifyHomeAdminToken()) {
            router.push("/home-admin/login");
            return;
        }

        const storedAdmin = localStorage.getItem("homeAdmin");
        const token = localStorage.getItem("homeAdminToken");

        if (!storedAdmin || !token) {
            router.push("/home-admin/login");
            return;
        }

        try {
            const adminData = JSON.parse(storedAdmin);
            setAdmin(adminData);
            setIsAuthenticated(true);
            fetchRequests(adminData.home._id, token);
        } catch (error) {
            console.error("Error parsing admin data:", error);
            router.push("/home-admin/login");
        }
    }, [router]);

    // Fetch donations when donations tab is active
    useEffect(() => {
        if (isAuthenticated && activeTab === 'donations') {
            const token = localStorage.getItem("homeAdminToken");
            if (token) {
                fetchDonations(token);
            }
        }
    }, [isAuthenticated, activeTab]);

    async function fetchVolunteerRequests(token) {
        setVolunteerRequestsLoading(true);
        try {
            const res = await fetch(`/api/volunteer-requests?homeId=${admin.home._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                const requests = data.requests || [];
                // Fetch volunteer counts for each request
                const requestsWithCounts = await Promise.all(
                    requests.map(async (request) => {
                        try {
                            const volunteersRes = await fetch(`/api/volunteer-participation?volunteerRequestId=${request._id}`);
                            const volunteersData = await volunteersRes.json();
                            return {
                                ...request,
                                volunteerCount: volunteersData.success ? (volunteersData.participations?.length || 0) : 0,
                            };
                        } catch (error) {
                            return { ...request, volunteerCount: 0 };
                        }
                    })
                );
                setVolunteerRequests(requestsWithCounts);
            }
        } catch (error) {
            console.error("Error fetching volunteer requests:", error);
        } finally {
            setVolunteerRequestsLoading(false);
        }
    }

    async function fetchRequestVolunteers(requestId) {
        setVolunteersLoading(true);
        try {
            const res = await fetch(`/api/volunteer-participation?volunteerRequestId=${requestId}`);
            const data = await res.json();
            if (data.success) {
                setRequestVolunteers(data.participations || []);
                // Find the request details
                const request = volunteerRequests.find(r => r._id === requestId);
                setSelectedVolunteerRequest(request);
            }
        } catch (error) {
            console.error("Error fetching volunteers:", error);
            toast.error("Error fetching volunteer details");
        } finally {
            setVolunteersLoading(false);
        }
    }

    // Fetch volunteer requests when volunteers tab is active
    useEffect(() => {
        if (isAuthenticated && activeTab === 'volunteers') {
            const token = localStorage.getItem("homeAdminToken");
            if (token) {
                fetchVolunteerRequests(token);
            }
        }
    }, [isAuthenticated, activeTab, admin]);

    // Fetch notices when notices tab is active
    async function fetchNotices() {
        if (!admin?.home?._id) return;
        
        setNoticesLoading(true);
        try {
            const res = await fetch(`/api/homes/${admin.home._id}/notices?admin=true`);
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
            setNoticesLoading(false);
        }
    }

    useEffect(() => {
        if (isAuthenticated && activeTab === 'notices' && admin?.home?._id) {
            fetchNotices();
        }
    }, [isAuthenticated, activeTab, admin]);

    async function handleCreateNotice(e) {
        e.preventDefault();
        if (!admin?.home?._id) return;

        const token = localStorage.getItem("homeAdminToken");
        const url = editingNoticeId 
            ? `/api/homes/${admin.home._id}/notices/${editingNoticeId}`
            : `/api/homes/${admin.home._id}/notices`;
        const method = editingNoticeId ? "PUT" : "POST";

        try {
            setActionLoading(true);
            const body = {
                ...newNotice,
                createdBy: admin._id || admin.id || "home-admin-placeholder",
            };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(editingNoticeId ? "Notice updated!" : "Notice created!");
                setNewNotice({
                    title: "",
                    content: "",
                    startAt: "",
                    endAt: "",
                    priority: "medium",
                    showOnce: false,
                    enabled: true,
                });
                setEditingNoticeId(null);
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
    }

    async function handleDeleteNotice(noticeId) {
        if (!window.confirm("Are you sure you want to delete this notice?")) return;
        if (!admin?.home?._id) return;

        const token = localStorage.getItem("homeAdminToken");
        try {
            setActionLoading(true);
            const res = await fetch(`/api/homes/${admin.home._id}/notices/${noticeId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
    }

    function handleEditNotice(notice) {
        setEditingNoticeId(notice._id);
        setNewNotice({
            title: notice.title,
            content: notice.content,
            startAt: notice.startAt ? new Date(notice.startAt).toISOString().slice(0, 16) : "",
            endAt: notice.endAt ? new Date(notice.endAt).toISOString().slice(0, 16) : "",
            priority: notice.priority,
            showOnce: notice.showOnce,
            enabled: notice.enabled,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEditNotice() {
        setEditingNoticeId(null);
        setNewNotice({
            title: "",
            content: "",
            startAt: "",
            endAt: "",
            priority: "medium",
            showOnce: false,
            enabled: true,
        });
    }

    async function handleSaveRequest(e) {
        e.preventDefault();
        const token = localStorage.getItem("homeAdminToken");
        if (!token) {
            toast.error("Session expired. Please login again.");
            router.push("/home-admin/login");
            return;
        }

        const isEditing = Boolean(editingRequestId);
        const url = isEditing
            ? `/api/homes/${admin.home._id}/requests/${editingRequestId}`
            : `/api/homes/${admin.home._id}/requests`;
        const method = isEditing ? "PUT" : "POST";

        try {
            setRequestActionLoading(true);
            const payload = isEditing
                ? {
                    title: newRequest.title,
                    description: newRequest.description,
                    status: newRequest.status,
                }
                : {
                    title: newRequest.title,
                    description: newRequest.description,
                };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(isEditing ? "Request updated!" : "Request created!");
                setNewRequest({ title: "", description: "", status: "active" });
                setEditingRequestId(null);
                fetchRequests(admin.home._id, token);
            } else {
                toast.error(data.message || "Failed to save request");
            }
        } catch (error) {
            console.error("Error saving request:", error);
            toast.error("An error occurred while saving request");
        } finally {
            setRequestActionLoading(false);
        }
    }

    function handleEditRequest(request) {
        setEditingRequestId(request._id);
        setNewRequest({
            title: request.title,
            description: request.description,
            status: request.status || "active",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDeleteRequest(requestId) {
        if (!window.confirm("Are you sure you want to delete this request?")) return;
        const token = localStorage.getItem("homeAdminToken");
        if (!token) return;

        try {
            setRequestActionLoading(true);
            const res = await fetch(`/api/homes/${admin.home._id}/requests/${requestId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Request deleted!");
                fetchRequests(admin.home._id, token);
                if (editingRequestId === requestId) {
                    setEditingRequestId(null);
                    setNewRequest({ title: "", description: "", status: "active" });
                }
            } else {
                toast.error(data.message || "Failed to delete request");
            }
        } catch (error) {
            console.error("Error deleting request:", error);
            toast.error("An error occurred while deleting request");
        } finally {
            setRequestActionLoading(false);
        }
    }

    function cancelRequestEdit() {
        setEditingRequestId(null);
        setNewRequest({ title: "", description: "", status: "active" });
    }

    async function handleCreateVolunteerRequest(e) {
        e.preventDefault();
        const token = localStorage.getItem("homeAdminToken");

        const res = await fetch(`/api/volunteer-requests`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...newVolunteerRequest,
                homeId: admin.home._id,
            }),
        });
        const data = await res.json();
        if (data.success) {
            setVolunteerRequests((prev) => [...prev, data.request]);
            setNewVolunteerRequest({
                title: "",
                description: "",
                numberOfVolunteersRequired: "",
                dateTime: "",
                location: "",
            });
            toast.success("Volunteer request created successfully! 🎉");
        } else {
            toast.error(data.message || "Failed to create volunteer request");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("homeAdminToken");
        localStorage.removeItem("homeAdmin");
        router.push("/home-admin/login");
    };

    // Show loading state while checking authentication
    if (!isAuthenticated || !admin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="relative text-center mb-10">
                    <button
                        onClick={handleLogout}
                        className="absolute top-0 right-0 flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 pr-20 md:pr-0">
                        🏠 HomeAdmin Dashboard
                    </h1>
                    <p className="text-gray-600 text-base md:text-lg">Manage your home and service requests</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-purple-200">
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-6 py-3 font-semibold transition-colors duration-200 ${
                            activeTab === 'requests'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('donations')}
                        className={`px-6 py-3 font-semibold transition-colors duration-200 ${
                            activeTab === 'donations'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Donations
                    </button>
                    <button
                        onClick={() => setActiveTab('volunteers')}
                        className={`px-6 py-3 font-semibold transition-colors duration-200 ${
                            activeTab === 'volunteers'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Volunteer Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('notices')}
                        className={`px-6 py-3 font-semibold transition-colors duration-200 ${
                            activeTab === 'notices'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Notices
                    </button>
                </div>

                {activeTab === 'requests' && (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Admin & Home Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Admin Profile Card */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                                    <span className="text-2xl text-white font-bold">
                                        {admin.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{admin.name}</h2>
                                    <p className="text-gray-500 text-sm">Administrator</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl">
                                <p className="text-gray-600 text-sm flex items-center">
                                    <span className="mr-2">✉️</span>
                                    {admin.email}
                                </p>
                            </div>
                        </div>

                        {/* Home Details Card */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                                    <span className="text-xl">🏡</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Property Details</h2>
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg text-gray-800">{admin.home.name}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{admin.home.description}</p>
                                <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                                    <span className="mr-2">📍</span>
                                    {admin.home.location}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Requests */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Create Request Card */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                                        <span className="text-xl text-white">➕</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {editingRequestId ? "Edit Request" : "Create New Request"}
                                    </h3>
                                </div>
                                {editingRequestId && (
                                    <button
                                        type="button"
                                        onClick={cancelRequestEdit}
                                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                                    >
                                        Cancel edit
                                    </button>
                                )}
                            </div>
                            <form onSubmit={handleSaveRequest} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Request Title</label>
                                    <input
                                        type="text"
                                        placeholder="Enter request title..."
                                        value={newRequest.title}
                                        onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/50 backdrop-blur-sm text-black"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        placeholder="Describe your request in detail..."
                                        value={newRequest.description}
                                        onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/50 backdrop-blur-sm min-h-[120px] resize-none text-black"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        value={newRequest.status}
                                        onChange={(e) => setNewRequest({ ...newRequest, status: e.target.value })}
                                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/50 backdrop-blur-sm text-black"
                                        disabled={!editingRequestId}
                                    >
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    {!editingRequestId && (
                                        <p className="text-xs text-gray-500">Status can be changed after creating the request.</p>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={requestActionLoading}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {requestActionLoading
                                            ? editingRequestId
                                                ? "Updating..."
                                                : "Creating..."
                                            : editingRequestId
                                            ? "Update Request"
                                            : "Create Request"}
                                    </button>
                                    {editingRequestId && (
                                        <button
                                            type="button"
                                            onClick={cancelRequestEdit}
                                            className="px-6 py-4 rounded-2xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-all duration-200"
                                            disabled={requestActionLoading}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Requests List Card */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                                        <span className="text-xl text-white">📋</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Your Requests</h3>
                                </div>
                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {requests.length} {requests.length === 1 ? 'Request' : 'Requests'}
                                </span>
                            </div>
                            
                            {requests.length > 0 ? (
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {requests.map((req, index) => (
                                        <div
                                            key={req._id}
                                            className="group p-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-lg"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-bold text-purple-800 text-lg group-hover:text-purple-900">
                                                    {req.title}
                                                </h4>
                                                <span
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                        req.status === "active"
                                                            ? "bg-green-100 text-green-700 border border-green-200"
                                                            : "bg-gray-200 text-gray-600 border border-gray-300"
                                                    }`}
                                                >
                                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed mb-3">{req.description}</p>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>Request #{index + 1}</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center">
                                                        <div className={`w-2 h-2 rounded-full mr-2 ${
                                                            req.status === "active" ? "bg-green-400" : "bg-gray-400"
                                                        }`}></div>
                                                        {req.status === "active" ? "Active" : "Completed"}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditRequest(req)}
                                                            className="text-xs font-semibold text-amber-600 hover:text-amber-800"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteRequest(req._id)}
                                                            className="text-xs font-semibold text-red-600 hover:text-red-800"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl text-gray-400">📝</span>
                                    </div>
                                    <p className="text-gray-500 text-lg mb-2">No requests yet</p>
                                    <p className="text-gray-400 text-sm">Create your first request to get started</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                )}

                {activeTab === 'donations' && (
                    /* Donations Tab */
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                                    <span className="text-xl text-white">🎁</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Item Donations</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        const token = localStorage.getItem("homeAdminToken");
                                        if (token) {
                                            fetchDonations(token);
                                        }
                                    }}
                                    disabled={donationsLoading}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                                >
                                    <svg 
                                        className={`w-5 h-5 ${donationsLoading ? 'animate-spin' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    {donationsLoading ? 'Refreshing...' : 'Refresh'}
                                </button>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {donations.length} {donations.length === 1 ? 'Donation' : 'Donations'}
                                </span>
                            </div>
                        </div>

                        {donationsLoading ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading donations...</p>
                            </div>
                        ) : donations.length > 0 ? (
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {donations.map((donation) => (
                                    <div
                                        key={donation._id}
                                        className="group p-5 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border-2 border-green-100 hover:border-green-300 transition-all duration-200 hover:shadow-lg"
                                    >
                                        <div className="flex items-start gap-4">
                                            {donation.imageUrl && (
                                                <img
                                                    src={donation.imageUrl}
                                                    alt={donation.itemName}
                                                    className="w-20 h-20 object-cover rounded-xl border-2 border-green-200"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-bold text-green-800 text-lg group-hover:text-green-900">
                                                            {donation.itemName}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Category: <span className="font-medium">{donation.category}</span> • 
                                                            Quantity: <span className="font-medium">{donation.quantity}</span>
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <select
                                                            value={donation.status}
                                                            onChange={(e) => updateDonationStatus(donation._id, e.target.value)}
                                                            className={`px-3 py-1 text-xs font-semibold rounded-full border-2 ${
                                                                donation.status === 'Completed'
                                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                                    : donation.status === 'Accepted'
                                                                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                                    : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Accepted">Accepted</option>
                                                            <option value="Completed">Completed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 text-sm leading-relaxed mb-3">{donation.description}</p>
                                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center">
                                                        <span className="mr-1">📍</span>
                                                        {donation.pickupAddress}
                                                    </span>
                                                    {donation.donorName && (
                                                        <span className="flex items-center">
                                                            <span className="mr-1">👤</span>
                                                            {donation.donorName}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center">
                                                        <span className="mr-1">📅</span>
                                                        {new Date(donation.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl text-gray-400">🎁</span>
                                </div>
                                <p className="text-gray-500 text-lg mb-2">No donations yet</p>
                                <p className="text-gray-400 text-sm">Donations for your home will appear here</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'volunteers' && (
                    /* Volunteer Requests Tab */
                    <div className="space-y-6">
                        {/* Create Volunteer Request Card */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                                    <span className="text-xl text-white">🤝</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Create Volunteer Request</h3>
                            </div>
                            <form onSubmit={handleCreateVolunteerRequest} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        placeholder="Enter volunteer request title..."
                                        value={newVolunteerRequest.title}
                                        onChange={(e) => setNewVolunteerRequest({ ...newVolunteerRequest, title: e.target.value })}
                                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/50 backdrop-blur-sm text-black"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        placeholder="Describe the volunteer opportunity..."
                                        value={newVolunteerRequest.description}
                                        onChange={(e) => setNewVolunteerRequest({ ...newVolunteerRequest, description: e.target.value })}
                                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/50 backdrop-blur-sm min-h-[120px] resize-none text-black"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Number of Volunteers Required</label>
                                        <input
                                            type="number"
                                            placeholder="e.g., 5"
                                            min="1"
                                            value={newVolunteerRequest.numberOfVolunteersRequired}
                                            onChange={(e) => setNewVolunteerRequest({ ...newVolunteerRequest, numberOfVolunteersRequired: e.target.value })}
                                            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/50 backdrop-blur-sm text-black"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            value={newVolunteerRequest.dateTime}
                                            onChange={(e) => setNewVolunteerRequest({ ...newVolunteerRequest, dateTime: e.target.value })}
                                            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/50 backdrop-blur-sm text-black"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        placeholder="Enter location for volunteering..."
                                        value={newVolunteerRequest.location}
                                        onChange={(e) => setNewVolunteerRequest({ ...newVolunteerRequest, location: e.target.value })}
                                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/50 backdrop-blur-sm text-black"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Create Volunteer Request
                                </button>
                            </form>
                        </div>

                        {/* Volunteer Requests List Card */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                                        <span className="text-xl text-white">📋</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Your Volunteer Requests</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            const token = localStorage.getItem("homeAdminToken");
                                            if (token) {
                                                fetchVolunteerRequests(token);
                                            }
                                        }}
                                        disabled={volunteerRequestsLoading}
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                                    >
                                        <RefreshCw 
                                            className={`w-4 h-4 ${volunteerRequestsLoading ? 'animate-spin' : ''}`} 
                                        />
                                        {volunteerRequestsLoading ? 'Refreshing...' : 'Refresh'}
                                    </button>
                                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                        {volunteerRequests.length} {volunteerRequests.length === 1 ? 'Request' : 'Requests'}
                                    </span>
                                </div>
                            </div>
                            
                            {volunteerRequestsLoading ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading volunteer requests...</p>
                                </div>
                            ) : volunteerRequests.length > 0 ? (
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {volunteerRequests.map((req) => (
                                        <div
                                            key={req._id}
                                            onClick={() => fetchRequestVolunteers(req._id)}
                                            className="group p-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-lg cursor-pointer"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-bold text-purple-800 text-lg group-hover:text-purple-900">
                                                    {req.title}
                                                </h4>
                                                <span
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                        req.status === "open"
                                                            ? "bg-green-100 text-green-700 border border-green-200"
                                                            : req.status === "closed"
                                                            ? "bg-gray-200 text-gray-600 border border-gray-300"
                                                            : "bg-red-100 text-red-700 border border-red-200"
                                                    }`}
                                                >
                                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed mb-3">{req.description}</p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600 mb-3">
                                                <div className="flex items-center">
                                                    <span className="mr-1">👥</span>
                                                    {req.volunteerCount || 0} / {req.numberOfVolunteersRequired} volunteers
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-1">📅</span>
                                                    {new Date(req.dateTime).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-1">🕐</span>
                                                    {new Date(req.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-1">📍</span>
                                                    {req.location}
                                                </div>
                                            </div>
                                            {req.volunteerCount > 0 && (
                                                <div className="mt-2 text-xs text-purple-600 font-medium">
                                                    Click to view {req.volunteerCount} {req.volunteerCount === 1 ? 'volunteer' : 'volunteers'} →
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl text-gray-400">🤝</span>
                                    </div>
                                    <p className="text-gray-500 text-lg mb-2">No volunteer requests yet</p>
                                    <p className="text-gray-400 text-sm">Create your first volunteer request to get started</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'notices' && (
                    /* Notices Tab */
                    <div className="space-y-6">
                        {/* Create/Edit Notice Card */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                                    <span className="text-xl text-white">📢</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    {editingNoticeId ? "Edit Notice" : "Create New Notice"}
                                </h3>
                            </div>
                            <form onSubmit={handleCreateNotice} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Title *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter notice title..."
                                        value={newNotice.title}
                                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/50 backdrop-blur-sm text-black"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Content * (HTML allowed)</label>
                                    <textarea
                                        placeholder="Enter notice content..."
                                        value={newNotice.content}
                                        onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/50 backdrop-blur-sm min-h-[120px] resize-none text-black"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Start Date/Time (optional)</label>
                                        <input
                                            type="datetime-local"
                                            value={newNotice.startAt}
                                            onChange={(e) => setNewNotice({ ...newNotice, startAt: e.target.value })}
                                            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/50 backdrop-blur-sm text-black"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">End Date/Time (optional)</label>
                                        <input
                                            type="datetime-local"
                                            value={newNotice.endAt}
                                            onChange={(e) => setNewNotice({ ...newNotice, endAt: e.target.value })}
                                            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/50 backdrop-blur-sm text-black"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Priority</label>
                                    <select
                                        value={newNotice.priority}
                                        onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value })}
                                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/50 backdrop-blur-sm text-black"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newNotice.showOnce}
                                            onChange={(e) => setNewNotice({ ...newNotice, showOnce: e.target.checked })}
                                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Show once per user</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newNotice.enabled}
                                            onChange={(e) => setNewNotice({ ...newNotice, enabled: e.target.checked })}
                                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Enabled</span>
                                    </label>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {actionLoading
                                            ? editingNoticeId
                                                ? "Updating..."
                                                : "Creating..."
                                            : editingNoticeId
                                            ? "Update Notice"
                                            : "Create Notice"}
                                    </button>
                                    {editingNoticeId && (
                                        <button
                                            type="button"
                                            onClick={cancelEditNotice}
                                            disabled={actionLoading}
                                            className="bg-gray-500 text-white px-6 py-4 rounded-2xl hover:bg-gray-600 transition-all duration-200 font-medium"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Notices List Card */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                                        <span className="text-xl text-white">📋</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Your Notices</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={fetchNotices}
                                        disabled={noticesLoading}
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                                    >
                                        <RefreshCw 
                                            className={`w-4 h-4 ${noticesLoading ? 'animate-spin' : ''}`} 
                                        />
                                        {noticesLoading ? 'Refreshing...' : 'Refresh'}
                                    </button>
                                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                        {notices.length} {notices.length === 1 ? 'Notice' : 'Notices'}
                                    </span>
                                </div>
                            </div>
                            
                            {noticesLoading ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading notices...</p>
                                </div>
                            ) : notices.length > 0 ? (
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {notices.map((notice) => {
                                        const priorityColors = {
                                            high: "bg-red-100 text-red-800 border-red-200",
                                            medium: "bg-amber-100 text-amber-800 border-amber-200",
                                            low: "bg-blue-100 text-blue-800 border-blue-200",
                                        };
                                        return (
                                            <div
                                                key={notice._id}
                                                className={`group p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg ${
                                                    !notice.enabled ? "opacity-60" : ""
                                                } ${priorityColors[notice.priority] || "bg-gray-50 border-gray-200"}`}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="font-bold text-lg">
                                                                {notice.title}
                                                            </h4>
                                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[notice.priority] || "bg-gray-200 text-gray-600"}`}>
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
                                                            className="text-sm mb-3 prose prose-sm max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: notice.content }}
                                                        />
                                                        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
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
                                                <div className="flex gap-3 pt-4 border-t border-gray-200 mt-4">
                                                    <button
                                                        onClick={() => handleEditNotice(notice)}
                                                        disabled={actionLoading}
                                                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteNotice(notice._id)}
                                                        disabled={actionLoading}
                                                        className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl text-gray-400">📢</span>
                                    </div>
                                    <p className="text-gray-500 text-lg mb-2">No notices yet</p>
                                    <p className="text-gray-400 text-sm">Create your first notice to get started</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Volunteers Modal */}
                {selectedVolunteerRequest && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Volunteers for: {selectedVolunteerRequest.title}</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {selectedVolunteerRequest.location} • {new Date(selectedVolunteerRequest.dateTime).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedVolunteerRequest(null);
                                        setRequestVolunteers([]);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="p-6">
                                {volunteersLoading ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-gray-600">Loading volunteers...</p>
                                    </div>
                                ) : requestVolunteers.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="mb-4 p-3 bg-purple-50 rounded-xl border border-purple-200">
                                            <p className="text-sm text-purple-700">
                                                <span className="font-semibold">{requestVolunteers.length}</span> {requestVolunteers.length === 1 ? 'volunteer has' : 'volunteers have'} signed up for this request
                                            </p>
                                        </div>
                                        {requestVolunteers.map((participation) => (
                                            <div
                                                key={participation._id}
                                                className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {participation.userId?.image ? (
                                                            <img
                                                                src={participation.userId.image}
                                                                alt={participation.userId.name}
                                                                className="w-12 h-12 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <span>{participation.userId?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-800">{participation.userId?.name || 'Unknown User'}</h3>
                                                        <p className="text-sm text-gray-600">{participation.userId?.email || 'No email'}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Volunteered on: {new Date(participation.timestamp).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-3xl text-gray-400">👥</span>
                                        </div>
                                        <p className="text-gray-500 text-lg mb-2">No volunteers yet</p>
                                        <p className="text-gray-400 text-sm">Volunteers who sign up will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}