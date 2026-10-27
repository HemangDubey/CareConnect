/**
 * Page: /homes/[id]
 * 
 * User-facing page to view home details and all its requests
 * This page is for donors/users to see what each home needs
 */

'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import DonateModal from "@/app/components/DonateModal";
import toast from "react-hot-toast";
import { RefreshCw, Bell } from "lucide-react";
import NoticeModal from "./components/NoticeModal";

export default function HomeDetailsPage({ params }) {
  const [requests, setRequests] = useState([]);
  const [volunteerRequests, setVolunteerRequests] = useState([]);
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [volunteerLoading, setVolunteerLoading] = useState(null); // Track which request is loading by ID
  const [volunteerRequestsLoading, setVolunteerRequestsLoading] = useState(false);
  const [userVolunteeredRequests, setUserVolunteeredRequests] = useState(new Set()); // Track which requests user has volunteered for
  const [id, setId] = useState(null);

  // Donate modal state
  const [showDonateModal, setShowDonateModal] = useState(false);

  // Notices state
  const [notices, setNotices] = useState([]);
  const [currentNotice, setCurrentNotice] = useState(null);
  const [showNoticesPanel, setShowNoticesPanel] = useState(false);
  const router = useRouter();

  // Resolve params (it may be a promise in Next.js App Router)
  useEffect(() => {
    let mounted = true;
    Promise.resolve(params)
      .then((resolved) => {
        if (!mounted) return;
        setId(resolved?.id || null);
      })
      .catch(() => {
        if (!mounted) return;
        setId(null);
      });
    return () => {
      mounted = false;
    };
  }, [params]);

  const getNoticeClientId = () => {
    if (typeof window === "undefined") return null;
    let clientId = localStorage.getItem("notice_client_id");
    if (!clientId) {
      clientId = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem("notice_client_id", clientId);
    }
    return clientId;
  };

  const fetchVolunteerRequests = async () => {
    if (!id) return;
    setVolunteerRequestsLoading(true);
    try {
      const resVolunteer = await fetch(`/api/homes/${id}/volunteer-requests`);
      const volunteerData = await resVolunteer.json();
      if (volunteerData.success) {
        const requests = volunteerData.requests || [];
        setVolunteerRequests(requests);

        // Check if user has already volunteered for any of these requests
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            const user = JSON.parse(userData);
            const userId = user._id || user.id;
            
            if (userId) {
              // Fetch user's volunteer participations
              const participationsRes = await fetch(`/api/volunteer-participation?userId=${userId}`);
              const participationsData = await participationsRes.json();
              
              if (participationsData.success) {
                // Create a Set of request IDs the user has volunteered for
                const volunteeredRequestIds = new Set(
                  participationsData.participations
                    .map(p => p.volunteerRequestId?._id || p.volunteerRequestId)
                    .filter(Boolean)
                );
                setUserVolunteeredRequests(volunteeredRequestIds);
              }
            }
          } catch (error) {
            console.error("Error fetching user participations:", error);
            // Continue even if we can't fetch participations
          }
        }
      }
    } catch (error) {
      console.error("Error fetching volunteer requests:", error);
      toast.error("Error refreshing volunteer requests");
    } finally {
      setVolunteerRequestsLoading(false);
    }
  };

  // Fetch notices for this home
  const fetchNotices = async () => {
    if (!id) return;
    try {
      // Get userId from localStorage if user is logged in
      let userId = null;
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user._id || user.id;
        } catch (e) {
          // Ignore parse errors
        }
      }

      let noticeUserId = userId;
      if (!noticeUserId) {
        noticeUserId = getNoticeClientId();
      }

      // Build URL with identifier if available
      const url = noticeUserId 
        ? `/api/homes/${id}/notices?userId=${noticeUserId}`
        : `/api/homes/${id}/notices`;

      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        // Filter out notices dismissed in localStorage (for anonymous users)
        const filteredNotices = data.notices.filter((notice) => {
          if (!notice.showOnce) return true;
          const dismissedKey = `notice_dismissed_${notice._id}`;
          return !localStorage.getItem(dismissedKey);
        });
        
        setNotices(filteredNotices);
        
        // Show highest priority notice automatically if available
        if (filteredNotices.length > 0 && !currentNotice) {
          // Sort by priority: high > medium > low
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const sorted = [...filteredNotices].sort(
            (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
          );
          setCurrentNotice(sorted[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  // Handle notice dismissal
  const handleDismissNotice = async (noticeId) => {
    try {
      // Get userId from localStorage if user is logged in
      let userId = null;
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user._id || user.id;
        } catch (e) {
          // Ignore parse errors
        }
      }

      let noticeUserId = userId;
      if (!noticeUserId) {
        noticeUserId = getNoticeClientId();
      }

      // Call dismiss API
      const res = await fetch(`/api/homes/${id}/notices/${noticeId}/dismiss`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: noticeUserId }),
      });

      const data = await res.json();
      if (data.success) {
        // Store in localStorage for anonymous users
        if (!userId) {
          localStorage.setItem(`notice_dismissed_${noticeId}`, "1");
        }
        
        // Remove from notices list
        setNotices((prev) => prev.filter((n) => n._id !== noticeId));
        setCurrentNotice(null);
      }
    } catch (error) {
      console.error("Error dismissing notice:", error);
    }
  };

  // Fetch home details and requests
  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        const resHome = await fetch(`/api/homes/${id}`);
        const homeData = await resHome.json();
        setHome(homeData);

        const resReq = await fetch(`/api/homes/${id}/requests`);
        const reqData = await resReq.json();
        if (reqData.success) {
          setRequests(reqData.requests || []);
        }

        // Fetch volunteer requests
        await fetchVolunteerRequests();
        
        // Fetch notices
        await fetchNotices();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleVolunteer = async (volunteerRequestId) => {
    setVolunteerLoading(volunteerRequestId); // Set the specific request ID that's loading
    try {
      // Get user from localStorage
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (!userData) {
        toast.error("Please login first to volunteer");
        router.push("/user/login");
        return;
      }

      const user = JSON.parse(userData);
      // Get userId - handle both _id and id, and convert to string if needed
      let userId = user._id || user.id;
      if (userId && typeof userId !== 'string') {
        userId = userId.toString();
      }

      if (!userId) {
        toast.error("Unable to identify user. Please login again.");
        router.push("/user/login");
        return;
      }

      const res = await fetch("/api/volunteer-participation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          volunteerRequestId,
          userId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Successfully volunteered! Thank you for your contribution. 🙏");
        // Add this request to the volunteered set
        setUserVolunteeredRequests(prev => new Set([...prev, volunteerRequestId]));
      } else {
        toast.error(data.message || "Failed to volunteer. Please try again.");
      }
    } catch (error) {
      console.error("Error volunteering:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setVolunteerLoading(null); // Clear loading state
      // Refresh volunteer requests to update counts
      fetchVolunteerRequests();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-purple-700">Loading home details...</p>
        </div>
      </div>
    );
  }

  if (!home) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Home Not Found</h2>
          <p className="text-gray-600 mb-4">The home you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* <Navbar /> */}
      
      {/* Notice Modal */}
      {currentNotice && (
        <NoticeModal
          notice={currentNotice}
          homeId={id}
          onClose={() => setCurrentNotice(null)}
          onDismiss={handleDismissNotice}
        />
      )}
      
      {/* Notices Panel */}
      {showNoticesPanel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">All Notices</h2>
              <button
                onClick={() => setShowNoticesPanel(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {notices.length > 0 ? (
                <div className="space-y-4">
                  {notices.map((notice) => {
                    const priorityColors = {
                      high: "bg-red-100 text-red-800 border-red-200",
                      medium: "bg-amber-100 text-amber-800 border-amber-200",
                      low: "bg-blue-100 text-blue-800 border-blue-200",
                    };
                    return (
                      <div
                        key={notice._id}
                        className={`p-4 rounded-lg border-2 ${priorityColors[notice.priority] || "bg-gray-100 border-gray-200"}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-lg">{notice.title}</h3>
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-white/50">
                            {notice.priority.toUpperCase()}
                          </span>
                        </div>
                        <div
                          className="text-sm mb-3"
                          dangerouslySetInnerHTML={{ __html: notice.content }}
                        />
                        {notice.endAt && (
                          <p className="text-xs opacity-75">
                            Active until {new Date(notice.endAt).toLocaleDateString()}
                          </p>
                        )}
                        {notice.showOnce && (
                          <p className="text-xs opacity-75 mt-1">
                            ⓘ Shows once per user
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No active notices</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {home.name}
            </h1>
            {notices.length > 0 && (
              <button
                onClick={() => setShowNoticesPanel(true)}
                className="relative inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                title="View all notices"
              >
                <Bell className="w-5 h-5" />
                <span className="hidden sm:inline">Notices</span>
                {notices.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notices.length}
                  </span>
                )}
              </button>
            )}
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Home Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-xl text-white">🏡</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">About {home.name}</h2>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6">{home.description || "Providing care and support to those in need."}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white">📍</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">Location</p>
                    <p className="font-semibold text-gray-800">{home.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border border-green-100">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <span className="text-white">📞</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600">Contact</p>
                    <p className="font-semibold text-gray-800">{home.contact}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* All Requests List */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-xl text-white">📋</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Current Requests</h2>
                </div>
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                  {requests.length} {requests.length === 1 ? 'Request' : 'Requests'}
                </span>
              </div>
              
              {requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div
                      key={req._id}
                      className="group p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-purple-800 text-lg group-hover:text-purple-900">
                          {req.title}
                        </h3>
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
                      <p className="text-gray-700 text-sm leading-relaxed">{req.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl text-gray-400">📝</span>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">No requests yet</p>
                  <p className="text-gray-400 text-sm">Check back soon for updates</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20 sticky top-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-xl text-white">💝</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Support Us</h2>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => setShowDonateModal(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  💰 Donate Money
                </button>
                
                <button 
                  onClick={() => router.push(`/homes/${id}/donate-item`)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  📦 Donate Items
                </button>
                
                <button 
                  onClick={() => setShowVolunteerModal(true)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  🤝 Volunteer for this Home
                </button>
              </div>
              
              <p className="text-center text-xs text-gray-500 mt-6">
                Every contribution makes a difference ✨
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Donate Modal */}
      <DonateModal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        homeId={id}
        homeName={home?.name}
      />

      {/* Volunteer Modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-2xl font-bold text-gray-800">Volunteer Opportunities</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchVolunteerRequests}
                  disabled={volunteerRequestsLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  <RefreshCw 
                    className={`w-4 h-4 ${volunteerRequestsLoading ? 'animate-spin' : ''}`} 
                  />
                  {volunteerRequestsLoading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={() => setShowVolunteerModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              {volunteerRequests.length > 0 ? (
                <div className="space-y-4">
                  {volunteerRequests.map((req) => (
                    <div
                      key={req._id}
                      className="p-5 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-orange-800 text-lg">{req.title}</h3>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                          Open
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">{req.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-4">
                        <div className="flex items-center">
                          <span className="mr-1">👥</span>
                          {req.numberOfVolunteersRequired} volunteers needed
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
                      <button
                        onClick={() => handleVolunteer(req._id)}
                        disabled={volunteerLoading === req._id || userVolunteeredRequests.has(req._id)}
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                          userVolunteeredRequests.has(req._id)
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-default"
                            : volunteerLoading === req._id
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                            : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                        }`}
                      >
                        {volunteerLoading === req._id 
                          ? "Processing..." 
                          : userVolunteeredRequests.has(req._id)
                          ? "✓ Volunteered"
                          : "Volunteer Now"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl text-gray-400">🤝</span>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">No volunteer opportunities available</p>
                  <p className="text-gray-400 text-sm">Check back later for volunteer requests</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
