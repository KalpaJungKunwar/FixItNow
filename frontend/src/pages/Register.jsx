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
    avg_hourly_rate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Step 1: Register user
      const res = await axios.post(`${API_URL}/auth/local/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      const { jwt, user } = res.data;

      // Step 2: Update user with roleType
      await axios.put(
        `${API_URL}/users/${user.id}`,
        { roleType: formData.role },
        { headers: { Authorization: `Bearer ${jwt}` } },
      );

      // Step 3: If provider, create ProviderProfile
      if (formData.role === "provider") {
        await axios.post(
          `${API_URL}/provider-profiles`,
          {
            data: {
              specialty: formData.specialty,
              experience: Number(formData.experience),
              location: formData.location,
              avg_hourly_rate: Number(formData.avg_hourly_rate),
              user: user.id,
            },
          },
          { headers: { Authorization: `Bearer ${jwt}` } },
        );
      }

      navigate("/login");
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
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-1">
          Create Account
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Join thousands of users getting things fixed today.
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
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

          {/* Full Name */}
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

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Provider-only Fields */}
          {formData.role === "provider" && (
            <>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-blue-600 mb-3">
                  Provider Details
                </p>

                {/* Specialty */}
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
                    <option value="technical">HVAC</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Experience */}
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

                {/* Location */}
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

                {/* Hourly Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Average Hourly Rate (NPR)
                  </label>
                  <input
                    type="number"
                    name="avg_hourly_rate"
                    placeholder="e.g. 500"
                    value={formData.avg_hourly_rate}
                    onChange={handleChange}
                    required
                    min={0}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? "Creating Account..." : "Create My Account"}
          </button>
        </form>

        {/* Login Link */}
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
