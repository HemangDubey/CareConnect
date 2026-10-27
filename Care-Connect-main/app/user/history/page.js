'use client';

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";

export default function UserHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [payments, setPayments] = useState([]);
  const router = useRouter();

  const fetchHistory = useCallback(async (token) => {
    try {
      setLoading(true);

      const res = await fetch("/api/user/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        router.push("/user/login");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setDonations(data.donations || []);
        setVolunteers(data.volunteers || []);
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/user/login");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/user/login");
      return;
    }

    fetchHistory(token);
  }, [router, fetchHistory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-purple-700">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-10">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            My History
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View all your donations, volunteer activities, and payment transactions in one place.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Donation History */}
        <section className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl text-white">🎁</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Donation History</h2>
            </div>
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              {donations.length} {donations.length === 1 ? "Donation" : "Donations"}
            </span>
          </div>

          {donations.length > 0 ? (
            <div className="space-y-4">
              {donations.map((donation) => {
                const home = donation.homeId;
                return (
                  <div
                    key={donation._id}
                    className="p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border-2 border-green-100 hover:border-green-300 transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      {donation.imageUrl && (
                        <Image
                          src={donation.imageUrl}
                          alt={donation.itemName}
                          width={80}
                          height={80}
                          unoptimized
                          className="object-cover rounded-xl border-2 border-green-200"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-green-800 text-lg">
                              {donation.itemName}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Category: <span className="font-medium">{donation.category}</span> •{" "}
                              Quantity: <span className="font-medium">{donation.quantity}</span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Home: <span className="font-medium">{home?.name || "Unknown"}</span> •{" "}
                              Location: <span className="font-medium">{home?.location || "Unknown"}</span>
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              donation.status === "Completed"
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : donation.status === "Accepted"
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            }`}
                          >
                            {donation.status}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                          {donation.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>📍 {donation.pickupAddress}</span>
                          <span>📅 {new Date(donation.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-gray-400">🎁</span>
              </div>
              <p className="text-gray-500 text-lg mb-2">No donation history yet</p>
              <p className="text-gray-400 text-sm">Start donating to see your history here.</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200"
              >
                Browse Homes
              </button>
            </div>
          )}
        </section>

        {/* Volunteer Activity */}
        <section className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl text-white">🤝</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Volunteer Activity</h2>
            </div>
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
              {volunteers.length} {volunteers.length === 1 ? "Participation" : "Participations"}
            </span>
          </div>

          {volunteers.length > 0 ? (
            <div className="space-y-4">
              {volunteers.map((participation) => {
                const request = participation.volunteerRequestId;
                const home = request?.homeId;
                return (
                  <div
                    key={participation._id}
                    className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-orange-800 text-lg mb-2">
                          {request?.title || "Volunteer Request"}
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                          {request?.description || "No description available"}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600">
                          <div className="flex items-center">
                            <span className="mr-1">🏠</span>
                            {home?.name || "Unknown Home"}
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">📍</span>
                            {request?.location || "Location not specified"}
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">📅</span>
                            {request?.dateTime
                              ? new Date(request.dateTime).toLocaleDateString()
                              : "Date not specified"}
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">🕐</span>
                            {request?.dateTime
                              ? new Date(request.dateTime).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Time not specified"}
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                        Completed
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-3">
                      Volunteered on:{" "}
                      {new Date(participation.timestamp).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-gray-400">🤝</span>
              </div>
              <p className="text-gray-500 text-lg mb-2">No volunteer history yet</p>
              <p className="text-gray-400 text-sm">Start volunteering to see your history here.</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Browse Homes
              </button>
            </div>
          )}
        </section>

        {/* Payment Transactions */}
        <section className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl text-white">💳</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Payment Transactions</h2>
            </div>
            <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
              {payments.length} {payments.length === 1 ? "Payment" : "Payments"}
            </span>
          </div>

          {payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => {
                const donation = payment.donationId;
                const home = donation?.homeId;
                const shortId =
                  payment.razorpay_payment_id &&
                  payment.razorpay_payment_id.slice(
                    Math.max(0, payment.razorpay_payment_id.length - 6)
                  );

                return (
                  <div
                    key={payment._id}
                    className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-indigo-800 text-lg">
                          ₹{payment.amount?.toFixed(2)} {payment.currency || "INR"}
                        </h3>
                        {donation && (
                          <p className="text-sm text-gray-600 mt-1">
                            Linked donation:{" "}
                            <span className="font-medium">
                              {donation.itemName} ({donation.category})
                            </span>
                            {home && (
                              <>
                                {" "}
                                • Home:{" "}
                                <span className="font-medium">
                                  {home.name} ({home.location})
                                </span>
                              </>
                            )}
                          </p>
                        )}
                        {payment.razorpay_payment_id && (
                          <p className="text-xs text-gray-500 mt-1">
                            Razorpay Payment ID:{" "}
                            <span className="font-mono">
                              {payment.razorpay_payment_id}
                            </span>
                          </p>
                        )}
                        {payment.razorpay_order_id && (
                          <p className="text-xs text-gray-500">
                            Order ID:{" "}
                            <span className="font-mono">
                              {payment.razorpay_order_id}
                            </span>
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          payment.status === "paid" || payment.status === "captured"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : payment.status === "created"
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {payment.status || "created"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                      <span>
                        Created on:{" "}
                        {payment.createdAt
                          ? new Date(payment.createdAt).toLocaleString()
                          : "-"}
                      </span>
                      {shortId && (
                        <span className="font-mono">
                          Ref: …{shortId}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-gray-400">💳</span>
              </div>
              <p className="text-gray-500 text-lg mb-2">No payment transactions yet</p>
              <p className="text-gray-400 text-sm">
                Complete a Razorpay payment to see it recorded here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

