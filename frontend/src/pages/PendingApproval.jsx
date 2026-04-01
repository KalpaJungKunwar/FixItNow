import { Link } from "react-router-dom";

export default function PendingApproval() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        
        {/* Icon */}
        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⏳</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Account Pending Approval
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Thank you for registering! Your account and documents are currently
          under review by our admin team. This usually takes{" "}
          <span className="font-medium text-gray-700">24–48 hours</span>.
        </p>

        {/* Steps */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            What happens next?
          </p>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              ✓
            </div>
            <p className="text-sm text-gray-600">
              Your registration has been submitted successfully.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              2
            </div>
            <p className="text-sm text-gray-600">
              Our admin team will verify your uploaded documents.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              3
            </div>
            <p className="text-sm text-gray-600">
              Once approved, you'll be able to log in and use FixItNow.
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-6">
          <p className="text-yellow-700 text-xs leading-relaxed">
            ⚠️ You will <span className="font-semibold">not</span> be able to
            log in until your account has been approved. Please check back
            after 24–48 hours.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition duration-200 text-sm text-center"
          >
            Go to Login
          </Link>
          
        </div>

      </div>
    </div>
  );
}