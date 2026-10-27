// "use client";
// import { useEffect, useState } from "react";
// import { Plus, Edit2, Trash2, Save, X, Home, MapPin, FileText, Check, AlertCircle, Info, Phone, Image, CreditCard, QrCode } from "lucide-react";

// // Toast Component
// const Toast = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 3000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   const getToastStyles = () => {
//     switch (type) {
//       case 'success':
//         return 'bg-green-500 border-green-400';
//       case 'error':
//         return 'bg-red-500 border-red-400';
//       case 'info':
//         return 'bg-blue-500 border-blue-400';
//       default:
//         return 'bg-gray-500 border-gray-400';
//     }
//   };

//   const getIcon = () => {
//     switch (type) {
//       case 'success':
//         return <Check className="w-5 h-5" />;
//       case 'error':
//         return <AlertCircle className="w-5 h-5" />;
//       case 'info':
//         return <Info className="w-5 h-5" />;
//       default:
//         return <Info className="w-5 h-5" />;
//     }
//   };

//   return (
//     <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 text-white px-4 py-3 rounded-lg shadow-lg border ${getToastStyles()} transform transition-all duration-300 ease-in-out`}>
//       {getIcon()}
//       <span>{message}</span>
//       <button onClick={onClose} className="ml-2 hover:opacity-70">
//         <X className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };

// export default function AdminDashboard() {
//   const [homes, setHomes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [toasts, setToasts] = useState([]);
//   const [showAddForm, setShowAddForm] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     type: "orphanage",
//     location: "",
//     contact: "",
//     description: "",
//     imageUrl: "",
//     upiVpa: "",
//     qrImageUrl: "",
//   });

//   // Toast management
//   const addToast = (message, type = 'info') => {
//     const id = Date.now();
//     setToasts(prev => [...prev, { id, message, type }]);
//   };

//   const removeToast = (id) => {
//     setToasts(prev => prev.filter(toast => toast.id !== id));
//   };

//   // Fetch all homes
//   const fetchHomes = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/admin/homes");
//       const data = await res.json();
//       if (data.success) {
//         setHomes(data.data);
//       } else {
//         addToast('Failed to fetch homes', 'error');
//       }
//     } catch (error) {
//       console.error("Error fetching homes:", error);
//       addToast('Error fetching homes', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHomes();
//   }, []);

