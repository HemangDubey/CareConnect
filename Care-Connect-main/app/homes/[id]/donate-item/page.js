'use client';
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function DonateItemPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [homeLoading, setHomeLoading] = useState(true);
  const [home, setHome] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    itemName: '',
    description: '',
    quantity: '',
    pickupAddress: '',
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch home details
  useEffect(() => {
    async function fetchHome() {
      setHomeLoading(true);
      try {
        const res = await fetch(`/api/homes/${id}`);
        const homeData = await res.json();
        if (res.ok) {
          setHome(homeData);
        } else {
          console.error("Error fetching home:", homeData.error);
        }
      } catch (error) {
        console.error("Error fetching home:", error);
      } finally {
        setHomeLoading(false);
      }
    }
    if (id) {
      fetchHome();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file' });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }
      setFormData(prev => ({ ...prev, imageFile: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Get user info from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('homeId', id);
      submitData.append('category', formData.category);
      submitData.append('itemName', formData.itemName);
      submitData.append('description', formData.description);
      submitData.append('quantity', formData.quantity);
      submitData.append('pickupAddress', formData.pickupAddress);
      submitData.append('donorName', user.name || 'Anonymous');
      submitData.append('donorEmail', user.email || '');
      
      if (formData.imageFile) {
        submitData.append('image', formData.imageFile);
      }

      const response = await fetch('/api/donations/item', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Donation submitted successfully! Thank you for your contribution.' });
        // Reset form
        setFormData({
          category: '',
          itemName: '',
          description: '',
          quantity: '',
          pickupAddress: '',
          imageFile: null,
        });
        setImagePreview(null);
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push(`/homes/${id}`);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to submit donation. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting donation:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* <Navbar /> */}
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Home Info Card */}
        {homeLoading ? (
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20 mb-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading home details...</p>
              </div>
            </div>
          </div>
        ) : home && (
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Home Image */}
              {home.imageUrl ? (
                <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden border-4 border-purple-200 shadow-lg flex-shrink-0">
                  <img
                    src={home.imageUrl}
                    alt={home.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full md:w-48 h-48 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center border-4 border-purple-200 shadow-lg flex-shrink-0">
                  <span className="text-6xl text-white">🏡</span>
                </div>
              )}
              
              {/* Home Details */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
                  {home.name}
                </h2>
                {home.description && (
                  <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                    {home.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {home.location && (
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">📍</span>
                      <span className="text-sm font-medium">{home.location}</span>
                    </div>
                  )}
                  {home.type && (
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">🏠</span>
                      <span className="text-sm font-medium capitalize">{home.type}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Donate Items
          </h1>
          <p className="text-gray-600 text-lg">
            {home ? `Your donation will help ${home.name}` : 'Make a difference with your donation'}
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-300 text-green-800' 
              : 'bg-red-100 border border-red-300 text-red-800'
          }`}>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Donation Form */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white text-gray-800"
              >
                <option value="">Select a category</option>
                <option value="Food">Food</option>
                <option value="Clothes">Clothes</option>
                <option value="Books">Books</option>
                <option value="Furniture">Furniture</option>
                <option value="Stationery">Stationery</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                required
                placeholder="e.g., Rice, Shirts, Story Books"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white text-gray-800"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe the items you're donating..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white text-gray-800 resize-none"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                placeholder="Enter quantity"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white text-gray-800"
              />
            </div>

            {/* Upload Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded-2xl border-2 border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Pickup Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Enter the address where items can be picked up..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white text-gray-800 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push(`/homes/${id}`)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Donation'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

