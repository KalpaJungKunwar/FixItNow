import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
    specialty: "",
    experience: "",
    location: "",
  });

  const [idDocument, setIdDocument] = useState(null);
  const [idDocType, setIdDocType] = useState("citizenship");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadDocument = async (file, documentType, userId) => {
    const fileForm = new FormData();
    fileForm.append("files", file);
    fileForm.append("userId", userId);
    fileForm.append("documentType", documentType);
    await axios.post(`${API_URL}/documentations/pending-upload`, fileForm);
  };

  const [showPw, setShowPw] = useState(false);

  const togglePw = () => setShowPw((prev) => !prev);

  const EyeIcon = ({ open }) =>
    open ? (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3l18 18M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42M9.88 5.09A9.77 9.77 0 0112 4.5c5 0 9.27 3.11 11 7.5a13.15 13.15 0 01-4.22 5.56M6.1 6.1C3.87 7.64 2.24 9.85 1 12c1.73 4.39 6 7.5 11 7.5 1.05 0 2.07-.12 3.06-.34"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.1 12C3.9 7.6 8 4.5 12 4.5S20.1 7.6 21.9 12C20.1 16.4 16 19.5 12 19.5S3.9 16.4 2.1 12z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        />
      </svg>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idDocument) {
      setError("Please upload a citizenship or passport document.");
      return;
    }
    if (formData.role === "provider" && !certificate) {
      setError("Providers must upload a professional certificate.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/auth/local/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        roleType: formData.role,
      });
      const { user } = res.data;
      if (formData.role === "provider") {
        await axios.post(`${API_URL}/provider-profiles/public-create`, {
          userId: user.id,
          specialty: formData.specialty,
          experience: Number(formData.experience),
          location: formData.location,
        });
      }
      await uploadDocument(idDocument, idDocType, user.id);
      if (formData.role === "provider" && certificate) {
        await uploadDocument(certificate, "certificate", user.id);
      }
      navigate("/pending-approval");
    } catch (err) {
      setError(
        err.response?.data?.error?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-1">
          Create Account
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Join thousands of users getting things fixed today.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              I am a...
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="customer">Customer (I need services)</option>
              <option value="provider">
                Service Provider (I offer services)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="username"
              placeholder="e.g. Kalpa Jung"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                name="password"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="
        w-full border border-gray-300
        rounded-lg px-4 py-2 pr-10
        focus:outline-none focus:ring-2 focus:ring-blue-500
        transition
        bg-white
      "
              />

              <span
                onClick={togglePw}
                className="
        absolute right-3 top-1/2 -translate-y-1/2
        text-gray-400 hover:text-blue-500
        cursor-pointer transition select-none
      "
              >
                <EyeIcon open={showPw} />
              </span>
            </div>
          </div>

          {formData.role === "provider" && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-blue-600 mb-3">
                Provider Details
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty
                </label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select your specialty</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="painting">Painting</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="technical">Technical</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience"
                  placeholder="e.g. 5"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  min={0}
                  max={60}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Kathmandu, Lalitpur"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-blue-600 mb-3">
              Identity Verification
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Your documents will be reviewed by our admin team before your
              account is activated.
            </p>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Document Type
              </label>
              <select
                value={idDocType}
                onChange={(e) => setIdDocType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="citizenship">Citizenship Certificate</option>
                <option value="passport">Passport</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload{" "}
                {idDocType === "citizenship"
                  ? "Citizenship Certificate"
                  : "Passport"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setIdDocument(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-600 file:text-sm cursor-pointer"
              />
              {idDocument && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ {idDocument.name}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Accepted: JPG, PNG, PDF (max 5MB)
              </p>
            </div>

            {formData.role === "provider" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Certificate{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setCertificate(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-600 file:text-sm cursor-pointer"
                />
                {certificate && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {certificate.name}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Trade license, skill certificate, or any relevant credential
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create My Account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-2">
          By signing up, you agree to FixItNow's{" "}
          <Link to="/terms" className="underline hover:text-gray-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline hover:text-gray-600">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
