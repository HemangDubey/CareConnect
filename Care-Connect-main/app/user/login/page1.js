

// // "use client";

// // import { useState } from "react";
// // import { useRouter } from "next/navigation";

// // export default function LoginPage() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [error, setError] = useState("");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const router = useRouter();

// //   const handleLogin = async (e) => {
// //     e.preventDefault();
// //     setIsLoading(true);
// //     setError("");

// //     try {
// //       const res = await fetch("/api/auth/login", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ email, password }),
// //       });
// //       const data = await res.json();

// //       if (res.ok) {
// //         localStorage.setItem("token", data.token);
// //         localStorage.setItem("user", JSON.stringify(data.user));
// //         router.push("/");
// //       } else {
// //         setError(data.error || "Invalid credentials");
// //       }
// //     } catch {
// //       setError("An error occurred. Please try again.");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden flex items-center justify-center p-3">

// //       {/* Floating Elements */}
// //       <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500/10 rounded-full blur-xl"></div>
// //       <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
// //       <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"></div>

// //       <div className="w-full max-w-md relative z-10">
// //         {/* Welcome */}
// //         <div className="text-center mb-8">
// //           <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
// //           <p className="text-purple-200/80 text-lg">Continue your journey of making a difference</p>
// //         </div>

// //         {/* Login Card */}
// //         <form
// //           onSubmit={handleLogin}
// //           className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden"
// //         >
// //           <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-3xl"></div>
// //           <div className="relative z-10 space-y-6">

// //             {/* Email */}
// //             <div>
// //               <label className="block text-white/90 text-sm font-medium mb-2">Email Address</label>
// //               <input
// //                 type="email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 placeholder="your.email@example.com"
// //                 className="w-full px-4 py-3 rounded-2xl bg-white/5 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
// //                 required
// //               />
// //             </div>

// //             {/* Password */}
// //             <div>
// //               <label className="block text-white/90 text-sm font-medium mb-2">Password</label>
// //               <div className="relative">
// //                 <input
// //                   type={showPassword ? "text" : "password"}
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   placeholder="Enter your password"
// //                   className="w-full px-4 py-3 rounded-2xl bg-white/5 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
// //                   required
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/80"
// //                 >
// //                   {showPassword ? "Hide" : "Show"}
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Error */}
// //             {error && (
// //               <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 text-red-200 text-sm backdrop-blur-sm animate-pulse">
// //                 {error}
// //               </div>
// //             )}

// //             {/* Login Button */}
// //             <button
// //               type="submit"
// //               disabled={isLoading || !email || !password}
// //               className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 py-3 rounded-2xl font-semibold text-white transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
// //             >
// //               <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-xl"></div>
// //               <span className="relative z-10">{isLoading ? "Signing In..." : "Sign In"}</span>
// //             </button>

// //             {/* Social Login */}
// //             <div className="flex items-center my-6">
// //               <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
// //               <span className="px-4 text-white/50 text-sm">or continue with</span>
// //               <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
// //             </div>

// //             <div className="grid grid-cols-2 gap-4">
// //               <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white py-3 px-4 rounded-2xl transition-all duration-300 backdrop-blur-sm hover:scale-105">
// //                 {/* Google SVG Icon */}
// //                 <svg className="w-5 h-5" viewBox="0 0 24 24">
// //                   <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
// //                   <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
// //                   <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
// //                   <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
// //                 </svg>
// //                 <span className="text-sm font-medium">Google</span>
// //               </button>
// //             </div>

// //             {/* Register Link */}
// //             <p className="text-white/70 text-center mt-6">
// //               New to CareConnect?{" "}
// //               <span
// //                 onClick={() => router.push("/user/register")}
// //                 className="text-purple-300 hover:underline cursor-pointer"
// //               >
// //                 Create an account
// //               </span>
// //             </p>
// //           </div>
// //         </form>

// //         {/* Bottom Stats */}
// //         <div className="mt-12 grid grid-cols-3 gap-4">
// //           <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10 group hover:bg-white/10 transition-all duration-300">
// //             <div className="text-2xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">150k+</div>
// //             <div className="text-purple-200 text-xs">Lives Impacted</div>
// //           </div>
// //           <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10 group hover:bg-white/10 transition-all duration-300">
// //             <div className="text-2xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">500+</div>
// //             <div className="text-purple-200 text-xs">Care Homes</div>
// //           </div>
// //           <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10 group hover:bg-white/10 transition-all duration-300">
// //             <div className="text-2xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">24/7</div>
// //             <div className="text-purple-200 text-xs">Support</div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();

//   // Manual login handler (your API)
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         router.push("/");
//       } else {
//         setError(data.error || "Invalid credentials");
//       }
//     } catch {
//       setError("An error occurred. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Google login handler (NextAuth)
//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signIn("google", { redirect: true });

