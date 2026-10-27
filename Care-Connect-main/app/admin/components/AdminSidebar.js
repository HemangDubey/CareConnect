"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Users, Gift, LogOut, LayoutDashboard, UserPlus, Building2, Plus, UserCheck, ClipboardList, HandHeart } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeTab, setActiveTab } = useDashboard();
  const [adminName, setAdminName] = useState('Admin');
  const [stats, setStats] = useState({
    homes: 0,
    donations: 0,
    users: 0,
  });

  useEffect(() => {
    // Get admin name from token
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

  const fetchStats = async () => {
    try {
      // Fetch homes
      const homesRes = await fetch('/api/homes');
      const homesData = await homesRes.json();
      
      // Fetch donations
      const token = localStorage.getItem('admin_token');
      const donationsRes = await fetch('/api/donations', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const donationsData = await donationsRes.json();
      
      // Fetch users
      const usersRes = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const usersData = await usersRes.json();

      setStats({
        homes: homesData.success ? (homesData.data?.length || 0) : 0,
        donations: donationsData.success ? (donationsData.donations?.length || 0) : 0,
        users: usersData.success ? (usersData.users?.length || 0) : 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    // Fetch stats if on dashboard page
    if (pathname === '/admin/dashboard') {
      fetchStats();
    }
  }, [pathname, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  return (
    <div className="w-80 bg-gradient-to-b from-white via-white to-slate-50 backdrop-blur-xl border-r border-slate-200/50 sticky top-0 h-screen shadow-2xl flex flex-col">
      {/* Sidebar Header with CareConnect Branding */}
      <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CareConnect
            </h2>
            <p className="text-xs text-slate-500 font-medium">Admin Dashboard</p>
          </div>
        </div>
        
        {/* User Info */}
        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-slate-200/50">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">Welcome</p>
            <p className="text-xs text-blue-600 font-medium">{adminName}</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">Main Menu</p>
        
        {/* Dashboard Link */}
        <Link
          href="/admin/dashboard"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
            pathname === '/admin/dashboard'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
              : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${pathname === '/admin/dashboard' ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
          <span>Dashboard</span>
          {pathname === '/admin/dashboard' && (
            <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
          )}
        </Link>

        {/* Manage Homes Link */}
        <Link
          href="/admin/create-home"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
            pathname === '/admin/create-home'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
              : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
          }`}
        >
          <Home className={`w-5 h-5 ${pathname === '/admin/create-home' ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
          <span>Manage Homes</span>
          {pathname === '/admin/create-home' && (
            <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
          )}
        </Link>

        {/* Create Admin Link */}
        <Link
          href="/admin/create-admin"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
            pathname === '/admin/create-admin'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
              : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
          }`}
        >
          <UserPlus className={`w-5 h-5 ${pathname === '/admin/create-admin' ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
          <span>Create Admin</span>
          {pathname === '/admin/create-admin' && (
            <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
          )}
        </Link>

        {/* Home Admin List Link */}
        <Link
          href="/admin/homeadminsList"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
            pathname === '/admin/homeadminsList'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
              : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
          }`}
        >
          <Building2 className={`w-5 h-5 ${pathname === '/admin/homeadminsList' ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
          <span>Home Admin List</span>
          {pathname === '/admin/homeadminsList' && (
            <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
          )}
        </Link>

        {/* Home Requests Link */}
        <Link
          href="/admin/home-requests"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
            pathname === '/admin/home-requests'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
              : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
          }`}
        >
          <ClipboardList className={`w-5 h-5 ${pathname === '/admin/home-requests' ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
          <span>Home Requests</span>
          {pathname === '/admin/home-requests' && (
            <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
          )}
        </Link>

        {/* Dashboard Tabs Section - Only show on dashboard page */}
        {pathname === '/admin/dashboard' && (
          <>
            <div className="pt-4 mt-4 border-t border-slate-200/50">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">Dashboard Views</p>
              
              <button
                onClick={() => setActiveTab('homes')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                  activeTab === 'homes'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-purple-600'
                }`}
              >
                <Home className={`w-5 h-5 ${activeTab === 'homes' ? 'text-white' : 'text-slate-500 group-hover:text-purple-600'}`} />
                <span>Homes</span>
                {activeTab === 'homes' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('donations')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                  activeTab === 'donations'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-purple-600'
                }`}
              >
                <Gift className={`w-5 h-5 ${activeTab === 'donations' ? 'text-white' : 'text-slate-500 group-hover:text-purple-600'}`} />
                <span>Donations</span>
                {activeTab === 'donations' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-purple-600'
                }`}
              >
                <UserCheck className={`w-5 h-5 ${activeTab === 'users' ? 'text-white' : 'text-slate-500 group-hover:text-purple-600'}`} />
                <span>Users</span>
                {activeTab === 'users' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('volunteers')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                  activeTab === 'volunteers'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-purple-600'
                }`}
              >
                <HandHeart className={`w-5 h-5 ${activeTab === 'volunteers' ? 'text-white' : 'text-slate-500 group-hover:text-purple-600'}`} />
                <span>Volunteers</span>
                {activeTab === 'volunteers' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            </div>
          </>
        )}

        {/* Quick Actions Section */}
        <div className="pt-6 mt-6 border-t border-slate-200/50">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">Quick Actions</p>
          <Link
            href="/admin/create-home"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-200 group"
          >
            <Plus className="w-5 h-5 text-slate-500 group-hover:text-green-600" />
            <span>Add New Home</span>
          </Link>
        </div>

        {/* Stats Summary */}
        <div className="pt-6 mt-6 border-t border-slate-200/50">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">Overview</p>
          <div className="space-y-2 px-4">
            <div className="flex items-center justify-between p-3 bg-blue-50/70 rounded-lg border border-blue-100/50">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-slate-700 font-medium">Homes</span>
              </div>
              <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{stats.homes}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50/70 rounded-lg border border-purple-100/50">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-slate-700 font-medium">Donations</span>
              </div>
              <span className="text-sm font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{stats.donations}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-indigo-50/70 rounded-lg border border-indigo-100/50">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="text-sm text-slate-700 font-medium">Users</span>
              </div>
              <span className="text-sm font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">{stats.users}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-blue-50/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group border border-slate-200/50 hover:border-red-200"
        >
          <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-600" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

