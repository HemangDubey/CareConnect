export default function DonationSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 px-4">
      <div className="max-w-xl w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Thank you for your donation!
        </h1>
        <p className="text-gray-600">
          Your payment has been received successfully. A confirmation may be sent
          to your payment provider, and the home will be notified of your
          support.
        </p>
        <p className="text-sm text-gray-400">
          For any issues with your payment, please contact support with your
          transaction details.
        </p>
      </div>
    </div>
  );
}