//       if (result?.error) {
//         setError("Google sign-in failed");
//         alert("Google sign-in failed");
//         return;
//       }
//       router.push("/");

//       // Fetch session to get user data
//       const sessionRes = await fetch("/api/auth/session");
//       const session = await sessionRes.json();

//       if (session?.user) {
//         // Save user in localStorage (like manual login)
//         localStorage.setItem("user", JSON.stringify(session.user));
//         router.push("/");
//       }
//     } catch (err) {
//       setError("Google sign-in failed. Try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden flex items-center justify-center p-3">

//       {/* Floating Elements */}
//       <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500/10 rounded-full blur-xl"></div>
//       <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
//       <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"></div>

//       <div className="w-full max-w-md relative z-10">
//         {/* Welcome */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
//           <p className="text-purple-200/80 text-lg">Continue your journey of making a difference</p>
//         </div>

//         {/* Login Card */}
//         <form
//           onSubmit={handleLogin}
//           className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden"
//         >
//           <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-3xl"></div>
//           <div className="relative z-10 space-y-6">

//             {/* Email */}
//             <div>
//               <label className="block text-white/90 text-sm font-medium mb-2">Email Address</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="your.email@example.com"
//                 className="w-full px-4 py-3 rounded-2xl bg-white/5 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-white/90 text-sm font-medium mb-2">Password</label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter your password"
//                   className="w-full px-4 py-3 rounded-2xl bg-white/5 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/80"
//                 >
//                   {showPassword ? "Hide" : "Show"}
//                 </button>
//               </div>
//             </div>

//             {/* Error */}
//             {error && (
//               <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 text-red-200 text-sm backdrop-blur-sm animate-pulse">
//                 {error}
//               </div>
//             )}

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={isLoading || !email || !password}
//               className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 py-3 rounded-2xl font-semibold text-white transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-xl"></div>
//               <span className="relative z-10">{isLoading ? "Signing In..." : "Sign In"}</span>
//             </button>

//             {/* Social Login */}
//             <div className="flex items-center my-6">
//               <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
//               <span className="px-4 text-white/50 text-sm">or continue with</span>
//               <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 type="button"
//                 onClick={handleGoogleLogin}
//                 className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white py-3 px-4 rounded-2xl transition-all duration-300 backdrop-blur-sm hover:scale-105"
//               >
//                 {/* Google SVG Icon */}
//                 <svg className="w-5 h-5" viewBox="0 0 24 24">
//                   <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//                 <span className="text-sm font-medium">Google</span>
//               </button>
//             </div>

//             {/* Register Link */}
//             <p className="text-white/70 text-center mt-6">
//               New to CareConnect?{" "}
//               <span
//                 onClick={() => router.push("/user/register")}
//                 className="text-purple-300 hover:underline cursor-pointer"
//               >
//                 Create an account
//               </span>
//             </p>
//           </div>
//         </form>

//         {/* Bottom Stats */}
//         <div className="mt-12 grid grid-cols-3 gap-4">
//           <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10 group hover:bg-white/10 transition-all duration-300">
//             <div className="text-2xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">150k+</div>
//             <div className="text-purple-200 text-xs">Lives Impacted</div>
//           </div>
//           <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10 group hover:bg-white/10 transition-all duration-300">
//             <div className="text-2xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">500+</div>
//             <div className="text-purple-200 text-xs">Care Homes</div>
//           </div>
//           <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10 group hover:bg-white/10 transition-all duration-300">
//             <div className="text-2xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">24/7</div>
//             <div className="text-purple-200 text-xs">Support</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden flex items-center justify-center p-3">

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Welcome */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-purple-200/80 text-lg">Continue your journey of making a difference</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-3xl"></div>
          <div className="relative z-10 space-y-6">

            {/* Email */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-2xl bg-white/5 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/80"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 text-red-200 text-sm backdrop-blur-sm animate-pulse">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 py-3 rounded-2xl font-semibold text-white transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-xl"></div>
              <span className="relative z-10">{isLoading ? "Signing In..." : "Sign In"}</span>
            </button>

            {/* Social Login */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="px-4 text-white/50 text-sm">or continue with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white py-3 px-4 rounded-2xl transition-all duration-300 backdrop-blur-sm hover:scale-105"
              >
                {/* Google SVG Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>
            </div>

            {/* Register Link */}
            <p className="text-white/70 text-center mt-6">
              New to CareConnect?{" "}
              <span
                onClick={() => router.push("/user/register")}
                className="text-purple-300 hover:underline cursor-pointer"
              >
                Create an account
              </span>
            </p>
          </div>
        </form>

        {/* Bottom Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="text-2xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">150k+</div>
            <div className="text-purple-200 text-xs">Lives Impacted</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="text-2xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">500+</div>
            <div className="text-purple-200 text-xs">Care Homes</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="text-2xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div className="text-purple-200 text-xs">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}