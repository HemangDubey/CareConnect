// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useSession, signOut } from "next-auth/react";
// import { useEffect, useState } from "react";

// export default function Navbar() {
//   const [user, setUser] = useState(null);
//   const { data: session } = useSession();
//   const router = useRouter();

//   // ✅ Sync user (manual or Google) into state/localStorage
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userData = localStorage.getItem("user");

//     if (token && userData) {
//       // Manual login
//       setUser(JSON.parse(userData));
//     } else if (session?.user) {
//       // Google login
//       localStorage.setItem("user", JSON.stringify(session.user));
//       setUser(session.user);
//     } else {
//       setUser(null);
//     }
//   }, [session]);

//   const handleLogout = () => {
//     // Manual logout
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);

//     // Google logout
//     signOut({ callbackUrl: "/" });

//     router.push("/");
//   };

//   return (
//     <nav className="flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-8 py-5 shadow-2xl mb-12">
//       <div className="flex items-center space-x-3">
//         <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
//           <span className="text-white font-bold text-lg">C</span>
//         </div>
//         <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
//           CareConnect
//         </h1>
//       </div>
//       <div className="hidden md:flex items-center space-x-8">
//         <Link
//           href="/"
//           className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 relative group"
//         >
//           Home
//           <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
//         </Link>
//         <a
//           href="#"
//           className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 relative group"
//         >
//           About
//           <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
//         </a>
//         <a
//           href="#"
//           className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 relative group"
//         >
//           Contact
//           <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
//         </a>

//         {/* User Info / Login */}
//         {user ? (
//           <div className="flex items-center space-x-4">
//             <span className="text-white font-medium">{user.name}</span>
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600 transition-all duration-300"
//             >
//               Logout
//             </button>
//           </div>
//         ) : (
//           <div className="flex space-x-4">
//             <button
//               onClick={() => router.push("/user/login")}
//               className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
//             >
//               Login
//             </button>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Sync user (manual or Google) into state/localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    } else if (session?.user) {
      localStorage.setItem("user", JSON.stringify(session.user));
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    signOut({ callbackUrl: "/" });
    router.push("/");
  };

  return (
    <nav className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-6 py-4 shadow-2xl w-full mb-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo + Title */}
        <div className="flex items-center space-x-3">
          <div className="relative h-14 w-32 shrink-0">
            <Image
              src="/image.png"
              alt="CareConnect logo"
              fill
              className="object-contain mix-blend-screen scale-200"
              priority
            />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            CareConnect
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 relative group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/about"
            className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 relative group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/contact"
            className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 relative group"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* User Info / Login */}
          {user ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/user/history")}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm border border-white/20 hover:bg-white/20 hover:shadow-lg transition-all duration-300"
              >
                <span className="text-base">📜</span>
                <span>My history</span>
              </button>
              <span className="text-white font-medium">{user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/user/login")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4 px-2">
          <Link
            href="/"
            className="block text-white/90 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block text-white/90 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block text-white/90 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>

          {/* User Info / Login in Mobile */}
          {user ? (
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  router.push("/user/history");
                  setMenuOpen(false);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm border border-white/20 hover:bg-white/20 hover:shadow-lg transition-all duration-300"
              >
                <span className="text-base">📜</span>
                <span>My history</span>
              </button>
              <span className="text-white font-medium">{user.name}</span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                router.push("/user/login");
                setMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