//   // Handle form input change
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Add or Update home
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!form.name.trim() || !form.location.trim() || !form.contact.trim()) {
//       addToast('Name, location, and contact are required', 'error');
//       return;
//     }

//     try {
//       setActionLoading(true);
//       const url = editingId ? `/api/admin/homes/${editingId}` : "/api/admin/homes";
//       const method = editingId ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...form,
//           upi: { vpa: form.upiVpa, qrImageUrl: form.qrImageUrl },
//         }),
//       });

//       const data = await res.json();
//       if (data.success || data._id) {
//         setForm({
//           name: "",
//           type: "orphanage",
//           location: "",
//           contact: "",
//           description: "",
//           imageUrl: "",
//           upiVpa: "",
//           qrImageUrl: "",
//         });
//         setEditingId(null);
//         setShowAddForm(false);
//         addToast(editingId ? 'Home updated successfully!' : 'Home added successfully!', 'success');
//         fetchHomes();
//       } else {
//         addToast("Error saving home: " + data.error, 'error');
//       }
//     } catch (error) {
//       console.error("Error saving home:", error);
//       addToast('Error saving home', 'error');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Start editing a home
//   const handleEdit = (home) => {
//     setEditingId(home._id);
//     setForm({
//       name: home.name,
//       type: home.type,
//       location: home.location,
//       contact: home.contact,
//       description: home.description,
//       imageUrl: home.imageUrl,
//       upiVpa: home.upi?.vpa || "",
//       qrImageUrl: home.upi?.qrImageUrl || "",
//     });
//     setShowAddForm(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Cancel editing
//   const cancelEdit = () => {
//     setEditingId(null);
//     setShowAddForm(false);
//     setForm({
//       name: "",
//       type: "orphanage",
//       location: "",
//       contact: "",
//       description: "",
//       imageUrl: "",
//       upiVpa: "",
//       qrImageUrl: "",
//     });
//   };

//   // Delete home
//   const handleDelete = async (id, name) => {
//     if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    
//     try {
//       setActionLoading(true);
//       const res = await fetch(`/api/admin/homes/${id}`, { method: "DELETE" });
//       const data = await res.json();
//       if (data.success) {
//         addToast('Home deleted successfully!', 'success');
//         fetchHomes();
//       } else {
//         addToast("Error deleting home: " + data.error, 'error');
//       }
//     } catch (error) {
//       console.error("Error deleting home:", error);
//       addToast('Error deleting home', 'error');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const getTypeColor = (type) => {
//     return type === 'orphanage' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
//   };

//   const getTypeIcon = (type) => {
//     return type === 'orphanage' ? '👶' : '👴';
//   };

//   return (
//     <div className="flex-1 flex flex-col">
//       {/* Toast Container */}
//       <div className="fixed top-4 right-4 z-50 space-y-2">
//         {toasts.map(toast => (
//           <Toast
//             key={toast.id}
//             message={toast.message}
//             type={toast.type}
//             onClose={() => removeToast(toast.id)}
//           />
//         ))}
//       </div>

//       {/* Header */}
//       <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-10 shadow-sm">
//         <div className="max-w-7xl mx-auto px-8 py-5">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                 🏠 Homes Management
//               </h1>
//               <p className="text-slate-600 text-sm mt-2 font-medium">Manage orphanages and old age homes</p>
//             </div>
            
//             <button
//               onClick={() => setShowAddForm(!showAddForm)}
//               className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
//             >
//               <Plus className="w-5 h-5" />
//               {editingId ? 'Cancel Edit' : 'Add New Home'}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         <div className="max-w-7xl mx-auto px-8 py-8">
//         {/* Add/Edit New Home Form */}
//         {showAddForm && (
//           <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
//             <div className="bg-gray-50 px-6 py-4 border-b">
//               <h2 className="text-lg font-semibold text-gray-900">
//                 {editingId ? 'Edit Home' : 'Add New Home'}
//               </h2>
//             </div>
//             <form onSubmit={handleSubmit} className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-black mb-2">
//                     Home Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     placeholder="Enter home name"
//                     value={form.name}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-black mb-2">
//                     Type *
//                   </label>
//                   <select
//                     name="type"
//                     value={form.type}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   >
//                     <option value="orphanage">Orphanage</option>
//                     <option value="oldage">Old Age Home</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-black mb-2">
//                     Location *
//                   </label>
//                   <input
//                     type="text"
//                     name="location"
//                     placeholder="Enter location"
//                     value={form.location}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-black mb-2">
//                     Contact *
//                   </label>
//                   <input
//                     type="text"
//                     name="contact"
//                     placeholder="Enter contact information"
//                     value={form.contact}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-black mb-2">
//                     Image URL
//                   </label>
//                   <input
//                     type="text"
//                     name="imageUrl"
//                     placeholder="Enter image URL"
//                     value={form.imageUrl}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   />
//                 </div>
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-black mb-2 flex items-center gap-1">
//                   <CreditCard className="w-4 h-4" /> UPI ID
//                 </label>
//                 <input
//                   type="text"
//                   name="upiVpa"
//                   placeholder="Enter UPI ID (e.g. home@upi)"
//                   value={form.upiVpa}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-black mb-2 flex items-center gap-1">
//                   <QrCode className="w-4 h-4" /> QR Code Image URL
//                 </label>
//                 <input
//                   type="text"
//                   name="qrImageUrl"
//                   placeholder="Enter QR Code Image URL"
//                   value={form.qrImageUrl}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 />
//                 {form.qrImageUrl && (
//                   <div className="mt-2">
//                     <img src={form.qrImageUrl} alt="QR preview" className="w-28 h-28 object-contain rounded border border-gray-300 bg-white shadow" />
//                   </div>
//                 )}
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-black mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   placeholder="Enter description"
//                   value={form.description}
//                   onChange={handleChange}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 />
//               </div>
              
//               <div className="flex gap-3">
//                 <button
//                   type="submit"
//                   disabled={actionLoading}
//                   className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
//                 >
//                   {actionLoading ? (
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   ) : editingId ? (
//                     <Save className="w-4 h-4" />
//                   ) : (
//                     <Plus className="w-4 h-4" />
//                   )}
//                   {actionLoading ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Home' : 'Add Home')}
//                 </button>
                
//                 <button
//                   type="button"
//                   onClick={cancelEdit}
//                   disabled={actionLoading}
//                   className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
//                 >
//                   <X className="w-4 h-4" />
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Loading State */}
//         {loading ? (
//           <div className="bg-white rounded-xl shadow-sm border p-8">
//             <div className="flex items-center justify-center">
//               <div className="flex items-center gap-3">
//                 <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
//                 <span className="text-gray-600">Loading homes...</span>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <>
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//               <div className="bg-white rounded-xl shadow-sm border p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Total Homes</p>
//                     <p className="text-2xl font-bold text-gray-900">{homes.length}</p>
//                   </div>
//                   <div className="p-3 bg-blue-100 rounded-lg">
//                     <Home className="w-6 h-6 text-blue-600" />
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-xl shadow-sm border p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Orphanages</p>
//                     <p className="text-2xl font-bold text-gray-900">{homes.filter(h => h.type === 'orphanage').length}</p>
//                   </div>
//                   <div className="p-3 bg-blue-100 rounded-lg">
//                     <span className="text-2xl">👶</span>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-xl shadow-sm border p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Old Age Homes</p>
//                     <p className="text-2xl font-bold text-gray-900">{homes.filter(h => h.type === 'oldage').length}</p>
//                   </div>
//                   <div className="p-3 bg-purple-100 rounded-lg">
//                     <span className="text-2xl">👴</span>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-xl shadow-sm border p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Locations</p>
//                     <p className="text-2xl font-bold text-gray-900">{new Set(homes.map(h => h.location)).size}</p>
//                   </div>
//                   <div className="p-3 bg-green-100 rounded-lg">
//                     <MapPin className="w-6 h-6 text-green-600" />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Homes List */}
//             <div className="bg-white rounded-xl shadow-sm border">
//               <div className="px-6 py-4 border-b bg-gray-50">
//                 <h2 className="text-lg font-semibold text-gray-900">Property Listings</h2>
//                 <p className="text-sm text-gray-600">Manage all your property listings</p>
//               </div>
              
