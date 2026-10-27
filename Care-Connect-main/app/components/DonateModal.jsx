// file: app/components/DonateModal.jsx
 'use client';

 import { useState, useEffect } from 'react';
 import { Copy, Check, X } from 'lucide-react';
 import toast from 'react-hot-toast';
 import RazorpayButton from './RazorpayButton';

 export default function DonateModal({ isOpen, onClose, homeId, homeName }) {
  const [amount, setAmount] = useState('');
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch home data when modal opens
  useEffect(() => {
    if (isOpen && homeId) {
      fetchHome();
    }
  }, [isOpen, homeId]);

  const fetchHome = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/homes/${homeId}`);
      if (res.ok) {
        const homeData = await res.json();
        setHome(homeData);
      } else {
        toast.error('Home information not available');
      }
    } catch (error) {
      console.error('Error fetching home:', error);
      toast.error('Failed to load home information');
    } finally {
      setLoading(false);
    }
  };

  const copyUpiId = () => {
    if (home?.upi?.vpa) {
      navigator.clipboard.writeText(home.upi.vpa);
      setCopied(true);
      toast.success('UPI ID copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openUpiApp = () => {
    if (!home?.upi?.vpa) {
      toast.error('UPI ID not available');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Generate UPI payment URL
    // Do not store PIN/CVV - this is just a payment intent URL
    const upiParams = new URLSearchParams({
      pa: home.upi.vpa, // Payee address (UPI ID)
      pn: home.name || homeName || 'Donation', // Payee name
      am: amount, // Amount
      cu: 'INR', // Currency
    });
    const upiUrl = `upi://pay?${upiParams.toString()}`;
    
    // Try to open UPI app
    window.location.href = upiUrl;
    toast.success('Opening UPI app...');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-3xl z-10">
          <h2 className="text-2xl font-bold text-gray-800">Donate</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading payment information...</p>
            </div>
          ) : home?.upi?.vpa ? (
            <div className="space-y-6">
              {/* QR Code Display - Large and scan-friendly */}
              {home.upi.qrImageUrl ? (
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-purple-200">
                    <img
                      src={home.upi.qrImageUrl}
                      alt="UPI QR Code"
                      className="w-72 h-72 object-contain rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 p-8 rounded-2xl text-center">
                  <p className="text-gray-600 mb-2">QR code not available</p>
                  <p className="text-sm text-gray-500">Please use the UPI ID below</p>
                </div>
              )}

              {/* UPI ID Display */}
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">UPI ID:</span>
                  <button
                    onClick={copyUpiId}
                    className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 transition-colors bg-white px-3 py-1 rounded-lg hover:bg-purple-100"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xl font-bold text-gray-800 break-all text-center">
                  {home.upi.vpa}
                </p>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  step="1"
                  className="w-full px-4 text-black py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                />
              </div>

              {/* Razorpay Button */}
              <div className="space-y-3">
                <RazorpayButton
                  amount={amount ? parseFloat(amount) : 0}
                  currency="INR"
                  metadata={{
                    homeId,
                    homeName: home?.name || homeName,
                    type: 'HOME_DONATION',
                    redirectTo: '/donation/success',
                  }}
                />

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    or
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              </div>

              {/* Open UPI App Button */}
              <button
                onClick={openUpiApp}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                Open UPI App
              </button>

              {/* Fallback Instructions */}
              {!home.upi.qrImageUrl && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Instructions:</strong> Copy the UPI ID above and paste it in your UPI app to make the payment.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">UPI information not available for this home</p>
              <button
                onClick={onClose}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
