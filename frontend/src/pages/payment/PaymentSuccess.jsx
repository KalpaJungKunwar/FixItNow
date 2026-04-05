import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pidx = searchParams.get("pidx");
  const type = searchParams.get("type");
  const isSubscription = type === "subscription";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-sm w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-500 text-3xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          {isSubscription ? "Subscription Activated!" : "Payment Successful!"}
        </h2>
        {isSubscription ? (
          <p className="text-gray-500 text-sm mb-6">
            Your provider subscription is now active. You can access the full
            dashboard.
          </p>
        ) : (
          <p className="text-gray-500 text-sm mb-6">Transaction ID: {pidx}</p>
        )}
        <button
          onClick={() =>
            navigate(isSubscription ? "/providerdashboard" : "/dashboard")
          }
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors"
        >
          {isSubscription ? "Go to Provider Dashboard" : "Go to Dashboard"}
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
