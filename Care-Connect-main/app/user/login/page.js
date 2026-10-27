"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Manual login handler (your API)
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google login handler (NextAuth)
  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { 
        callbackUrl: "/",
        redirect: true 
      });
    } catch (err) {
      setError("Google sign-in failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden flex items-center justify-center p-4">

      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute top-10 right-1/4 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl animate-pulse"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Welcome Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Welcome Back</h1>
          <p className="text-purple-200/90 text-lg font-medium">Continue your journey of making a difference</p>
        </div>

        {/* Enhanced Login Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/30 relative overflow-hidden"
        >
          {/* Card Background Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-t-3xl"></div>
          
          <div className="relative z-10 space-y-6">

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-white/95 text-sm font-semibold tracking-wide">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-5 py-4 rounded-2xl bg-white/8 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/12"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-white/95 text-sm font-semibold tracking-wide">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-5 py-4 pr-14 rounded-2xl bg-white/8 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/90 transition-colors duration-200 text-sm font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/15 border border-red-400/40 rounded-2xl p-4 text-red-200 text-sm backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </span>
              </div>
            )}

            {/* Enhanced Login Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 py-4 rounded-2xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group shadow-lg hover:shadow-purple-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-2xl blur-xl"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading && (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? "Signing In..." : "Sign In"}
              </span>
            </button>

            {/* Elegant Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <span className="px-6 text-white/60 text-sm font-medium tracking-wide">or continue with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {/* Classic Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 border border-gray-300 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="relative z-10 flex items-center justify-center gap-3">
                {/* Classic Google Logo */}
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-base font-medium">Continue with Google</span>
              </div>
            </button>

            {/* Register Link */}
            <p className="text-white/80 text-center mt-8 text-base">
              New to CareConnect?{" "}
              <button
                type="button"
                onClick={() => router.push("/user/register")}
                className="text-purple-300 hover:text-purple-200 font-semibold hover:underline transition-all duration-200"
              >
                Create an account
              </button>
            </p>
          </div>
        </form>

        {/* Enhanced Bottom Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="bg-white/8 backdrop-blur-md rounded-2xl p-5 text-center border border-white/20 group hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent1">150k+</div>
            <div className="text-purple-200 text-sm font-medium">Lives Impacted</div>
          </div>
          <div className="bg-white/8 backdrop-blur-md rounded-2xl p-5 text-center border border-white/20 group hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent1">500+</div>
            <div className="text-purple-200 text-sm font-medium">Care Homes</div>
          </div>
          <div className="bg-white/8 backdrop-blur-md rounded-2xl p-5 text-center border border-white/20 group hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent1">24/7</div>
            <div className="text-purple-200 text-sm font-medium">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}