"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Exclude navbar from admin, home-admin, and register-home pages
  const isAdminRoute = pathname?.startsWith("/admin");
  const isHomeAdminRoute = pathname?.startsWith("/home-admin");
  const isRegisterHomeRoute = pathname === "/register-home";
  
  if (isAdminRoute || isHomeAdminRoute || isRegisterHomeRoute) {
    return null;
  }
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <Navbar />
    </div>
  );
}

