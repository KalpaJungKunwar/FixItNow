import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pidx = searchParams.get("pidx");
  const type = searchParams.get("type");
  const isSubscription = type === "subscription";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-green-500" />

          <div className="px-10 py-12 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50">
              <svg
                className="w-10 h-10 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isSubscription
                ? "Subscription Activated!"
                : "Payment Successful!"}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              {isSubscription
                ? "Your provider subscription is now active. You have full access to the provider dashboard and all its features."
                : "Your payment has been processed successfully. The service provider has been notified."}
            </p>

            <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Status
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Confirmed
                </span>
              </div>
              {pidx && !isSubscription && (
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    Transaction ID
                  </span>
                  <span className="text-xs font-mono text-gray-700 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
                    {pidx}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Date
                </span>
                <span className="text-xs text-gray-700">
                  {new Date().toLocaleDateString("en-US", {
                    dateStyle: "medium",
                  })}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                navigate(isSubscription ? "/providerdashboard" : "/dashboard")
              }
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-2xl text-sm transition-colors shadow-lg shadow-emerald-100"
            >
              {isSubscription
                ? "Go to Provider Dashboard"
                : "Go to My Bookings"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          A confirmation has been recorded. Contact support if you have any
          issues.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
