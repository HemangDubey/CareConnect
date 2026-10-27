
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import NoticePopup from "./components/NoticePopup";
export default function HomePage() {
  const [search, setSearch] = useState("");
  const [homes, setHomes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const { data: session } = useSession(); // ✅ Google/NextAuth session
  const router = useRouter();

  useEffect(() => {
    // Fetch homes
    async function fetchHomes() {
      try {
        const res = await fetch("/api/homes");
        const data = await res.json();
        if (data.success) setHomes(data.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchHomes();
    setIsLoaded(true);
  }, []);

  // ✅ Sync user (manual or Google) into state/localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      // Manual login
      setUser(JSON.parse(userData));
    } else if (session?.user) {
      // Google login
      localStorage.setItem("user", JSON.stringify(session.user));
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  const handleLogout = () => {
    // Manual logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    // Google logout
    signOut({ callbackUrl: "/" });

    router.push("/");
  };

  const filteredHomes = homes.filter(
    (home) =>
      home.name.toLowerCase().includes(search.toLowerCase()) ||
      home.location.toLowerCase().includes(search.toLowerCase()) ||
      home.type.toLowerCase().includes(search.toLowerCase())
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="group bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 animate-pulse"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          {/* Image skeleton */}
          <div className="relative h-56 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-white/10 via-white/20 to-white/10 animate-shimmer bg-[length:200%_100%]"></div>
            <div className="absolute top-4 right-4">
              <div className="bg-white/10 backdrop-blur-md h-6 w-16 rounded-full"></div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-6 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-lg w-3/4 animate-shimmer bg-[length:200%_100%]"></div>
              <div className="h-4 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-lg w-1/2 animate-shimmer bg-[length:200%_100%]"></div>
            </div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded w-full animate-shimmer bg-[length:200%_100%]"></div>
              <div className="h-3 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded w-4/5 animate-shimmer bg-[length:200%_100%]"></div>
              <div className="h-3 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded w-2/3 animate-shimmer bg-[length:200%_100%]"></div>
            </div>

            {/* Contact info skeleton */}
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded w-20 animate-shimmer bg-[length:200%_100%]"></div>
              <div className="h-4 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded w-24 animate-shimmer bg-[length:200%_100%]"></div>
            </div>

            {/* Button skeleton */}
            <div className="h-12 bg-gradient-to-r from-purple-500/20 via-purple-400/30 to-pink-500/20 rounded-2xl animate-shimmer bg-[length:200%_100%]"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Site-wide notices – only on user home page */}
      <NoticePopup />

      {/* Loading overlay for initial page load */}
      {!isLoaded && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-6"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-purple-400/20 via-purple-400/40 to-purple-400/20 rounded w-32 mx-auto animate-shimmer bg-[length:200%_100%]"></div>
              <div className="h-3 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded w-24 mx-auto animate-shimmer bg-[length:200%_100%]"></div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 p-6">
        {/* Hero */}
        <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Connect with
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
              Communities in Need
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Discover orphanages and old age homes where your generosity can make a real difference
          </p>
        </div>

        {/* Search */}
        <div className={`max-w-2xl mx-auto mb-16 transition-all duration-1000 delay-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="relative group">
            <input
              type="text"
              placeholder="Search by name, location, or type..."
              className="w-full px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-300 text-lg group-hover:bg-white/15"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Homes Grid */}
        {homes.length === 0 && isLoaded ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredHomes.length === 0 && homes.length > 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-white/70 text-xl font-medium mb-2">No homes found</p>
                <p className="text-white/50">Try adjusting your search terms</p>
              </div>
            ) : (
              filteredHomes.map((home, index) => (
                <div
                  key={home._id}
                  className={`group bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                    }`}
                  style={{ transitionDelay: `${900 + index * 100}ms` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={home.imageUrl || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop"}
                      alt={home.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/30">
                        {home.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                      {home.name}
                    </h3>
                    <div className="flex items-center text-white/70 mb-3">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {home.location}
                    </div>
                    <p className="text-white/80 text-sm mb-4 leading-relaxed">{home.description || "Providing care and support to those in need."}</p>
                    <div className="flex justify-between items-center mb-4 text-sm text-white/60">
                      <span>{home.capacity || "Contact for details"}</span>
                      <span>{home.contact && `📞 ${home.contact}`}</span>
                    </div>
                   
                    <button
                      onClick={() => {
                        if (!user) {
                          router.push("/user/login"); // if not logged in → go to login
                        } else {
                          router.push(`/homes/${home._id}`); // if logged in → go to that home page
                        }
                      }}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 group-hover:animate-pulse"
                    >
                      Donate Now
                    </button>

                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}