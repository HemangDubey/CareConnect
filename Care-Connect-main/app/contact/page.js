'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    setShowSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-5">
      <div className="max-w-6xl w-full bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp">
        <div className="grid md:grid-cols-2">

          {/* Left Section */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-12 md:p-16 relative overflow-hidden">
            <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-24 -right-24 animate-float" />
            <div className="absolute w-48 h-48 bg-white/10 rounded-full -bottom-12 -left-12 animate-float-delayed" />

            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-6 animate-slideInLeft">Get in Touch</h1>
              <p className="text-lg mb-10 opacity-90 animate-slideInLeft-delayed">
                We&apos;re here to help — reach out anytime!
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 animate-slideInLeft-more">
                  <Mail className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="block">Email</strong>
                    <span className="opacity-90">CareConnect@company.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 animate-slideInLeft-extra">
                  <Phone className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="block">Phone</strong>
                    <span className="opacity-90">+91 8887014665</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 animate-slideInLeft-final">
                  <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="block">Address</strong>
                    <span className="opacity-90">123 Business Street<br />New York, NY 10001</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="p-12 md:p-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 animate-slideInRight">Send us a Message</h2>

            {showSuccess && (
              <div className="mb-6 p-4 bg-green-500 text-white rounded-xl animate-slideInRight">
                ✅ Message sent successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="animate-slideInRight-delayed text-black">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                />
              </div>

              <div className="animate-slideInRight-more">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-black"
                />
              </div>

              <div className="animate-slideInRight-extra">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-black"
                />
              </div>

              <div className="animate-slideInRight-final">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-vertical text-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slideInRight-button"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ✅ Correct style tag */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }

        .animate-fadeInUp { animation: fadeInUp 0.8s ease; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease 0.2s both; }
        .animate-slideInLeft-delayed { animation: slideInLeft 0.8s ease 0.4s both; }
        .animate-slideInLeft-more { animation: slideInLeft 0.8s ease 0.6s both; }
        .animate-slideInLeft-extra { animation: slideInLeft 0.8s ease 0.7s both; }
        .animate-slideInLeft-final { animation: slideInLeft 0.8s ease 0.8s both; }

        .animate-slideInRight { animation: slideInRight 0.8s ease 0.3s both; }
        .animate-slideInRight-delayed { animation: slideInRight 0.8s ease 0.4s both; }
        .animate-slideInRight-more { animation: slideInRight 0.8s ease 0.5s both; }
        .animate-slideInRight-extra { animation: slideInRight 0.8s ease 0.6s both; }
        .animate-slideInRight-final { animation: slideInRight 0.8s ease 0.7s both; }
        .animate-slideInRight-button { animation: slideInRight 0.8s ease 0.8s both; }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
