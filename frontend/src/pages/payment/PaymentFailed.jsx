import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-red-400 to-rose-500" />

          <div className="px-10 py-12 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-red-50">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              We were unable to process your payment. No charges have been made
              to your account. Please try again or use a different payment
              method.
            </p>

            <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Common reasons for failure
              </p>
              <div className="space-y-2.5">
                {[
                  "Insufficient account balance",
                  "Card declined by your bank",
                  "Session timed out during payment",
                  "Network interruption",
                ].map((reason) => (
                  <div key={reason} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-300 flex-shrink-0" />
                    <span className="text-xs text-gray-600">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3.5 rounded-2xl text-sm hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-2xl text-sm transition-colors shadow-lg shadow-red-100"
              >
                My Bookings
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Need help? Contact our support team for assistance.
        </p>
      </div>
    </div>
  );
};

export default PaymentFailed;
