"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/home-admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // store token (localStorage for now, NextAuth/session later)
        localStorage.setItem("homeAdminToken", data.token);
        localStorage.setItem("homeAdmin", JSON.stringify(data.admin));

        router.push("/home-admin/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-400 opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-pink-400 opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-400 opacity-10 animate-pulse"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 rounded-full bg-white opacity-30 animate-bounce"></div>
        <div className="absolute top-32 right-32 w-3 h-3 rounded-full bg-purple-300 opacity-40 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-32 w-2 h-2 rounded-full bg-pink-300 opacity-30 animate-bounce" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Glassmorphism container */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/10 to-pink-400/10 blur-xl"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-purple-400 to-pink-400 mb-6 shadow-lg">
                <span className="text-3xl">🏠</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent1">
                Welcome Back
              </h1>
              <p className="text-white/70 text-sm">Sign in to your admin dashboard</p>
            </div>

            <div onSubmit={handleLogin}>
              {/* Error message */}
              {error && (
                <div className="mb-6 bg-red-500/20 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Email input */}
              <div className="mb-6 space-y-2">
                <label className="text-white/90 text-sm font-semibold block">Email Address</label>
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-white/15 transition-all duration-300 group-hover:bg-white/15"
                    required
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <svg className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password input */}
              <div className="mb-8 space-y-2">
                <label className="text-white/90 text-sm font-semibold block">Password</label>
                <div className="relative group">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-white/15 transition-all duration-300 group-hover:bg-white/15"
                    required
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <svg className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Login button */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:via-purple-700 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-400/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:animate-pulse"></div>
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Sign In to Dashboard</span>
                    <svg className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-1 text-white/40 text-xs">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure admin access • End-to-end encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute -top-6 -left-6 w-10 h-10 rounded-full bg-purple-400/30 animate-bounce blur-sm"></div>
        <div className="absolute -top-3 -right-8 w-6 h-6 rounded-full bg-pink-400/40 animate-bounce blur-sm" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute -bottom-5 -right-3 w-8 h-8 rounded-full bg-indigo-400/30 animate-bounce blur-sm" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-3 -left-5 w-4 h-4 rounded-full bg-purple-300/40 animate-bounce blur-sm" style={{animationDelay: '1.5s'}}></div>
      </div>
    </div>
  );
}