//               {homes.length === 0 ? (
//                 <div className="p-12 text-center">
//                   <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">No homes found</h3>
//                   <p className="text-gray-600 mb-4">Get started by adding your first property listing.</p>
//                   <button
//                     onClick={() => setShowAddForm(true)}
//                     className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Add Your First Home
//                   </button>
//                 </div>
//               ) : (
//                 <div className="divide-y divide-gray-200">
//                   {homes.map((home) => (
//                     <div key={home._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
//                       <div className="flex items-start gap-4">
//                         {/* Image */}
//                         <div className="flex-shrink-0">
//                           {home.imageUrl ? (
//                             <img
//                               src={home.imageUrl}
//                               alt={home.name}
//                               className="w-24 h-24 object-cover rounded-lg border border-gray-200"
//                               onError={(e) => {
//                                 e.target.style.display = 'none';
//                                 e.target.nextSibling.style.display = 'flex';
//                               }}
//                             />
//                           ) : null}
//                           <div 
//                             className={`w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center ${home.imageUrl ? 'hidden' : 'flex'}`}
//                           >
//                             <Image className="w-8 h-8 text-gray-400" />
//                           </div>
//                         </div>

//                         {/* Content */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-start justify-between mb-3">
//                             <div className="flex-1">
//                               <div className="flex items-center gap-3 mb-2">
//                                 <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//                                   <span className="text-lg">{getTypeIcon(home.type)}</span>
//                                   {home.name}
//                                 </h3>
//                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(home.type)}`}>
//                                   {home.type === 'orphanage' ? 'Orphanage' : 'Old Age Home'}
//                                 </span>
//                               </div>
                              
//                               <div className="space-y-2">
//                                 <div className="flex items-center gap-2 text-gray-600">
//                                   <MapPin className="w-4 h-4 text-gray-500" />
//                                   <span>{home.location}</span>
//                                 </div>
                                
//                                 <div className="flex items-center gap-2 text-gray-600">
//                                   <Phone className="w-4 h-4 text-gray-500" />
//                                   <span>{home.contact}</span>
//                                 </div>
                                
//                                 {home.description && (
//                                   <div className="flex items-start gap-2 text-black mt-3">
//                                     <FileText className="w-4 h-4 mt-0.5 text-gray-500" />
//                                     <p className="leading-relaxed text-sm">{home.description}</p>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
                          
