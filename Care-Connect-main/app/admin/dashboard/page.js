"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Home, TrendingUp, Users, MapPin, Eye, Edit3, Trash2, Filter, Search, Gift, RefreshCw, UserCheck, ArrowUpDown, HandHeart, Bell } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const router = useRouter();
  const { activeTab, setActiveTab } = useDashboard();
  const [homes, setHomes] = useState([]);
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [volunteerRequests, setVolunteerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [volunteerRequestsLoading, setVolunteerRequestsLoading] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Donation filters and sort
  const [donationHomeName, setDonationHomeName] = useState('all');
  const [donationHomeType, setDonationHomeType] = useState('all');
  const [donationLocation, setDonationLocation] = useState('all');
  const [donationSortBy, setDonationSortBy] = useState('date-desc');

  // Volunteer request filters
  const [volunteerHomeId, setVolunteerHomeId] = useState('all');
  const [volunteerStatus, setVolunteerStatus] = useState('all');
  const [volunteerDate, setVolunteerDate] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestVolunteers, setRequestVolunteers] = useState([]);

  const formatDate = (value) => {
    if (!value) return 'Not set';
    const d = new Date(value);
    return isNaN(d.getTime()) ? 'Not set' : d.toLocaleDateString();
  };

  const formatTime = (value) => {
    if (!value) return 'Not set';
    const d = new Date(value);
    return isNaN(d.getTime())
      ? 'Not set'
      : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get admin name
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setAdminName(decoded.name || 'Admin');
      } catch {
        setAdminName('Admin');
      }
    }
  }, []);

  // Fetch homes data
  useEffect(() => {

    const fetchHomes = async () => {
      try {
        const response = await fetch('/api/homes');
        const result = await response.json();
        if (result.success) {
          setHomes(result.data);
        }
      } catch (error) {
        console.error('Error fetching homes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomes();
  }, []);

  // Fetch donations data
  const fetchDonations = useCallback(async () => {
    setDonationsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/donations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setDonations(result.donations || []);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setDonationsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'donations') return;
    fetchDonations();
  }, [activeTab, fetchDonations]);

  // Fetch users data
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setUsers(result.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'users') return;
    fetchUsers();
  }, [activeTab, fetchUsers]);

  // Fetch volunteer requests
  const fetchVolunteerRequests = useCallback(async () => {
    setVolunteerRequestsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const params = new URLSearchParams();
      if (volunteerHomeId !== 'all') params.append('homeId', volunteerHomeId);
      if (volunteerStatus !== 'all') params.append('status', volunteerStatus);
      if (volunteerDate) params.append('date', volunteerDate);

      const response = await fetch(`/api/admin/volunteer-requests?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setVolunteerRequests(result.requests || []);
      }
    } catch (error) {
      console.error('Error fetching volunteer requests:', error);
    } finally {
      setVolunteerRequestsLoading(false);
    }
  }, [volunteerHomeId, volunteerStatus, volunteerDate]);

  useEffect(() => {
    if (activeTab !== 'volunteers') return;
    fetchVolunteerRequests();
  }, [activeTab, fetchVolunteerRequests]);

  // Fetch volunteers for a specific request
  const fetchRequestVolunteers = async (requestId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/volunteer-requests/${requestId}/volunteers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setRequestVolunteers(result.volunteers || []);
        setSelectedRequest(result.request);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    }
  };

  // Update volunteer request status
  const updateVolunteerRequestStatus = async (requestId, status, isFlagged) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/volunteer-requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: requestId, status, isFlagged }),
      });
      const result = await response.json();
      if (result.success) {
        fetchVolunteerRequests();
        setSelectedRequest(null);
        setRequestVolunteers([]);
        toast.success('Request updated successfully!');
      } else {
        toast.error(result.message || 'Failed to update request');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('An error occurred while updating the request');
    }
  };

  // Filter homes based on search and filter
  const filteredHomes = homes.filter(home => {
    const matchesSearch = home.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         home.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || home.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Filter and sort donations
  const filteredAndSortedDonations = donations
    .filter(donation => {
      const home = donation.homeId;
      if (!home) return false;
      
      const matchesHomeName = donationHomeName === 'all' || donationHomeName === '' || 
        (home.name?.toLowerCase().includes(donationHomeName.toLowerCase()));
      const matchesHomeType = donationHomeType === 'all' || home.type === donationHomeType;
      const matchesLocation = donationLocation === 'all' || 
        (home.location?.toLowerCase().includes(donationLocation.toLowerCase()));
      
      return matchesHomeName && matchesHomeType && matchesLocation;
    })
    .sort((a, b) => {
      switch (donationSortBy) {
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name-asc':
          return (a.homeId?.name || '').localeCompare(b.homeId?.name || '');
        case 'name-desc':
          return (b.homeId?.name || '').localeCompare(a.homeId?.name || '');
        case 'location-asc':
          return (a.homeId?.location || '').localeCompare(b.homeId?.location || '');
        case 'location-desc':
          return (b.homeId?.location || '').localeCompare(a.homeId?.location || '');
        default:
          return 0;
      }
    });

  // Get unique values for filter dropdowns
  const uniqueHomeNames = [...new Set(donations.map(d => d.homeId?.name).filter(Boolean))].sort();
  const uniqueLocations = [...new Set(donations.map(d => d.homeId?.location).filter(Boolean))].sort();

  const stats = [
    {
      title: 'Total Homes',
      value: homes.length,
      icon: Home,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Total Donations',
      value: donations.length,
      icon: Gift,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Locations',
      value: new Set(homes.map(h => h.location)).size,
      icon: MapPin,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {activeTab === 'homes' && '🏠 Homes Management'}
                {activeTab === 'donations' && '🎁 Donations'}
                {activeTab === 'users' && '👥 Users Management'}
                {activeTab === 'volunteers' && '🤝 Volunteer Management'}
              </h1>
              <p className="text-slate-600 text-sm mt-2 font-medium">
                {activeTab === 'homes' && 'Manage and monitor all home listings'}
                {activeTab === 'donations' && 'View and manage all item donations'}
                {activeTab === 'users' && 'View and manage all registered users'}
                {activeTab === 'volunteers' && 'View and manage all volunteer requests'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/notices')}
                className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Bell className="w-4 h-4" />
                <span>Create Notice</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-slate-500">Welcome back,</p>
                  <p className="text-sm font-semibold text-blue-600">{adminName}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {adminName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">
                      {loading ? (
                        <div className="w-16 h-8 bg-slate-200 rounded animate-pulse"></div>
                      ) : (
                        stat.value.toLocaleString()
                      )}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
                <div className={`w-full h-1 bg-gradient-to-r ${stat.color} rounded-full mt-4 opacity-60`}></div>
              </div>
            );
          })}
        </div>

        {activeTab === 'homes' && (
          <>
            {/* Search and Filter */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8 border border-white/20">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  w-5 h-5 text-black" />
                  <input
                    type="text"
                    placeholder="Search homes by title or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-black w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white min-w-[150px] text-black"
                  >
                    <option value="all">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="condo">Condo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Homes List */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Recent Homes ({filteredHomes.length})
                </h2>
              </div>

              {loading ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4 animate-pulse">
                        <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                        <div className="w-20 h-8 bg-slate-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : filteredHomes.length === 0 ? (
                <div className="p-12 text-center">
                  <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No homes found</h3>
                  <p className="text-slate-500">
                    {homes.length === 0 
                      ? "Start by adding your first home listing." 
                      : "Try adjusting your search or filter criteria."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredHomes.slice(0, 10).map((home, index) => (
                    <div key={home._id || index} className="p-6 hover:bg-white/50 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                            {home.imageUrl ? (
                              <img
                                src={home.imageUrl}
                                alt={home.name || home.title || `Home ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                  const fallback = e.target.parentElement.querySelector('.home-icon-fallback');
                                  if (fallback) {
                                    fallback.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <div 
                              className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center home-icon-fallback ${home.imageUrl ? 'hidden' : 'flex'}`}
                            >
                              <Home className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">
                              {home.name || home.title || `Home #${index + 1}`}
                            </h3>
                            <p className="text-slate-600 text-sm flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {home.location || 'Location not specified'}
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              {home.type || 'Type not specified'} • {home.status || 'Active'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'donations' && (
          <>
            {/* Filter and Sort Controls */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8 border border-white/20">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filter & Sort Donations
                  </h3>
                  <button
                    onClick={() => {
                      setDonationHomeName('all');
                      setDonationHomeType('all');
                      setDonationLocation('all');
                      setDonationSortBy('date-desc');
                    }}
                    className="text-sm text-slate-600 hover:text-blue-600 font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Home Name Filter */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by home name..."
                      value={donationHomeName === 'all' ? '' : donationHomeName}
                      onChange={(e) => setDonationHomeName(e.target.value.trim() === '' ? 'all' : e.target.value)}
                      className="text-black w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>

                  {/* Home Type Filter */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                      value={donationHomeType}
                      onChange={(e) => setDonationHomeType(e.target.value)}
                      className="text-black w-full pl-10 pr-8 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="all">All Home Types</option>
                      <option value="orphanage">Orphanage</option>
                      <option value="oldage">Old Age Home</option>
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                      value={donationLocation}
                      onChange={(e) => setDonationLocation(e.target.value)}
                      className="text-black w-full pl-10 pr-8 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="all">All Locations</option>
                      {uniqueLocations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="relative">
                    <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                      value={donationSortBy}
                      onChange={(e) => setDonationSortBy(e.target.value)}
                      className="text-black w-full pl-10 pr-8 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="date-desc">Newest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="name-asc">Home Name (A-Z)</option>
                      <option value="name-desc">Home Name (Z-A)</option>
                      <option value="location-asc">Location (A-Z)</option>
                      <option value="location-desc">Location (Z-A)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    All Item Donations ({filteredAndSortedDonations.length} of {donations.length})
                  </h2>
                  <button
                    onClick={fetchDonations}
                    disabled={donationsLoading}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                  >
                    <RefreshCw 
                      className={`w-4 h-4 ${donationsLoading ? 'animate-spin' : ''}`} 
                    />
                    {donationsLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              </div>

            {donationsLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : donations.length === 0 ? (
              <div className="p-12 text-center">
                <Gift className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No donations yet</h3>
                <p className="text-slate-500">Donations will appear here when users submit item donations.</p>
              </div>
            ) : filteredAndSortedDonations.length === 0 ? (
              <div className="p-12 text-center">
                <Gift className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No donations match your filters</h3>
                <p className="text-slate-500">Try adjusting your filter criteria to see more results.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredAndSortedDonations.map((donation) => (
                  <div key={donation._id} className="p-6 hover:bg-white/50 transition-colors duration-200">
                    <div className="flex items-start gap-4">
                      {donation.imageUrl && (
                        <img
                          src={donation.imageUrl}
                          alt={donation.itemName}
                          className="w-24 h-24 object-cover rounded-xl border border-slate-200"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-800 text-lg">{donation.itemName}</h3>
                            <p className="text-sm text-slate-600 mt-1">
                              Category: <span className="font-medium">{donation.category}</span> • 
                              Quantity: <span className="font-medium">{donation.quantity}</span>
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                              Home: <span className="font-medium">{donation.homeId?.name || 'Unknown'}</span> • 
                              Location: <span className="font-medium">{donation.homeId?.location || 'Unknown'}</span>
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              donation.status === 'Completed'
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : donation.status === 'Accepted'
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                            }`}
                          >
                            {donation.status}
                          </span>
                        </div>
                        <p className="text-slate-700 text-sm mb-3">{donation.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>📍 {donation.pickupAddress}</span>
                          {donation.donorName && <span>👤 {donation.donorName}</span>}
                          <span>📅 {new Date(donation.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </>
        )}

        {activeTab === 'volunteers' && (
          <>
            {/* Filter Controls */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8 border border-white/20">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filter Volunteer Requests
                  </h3>
                  <button
                    onClick={() => {
                      setVolunteerHomeId('all');
                      setVolunteerStatus('all');
                      setVolunteerDate('');
                    }}
                    className="text-sm text-slate-600 hover:text-blue-600 font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Home Filter */}
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                      value={volunteerHomeId}
                      onChange={(e) => setVolunteerHomeId(e.target.value)}
                      className="text-black w-full pl-10 pr-8 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="all">All Homes</option>
                      {homes.map(home => (
                        <option key={home._id} value={home._id}>{home.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                      value={volunteerStatus}
                      onChange={(e) => setVolunteerStatus(e.target.value)}
                      className="text-black w-full pl-10 pr-8 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>

                  {/* Date Filter */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="date"
                      value={volunteerDate}
                      onChange={(e) => setVolunteerDate(e.target.value)}
                      className="text-black w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <HandHeart className="w-5 h-5" />
                    All Volunteer Requests ({volunteerRequests.length})
                  </h2>
                  <button
                    onClick={fetchVolunteerRequests}
                    disabled={volunteerRequestsLoading}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                  >
                    <RefreshCw 
                      className={`w-4 h-4 ${volunteerRequestsLoading ? 'animate-spin' : ''}`} 
                    />
                    {volunteerRequestsLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              </div>

              {volunteerRequestsLoading ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4 animate-pulse">
                        <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : volunteerRequests.length === 0 ? (
                <div className="p-12 text-center">
                  <HandHeart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No volunteer requests found</h3>
                  <p className="text-slate-500">Volunteer requests will appear here when home admins create them.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {volunteerRequests.map((request) => (
                    <div key={request._id} className="p-6 hover:bg-white/50 transition-colors duration-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-slate-800 text-lg">{request.title}</h3>
                              <p className="text-sm text-slate-600 mt-1">
                                Home: <span className="font-medium">{request.homeId?.name || 'Unknown'}</span> • 
                                Location: <span className="font-medium">{request.homeId?.location || 'Unknown'}</span>
                              </p>
                              <p className="text-sm text-slate-500 mt-1">
                                Volunteers: <span className="font-medium">{request.volunteerCount || 0} / {request.numberOfVolunteersRequired || 0}</span> • 
                                Date: <span className="font-medium">{formatDate(request?.dateTime)}</span> • 
                                Time: <span className="font-medium">{formatTime(request?.dateTime)}</span>
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                  request.status === 'open'
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : request.status === 'closed'
                                    ? 'bg-gray-200 text-gray-600 border border-gray-300'
                                    : 'bg-red-100 text-red-700 border border-red-200'
                                }`}
                              >
                                {(request?.status || 'unknown').charAt(0).toUpperCase() + (request?.status || 'unknown').slice(1)}
                              </span>
                              {request.isFlagged && (
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                                  ⚠️ Flagged
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-slate-700 text-sm mb-3">{request.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>📍 {request.location}</span>
                            <span>📅 Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-4">
                            <button
                              onClick={() => fetchRequestVolunteers(request._id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                            >
                              View Volunteers ({request.volunteerCount || 0})
                            </button>
                            {request.status === 'open' && (
                              <button
                                onClick={() => updateVolunteerRequestStatus(request._id, 'closed', false)}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
                              >
                                Close Request
                              </button>
                            )}
                            {request.status !== 'disabled' && (
                              <button
                                onClick={() => updateVolunteerRequestStatus(request._id, 'disabled', false)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                              >
                                Disable
                              </button>
                            )}
                            {!request.isFlagged && (
                              <button
                                onClick={() => updateVolunteerRequestStatus(request._id, request.status, true)}
                                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-200 text-sm font-medium"
                              >
                                Flag
                              </button>
                            )}
                            {request.isFlagged && (
                              <button
                                onClick={() => updateVolunteerRequestStatus(request._id, request.status, false)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                              >
                                Unflag
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Volunteers Modal */}
            {selectedRequest && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center rounded-t-2xl">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Volunteers for: {selectedRequest.title}</h2>
                      <p className="text-sm text-slate-600 mt-1">{selectedRequest.homeId?.name} • {selectedRequest.location}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedRequest(null);
                        setRequestVolunteers([]);
                      }}
                      className="text-slate-500 hover:text-slate-700 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  <div className="p-6">
                    {requestVolunteers.length > 0 ? (
                      <div className="space-y-4">
                        {requestVolunteers.map((participation) => (
                          <div
                            key={participation._id}
                            className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
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
                                <h3 className="font-semibold text-slate-800">{participation.userId?.name || 'Unknown User'}</h3>
                                <p className="text-sm text-slate-600">{participation.userId?.email || 'No email'}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                  Volunteered: {new Date(participation.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <HandHeart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No volunteers yet for this request</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  All Users ({users.length})
                </h2>
                <button
                  onClick={fetchUsers}
                  disabled={usersLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  <RefreshCw 
                    className={`w-4 h-4 ${usersLoading ? 'animate-spin' : ''}`} 
                  />
                  {usersLoading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            {usersLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No users found</h3>
                <p className="text-slate-500">Users will appear here when they register.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {users.map((user) => (
                  <div key={user._id} className="p-6 hover:bg-white/50 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <span>{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-800 text-lg">{user.name || 'Unknown User'}</h3>
                            <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                              <span>📧 {user.email}</span>
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <span>🔐</span>
                                {user.provider === 'google' ? 'Google Account' : 'Email Account'}
                              </span>
                              <span className="flex items-center gap-1">
                                <span>📅</span>
                                Joined: {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              user.provider === 'google'
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {user.provider === 'google' ? 'Google' : 'Email'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;