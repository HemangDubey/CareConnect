'use client';

import { useEffect, useState } from 'react';

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

/**
 * Razorpay payment button
 *
 * Props:
 * - amount: number (in INR, not paise)
 * - currency?: string (default: "INR")
 * - metadata?: object (donation info: homeId, homeName, donor details, redirectTo, etc.)
 * - buttonText?: string
 * - className?: string
 * - onSuccess?: (data) => void
 * - onFailure?: (error) => void
 */
export default function RazorpayButton({
  amount,
  currency = 'INR',
  metadata = {},
  buttonText = 'Pay Securely with Razorpay',
  className = '',
  onSuccess,
  onFailure,
}) {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load Razorpay checkout.js script once on the client
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.Razorpay) {
      setSdkLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setSdkLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      setError('Unable to load payment SDK. Please try again later.');
    };
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      setError('');

      const numericAmount = Number(amount);
      if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
        setError('Please enter a valid amount.');
        return;
      }

      if (!RAZORPAY_KEY_ID) {
        console.error('NEXT_PUBLIC_RAZORPAY_KEY_ID is not configured');
        setError('Payment gateway is not configured. Please contact support.');
        return;
      }

      if (!sdkLoaded || typeof window === 'undefined' || !window.Razorpay) {
        setError('Payment SDK not ready. Please wait a moment and try again.');
        return;
      }

      setLoading(true);

      // 1. Create order on our secure backend
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: numericAmount,
          currency,
          metadata,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData?.success) {
        const message = orderData?.message || 'Unable to create payment order.';
        setError(message);
        if (onFailure) onFailure(new Error(message));
        return;
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: String(orderData.amount), // amount in paise
        currency: orderData.currency,
        name: metadata.homeName || 'Care Connect Donation',
        description: metadata.description || 'Donation',
        order_id: orderData.orderId,
        prefill: {
          name: metadata.donorName || '',
          email: metadata.donorEmail || '',
          contact: metadata.phone || '',
        },
        notes: metadata,
        theme: {
          color: '#7c3aed',
        },
        handler: async function (response) {
          // 2. Verify payment on our backend using signature
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                metadata,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData?.success) {
              if (onSuccess) {
                onSuccess(verifyData);
              }

              // Optional redirect (webhook remains source of truth)
              if (metadata.redirectTo) {
                window.location.href = metadata.redirectTo;
              }
            } else {
              const msg =
                verifyData?.message || 'Payment verification failed. Please contact support.';
              setError(msg);
              if (onFailure) onFailure(new Error(msg));
            }
          } catch (err) {
            console.error('Error verifying payment:', err);
            setError('Payment verification failed. Please contact support.');
            if (onFailure) onFailure(err);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Error starting payment:', err);
      setError('Something went wrong. Please try again.');
      if (onFailure) onFailure(err);
      setLoading(false);
    }
  };

  const disabled =
    loading || !sdkLoaded || !amount || Number(amount) <= 0;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handlePayment}
        disabled={disabled}
        className={`w-full bg-black text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${className}`}
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Pay with</span>
            <span className="font-bold">Razorpay</span>
          </>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

