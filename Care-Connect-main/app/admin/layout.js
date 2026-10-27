"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { verifyAdminToken } from '@/lib/authUtils';
import AdminSidebar from './components/AdminSidebar';
import { DashboardProvider } from './context/DashboardContext';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Don't check auth on login page
    if (isLoginPage) return;
    
    // Check authentication on all other admin pages
    if (!verifyAdminToken()) {
      router.push('/admin/login');
      return;
    }
  }, [router, pathname, isLoginPage]);

  // Login page doesn't need sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </DashboardProvider>
  );
}