//                           <div className="flex gap-3 pt-4 border-t border-gray-100">
//                             <button
//                               onClick={() => handleEdit(home)}
//                               disabled={actionLoading}
//                               className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
//                             >
//                               <Edit2 className="w-4 h-4" />
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleDelete(home._id, home.name)}
//                               disabled={actionLoading}
//                               className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                               Delete
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Loading Overlay */}
//       {actionLoading && (
//         <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
//           <div className="bg-white rounded-lg p-6 shadow-xl">
//             <div className="flex items-center gap-3">
//               <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
//               <span className="text-black">Processing...</span>
//             </div>
//           </div>
//         </div>
//         )}
//         </div>
//       </div>
//     // </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Home, MapPin, FileText, Check, AlertCircle, Info, Phone, Image, CreditCard, QrCode } from "lucide-react";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-400';
      case 'error':
        return 'bg-red-500 border-red-400';
      case 'info':
        return 'bg-blue-500 border-blue-400';
      default:
        return 'bg-gray-500 border-gray-400';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 text-white px-4 py-3 rounded-lg shadow-lg border ${getToastStyles()} transform transition-all duration-300 ease-in-out`}>
      {getIcon()}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function AdminDashboard() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "orphanage",
    location: "",
    contact: "",
    description: "",
    imageUrl: "",
    upiVpa: "",
    qrImageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [qrPreview, setQrPreview] = useState("");

  // Toast management
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Fetch all homes
  const fetchHomes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/homes");
      const data = await res.json();
      if (data.success) {
        setHomes(data.data);
      } else {
        addToast('Failed to fetch homes', 'error');
      }
    } catch (error) {
      console.error("Error fetching homes:", error);
      addToast('Error fetching homes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomes();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUrlChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, imageUrl: value }));
    setImagePreview(value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast("Please select a valid image file", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        setForm((prev) => ({ ...prev, imageUrl: result }));
        setImagePreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleQrUrlChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, qrImageUrl: value }));
    setQrPreview(value);
  };

  const handleQrUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast("Please select a valid image file", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        setForm((prev) => ({ ...prev, qrImageUrl: result }));
        setQrPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Add or Update home
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name.trim() || !form.location.trim() || !form.contact.trim()) {
      addToast('Name, location, and contact are required', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const url = editingId ? `/api/admin/homes/${editingId}` : "/api/admin/homes";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          upi: { vpa: form.upiVpa, qrImageUrl: form.qrImageUrl },
        }),
      });

      const data = await res.json();
      if (data.success || data._id) {
        setForm({
          name: "",
          type: "orphanage",
          location: "",
          contact: "",
          description: "",
          imageUrl: "",
          upiVpa: "",
          qrImageUrl: "",
        });
        setEditingId(null);
        setShowAddForm(false);
        setImagePreview("");
        setQrPreview("");
        addToast(editingId ? 'Home updated successfully!' : 'Home added successfully!', 'success');
        fetchHomes();
      } else {
        addToast("Error saving home: " + data.error, 'error');
      }
    } catch (error) {
      console.error("Error saving home:", error);
      addToast('Error saving home', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Start editing a home
  const handleEdit = (home) => {
    setEditingId(home._id);
    setForm({
      name: home.name,
      type: home.type,
      location: home.location,
      contact: home.contact,
      description: home.description,
      imageUrl: home.imageUrl,
      upiVpa: home.upi?.vpa || "",
      qrImageUrl: home.upi?.qrImageUrl || "",
    });
    setImagePreview(home.imageUrl || "");
    setQrPreview(home.upi?.qrImageUrl || "");
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setForm({
      name: "",
      type: "orphanage",
      location: "",
      contact: "",
      description: "",
      imageUrl: "",
      upiVpa: "",
      qrImageUrl: "",
    });
    setImagePreview("");
    setQrPreview("");
  };

  // Delete home
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/homes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        addToast('Home deleted successfully!', 'success');
        fetchHomes();
      } else {
        addToast("Error deleting home: " + data.error, 'error');
      }
    } catch (error) {
      console.error("Error deleting home:", error);
      addToast('Error deleting home', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getTypeColor = (type) => {
    return type === 'orphanage' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const getTypeIcon = (type) => {
    return type === 'orphanage' ? '👶' : '👴';
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                🏠 Homes Management
              </h1>
              <p className="text-slate-600 text-sm mt-2 font-medium">Manage orphanages and old age homes</p>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              {editingId ? 'Cancel Edit' : 'Add New Home'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Add/Edit New Home Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? '✏️ Edit Home' : '➕ Add New Home'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Home Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter home name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="orphanage">Orphanage</option>
                    <option value="oldage">Old Age Home</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact *
                  </label>
                  <input
                    type="text"
                    name="contact"
                    placeholder="Enter contact information"
                    value={form.contact}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

              <div className="md:col-span-2 space-y-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Image className="w-4 h-4" /> Image
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Enter image URL"
                  value={form.imageUrl}
                  onChange={handleImageUrlChange}
                  className="w-full px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Or upload image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full md:w-auto text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {imagePreview ? (
                  <div className="mt-1">
                    <p className="text-xs text-gray-500 mb-2">Preview</p>
                    <img
                      src={imagePreview}
                      alt="Selected preview"
                      className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200 bg-white shadow-sm"
                    />
                  </div>
                ) : null}
              </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> UPI ID
                </label>
                <input
                  type="text"
                  name="upiVpa"
                  placeholder="Enter UPI ID (e.g. home@upi)"
                  value={form.upiVpa}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <QrCode className="w-4 h-4" /> QR Code Image
            </label>
            <input
              type="text"
              name="qrImageUrl"
              placeholder="Enter QR Code Image URL"
              value={form.qrImageUrl}
              onChange={handleQrUrlChange}
              className="w-full px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <div className="flex flex-col md:flex-row md:items-center gap-3 mt-2">
              <label className="text-sm font-semibold text-gray-700">
                Or upload QR image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleQrUpload}
                className="w-full md:w-auto text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {qrPreview ? (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Preview</p>
                <img src={qrPreview} alt="QR preview" className="w-32 h-32 object-contain rounded-lg border-2 border-gray-300 bg-white shadow-md p-2" />
              </div>
            ) : null}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white px-6 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : editingId ? (
                    <Save className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {actionLoading ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Home' : 'Add Home')}
                </button>
                
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-600 font-medium">Loading homes...</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">Total Homes</p>
                    <p className="text-3xl font-bold text-blue-900 mt-1">{homes.length}</p>
                  </div>
                  <div className="p-3 bg-blue-200 rounded-xl">
                    <Home className="w-7 h-7 text-blue-700" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-sm border border-indigo-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-indigo-700">Orphanages</p>
                    <p className="text-3xl font-bold text-indigo-900 mt-1">{homes.filter(h => h.type === 'orphanage').length}</p>
                  </div>
                  <div className="p-3 bg-indigo-200 rounded-xl">
                    <span className="text-3xl">👶</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-700">Old Age Homes</p>
                    <p className="text-3xl font-bold text-purple-900 mt-1">{homes.filter(h => h.type === 'oldage').length}</p>
                  </div>
                  <div className="p-3 bg-purple-200 rounded-xl">
                    <span className="text-3xl">👴</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700">Locations</p>
                    <p className="text-3xl font-bold text-green-900 mt-1">{new Set(homes.map(h => h.location)).size}</p>
                  </div>
                  <div className="p-3 bg-green-200 rounded-xl">
                    <MapPin className="w-7 h-7 text-green-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Homes List */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-slate-50">
                <h2 className="text-lg font-bold text-gray-900">Property Listings</h2>
                <p className="text-sm text-gray-600 mt-1">Manage all your property listings</p>
              </div>
              
              {homes.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Home className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No homes found</h3>
                  <p className="text-gray-600 mb-6">Get started by adding your first property listing.</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    Add Your First Home
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {homes.map((home) => (
                    <div key={home._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-start gap-4">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          {home.imageUrl ? (
                            <img
                              src={home.imageUrl}
                              alt={home.name}
                              className="w-28 h-28 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-gray-200 flex items-center justify-center shadow-sm ${home.imageUrl ? 'hidden' : 'flex'}`}
                          >
                            <Image className="w-10 h-10 text-gray-400" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                  <span className="text-2xl">{getTypeIcon(home.type)}</span>
                                  {home.name}
                                </h3>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(home.type)}`}>
                                  {home.type === 'orphanage' ? 'Orphanage' : 'Old Age Home'}
                                </span>
                              </div>
                              
                              <div className="space-y-2.5">
                                <div className="flex items-center gap-2 text-gray-700">
                                  <MapPin className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium">{home.location}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-gray-700">
                                  <Phone className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium">{home.contact}</span>
                                </div>
                                
                                {home.description && (
                                  <div className="flex items-start gap-2 text-gray-800 mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <FileText className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                                    <p className="leading-relaxed text-sm">{home.description}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => handleEdit(home)}
                              disabled={actionLoading}
                              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 text-sm"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(home._id, home.name)}
                              disabled={actionLoading}
                              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
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
      </div>

      {/* Loading Overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-900 font-semibold text-lg">Processing...</span>
            </div>
          </div>
        </div>
        )}
        </div>
      </div>
    // </div>
  );
}