'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, Mail, Phone, MapPin, FileText, Upload, CheckCircle, AlertCircle, Image as ImageIcon, CreditCard, QrCode } from 'lucide-react';

export default function RegisterHomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    homeName: '',
    adminName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    homePhotoFile: null,
    documentFile: null,
    upiId: '',
    qrImageFile: null,
  });
  const [homePhotoPreview, setHomePhotoPreview] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [qrImagePreview, setQrImagePreview] = useState(null);
  const toastTimeout = useRef(null);
  const [toast, setToast] = useState({ open: false, type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHomePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (images only)
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }
      setFormData(prev => ({ ...prev, homePhotoFile: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setHomePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (PDF, images)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Please select a PDF or image file (JPEG, PNG)' });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size should be less than 5MB' });
        return;
      }
      setFormData(prev => ({ ...prev, documentFile: file }));

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setDocumentPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setDocumentPreview(null);
      }
    }
  };

  const handleQrImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (images only)
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }
      setFormData(prev => ({ ...prev, qrImageFile: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Convert home photo to base64 if provided
      let homePhoto = null;
      if (formData.homePhotoFile) {
        homePhoto = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result); // This will be a data URL (base64)
          };
          reader.onerror = reject;
          reader.readAsDataURL(formData.homePhotoFile);
        });
      }
      // Fallback: if a preview already exists (e.g., previously read), use it
      const finalHomePhoto = homePhoto || homePhotoPreview;

      if (!finalHomePhoto) {
        setMessage({ type: 'error', text: 'Home photo is required. Please upload an image.' });
        setLoading(false);
        return;
      }

      // Convert document to base64 if provided
      let documentUrl = null;
      if (formData.documentFile) {
        documentUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result); // This will be a data URL (base64)
          };
          reader.onerror = reject;
          reader.readAsDataURL(formData.documentFile);
        });
      }

      // Convert QR image to base64 if provided
      let qrImage = null;
      if (formData.qrImageFile) {
        qrImage = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result); // This will be a data URL (base64)
          };
          reader.onerror = reject;
          reader.readAsDataURL(formData.qrImageFile);
        });
      }

      const response = await fetch('/api/home-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          homeName: formData.homeName,
          adminName: formData.adminName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          description: formData.description,
          homePhoto: finalHomePhoto,
          documentUrl,
          upiId: formData.upiId,
          qrImage,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showToast('Registration submitted successfully! We will review your request and get back to you soon.', 'success');
        // Reset form
        setFormData({
          homeName: '',
          adminName: '',
          email: '',
          phone: '',
          address: '',
          description: '',
          homePhotoFile: null,
          documentFile: null,
          upiId: '',
          qrImageFile: null,
        });
        setHomePhotoPreview(null);
        setDocumentPreview(null);
        setQrImagePreview(null);
        // Clear file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = '');
        // Clear UPI ID input
        const upiInput = document.querySelector('input[name="upiId"]');
        if (upiInput) upiInput.value = '';
      } else {
        showToast(result.error || 'Failed to submit registration request', 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ type: '', text: '' });
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (text, type = 'success') => {
    setToast({ open: true, type, text });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast({ open: false, type: '', text: '' }), 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#6328e4] via-[#693ac0] to-[#7d35f7] flex items-center justify-center p-5 py-8 md:py-20">
      {/* Toast notification area */}
      {toast.open && (
        <div className="fixed top-8 inset-x-0 z-50 flex items-center justify-center animate-fadeIn">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl bg-gradient-to-r ${toast.type==='success'? 'from-emerald-400 via-white/80 to-blue-100' : 'from-red-400 via-white/60 to-rose-100'} border-2 flex items-center gap-4 min-w-[320px] max-w-[90vw] backdrop-blur-lg`}>
            {toast.type==='success'? <CheckCircle className="text-green-700 w-7 h-7"/> : <AlertCircle className="text-red-600 w-7 h-7"/>}
            <span className="text-lg font-semibold text-gray-900 drop-shadow-sm">{toast.text}</span>
          </div>
        </div>
      )}
      <div className="max-w-4xl w-full bg-white/80 backdrop-blur-[6px] rounded-3xl shadow-[0_10px_32px_0_rgba(80,60,160,0.18)] overflow-hidden animate-fadeInUp border border-white/40">
        <div className="p-8 md:p-14">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-lg mb-4">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold text-gray-800 mb-2 tracking-tight">Register Your Home</h1>
            <p className="text-gray-500 text-lg font-medium">Submit a registration request for your care home or orphanage</p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Home Name *
                </label>
                <input
                  type="text"
                  name="homeName"
                  value={formData.homeName}
                  onChange={handleChange}
                  required
                  placeholder="Enter home name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Admin Name *
                </label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  required
                  placeholder="Enter admin name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter contact number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Enter full address"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-vertical text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your home (e.g., type: orphanage or old age home, capacity, services offered, etc.)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-vertical text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Home Photo *
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Upload a photo of your home (JPEG, PNG - Max 5MB)
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleHomePhotoChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {homePhotoPreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={homePhotoPreview} 
                    alt="Home photo preview" 
                    className="max-w-md rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Upload className="w-4 h-4 inline mr-2" />
                Document Upload *
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Upload registration certificate or ID proof (PDF, JPEG, PNG - Max 5MB)
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleDocumentChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {documentPreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={documentPreview} 
                    alt="Document preview" 
                    className="max-w-xs rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}
              {formData.documentFile && !documentPreview && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {formData.documentFile.name}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />
                UPI ID
              </label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                placeholder="Enter your UPI ID (e.g., yourname@upi)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <QrCode className="w-4 h-4 inline mr-2" />
                QR Code Image
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Upload your UPI QR code image (JPEG, PNG - Max 5MB)
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleQrImageChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {qrImagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrImagePreview}
                    alt="QR code preview"
                    className="max-w-xs rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? 'Submitting...' : 'Submit Registration Request'}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s cubic-bezier(0.4,0.1,0.3,1.1); }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.35s both; }
      `}</style>
    </div>
  );
}

