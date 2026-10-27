// "use client";
// import { useEffect, useState } from "react";

// export default function AddHomeAdminPage() {
//   const [homes, setHomes] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "", // ✅ added password
//     homeId: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   // Fetch homes
//   useEffect(() => {
//     const fetchHomes = async () => {
//       try {
//         const res = await fetch("/api/admin/homes");
//         if (!res.ok) throw new Error("Failed to fetch homes");
//         const data = await res.json();
//         setHomes(data.data || []);
//       } catch (error) {
//         console.error("Error fetching homes:", error);
//         setHomes([]);
//       }
//     };
//     fetchHomes();
//   }, []);

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     try {
//       const res = await fetch("/api/home-admin/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage({ type: "success", text: "Admin registered successfully!" });
//         setFormData({ name: "", email: "", password: "", homeId: "" }); // reset form
//       } else {
//         setMessage({
//           type: "error",
//           text: data.error || "Failed to register admin",
//         });
//       }
//     } catch (error) {
//       console.error("Error registering admin:", error);
//       setMessage({ type: "error", text: "Something went wrong" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-4 p-6 bg-white shadow rounded-lg max-w-md mx-auto"
//     >
//       <h2 className="text-xl font-bold">Register New Home Admin</h2>

//       {/* Inline Message */}
//       {message && (
//         <div
//           className={`p-2 rounded ${
//             message.type === "success"
//               ? "bg-green-100 text-green-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {message.text}
//         </div>
//       )}

//       {/* Name */}
//       <input
//         type="text"
//         placeholder="Admin Name"
//         className="border p-2 rounded w-full"
//         value={formData.name}
//         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//         required
//       />

//       {/* Email */}
//       <input
//         type="email"
//         placeholder="Admin Email"
//         className="border p-2 rounded w-full"
//         value={formData.email}
//         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//         required
//       />

//       {/* Password */}
//       <input
//         type="password"
//         placeholder="Admin Password"
//         className="border p-2 rounded w-full"
//         value={formData.password}
//         onChange={(e) =>
//           setFormData({ ...formData, password: e.target.value })
//         }
//         required
//       />

//       {/* Home Selection */}
//       <select
//         className="border p-2 rounded w-full"
//         value={formData.homeId}
//         onChange={(e) => setFormData({ ...formData, homeId: e.target.value })}
//         required
//       >
//         <option value="">Select a Home</option>
//         {homes.map((home) => (
//           <option key={home._id} value={home._id}>
//             {home.name}
//           </option>
//         ))}
//       </select>

//       {/* Submit */}
//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded w-full"
//         disabled={loading}
//       >
//         {loading ? "Registering..." : "Register"}
//       </button>
//     </form>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import {
  UserPlus,
  Home,
  Mail,
  Lock,
  User,
  Check,
  AlertCircle,
} from "lucide-react";

export default function AddHomeAdminPage() {
  const [homes, setHomes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    homeId: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch homes
  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const res = await fetch("/api/admin/homes");
        if (!res.ok) throw new Error("Failed to fetch homes");
        const data = await res.json();
        setHomes(data.data || []);
      } catch (error) {
        console.error("Error fetching homes:", error);
        setHomes([]);
      }
    };
    fetchHomes();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/home-admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Admin registered successfully!" });
        setFormData({ name: "", email: "", password: "", homeId: "" });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to register admin",
        });
      }
    } catch (error) {
      console.error("Error registering admin:", error);
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              👤 Create Home Admin
            </h1>
            <p className="text-slate-600 text-sm mt-2 font-medium">Create a new administrator account for a home</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Message Alert */}
          {message && (
            <div
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {message.type === "success" ? (
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter admin name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </label>
            <input
              type="password"
              placeholder="Create a secure password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-black focus:border-transparent transition-all outline-none"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          {/* Home Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Assign to Home
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none bg-white text-black cursor-pointer"
              value={formData.homeId}
              onChange={(e) =>
                setFormData({ ...formData, homeId: e.target.value })
              }
              required
            >
              <option value="">Select a home</option>
              {homes.map((home) => (
                <option key={home._id} value={home._id}>
                  {home.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Register Admin
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          All fields are required to create an admin account
        </p>
          </div>
        </div>
      </div>
    </div>
  );
}
