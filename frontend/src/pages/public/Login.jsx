import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/auth/local`, {
        identifier: formData.email,
        password: formData.password,
      });

      const { jwt } = res.data;

      const userRes = await axios.get(
        `${API_URL}/users/me?populate[0]=role&populate[1]=provider_profile&populate[2]=profilePicture`,
        { headers: { Authorization: `Bearer ${jwt}` } },
      );

      const { roleType } = userRes.data;

      login(userRes.data, jwt);

      console.log("userRes.data", userRes.data);
      console.log("role", userRes.data.role);

      if (roleType === "provider") navigate("/providerdashboard");
      else if (roleType === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      const strapiMsg = err.response?.data?.error?.message;

      if (strapiMsg === "Your account has been blocked by an administrator") {
        try {
          const statusRes = await axios.post(
            `${API_URL}/admin-approval/check-status`,
            {
              email: formData.email,
            },
          );
          const { approvalStatus } = statusRes.data;

          if (approvalStatus === "pending") {
            setError(
              "⏳ Your account is pending admin approval. Please check back in 24–48 hours.",
            );
          } else if (approvalStatus === "rejected") {
            setError(
              "❌ Your account has been rejected. Please contact support at support@fixitnow.com.",
            );
          } else {
            setError(
              "🚫 Your account has been blocked. Please contact support at support@fixitnow.com.",
            );
          }
        } catch {
          setError(
            "🚫 Your account has been blocked. Please contact support at support@fixitnow.com.",
          );
        }
        return;
      }

      const msg =
        strapiMsg === "Invalid identifier or password"
          ? "Invalid email or password."
          : strapiMsg || "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-1">Welcome Back</h2>
        <p className="text-gray-500 text-sm mb-6">
          Please enter your details to sign in.
        </p>

        {error && (
          <div
            className={`text-sm px-4 py-3 rounded-lg mb-4 border ${
              error.includes("⏳")
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : error.includes("❌")
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-red-50 text-red-600 border-red-200"
            }`}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 select-none">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 select-none">
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
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? "Signing in..." : "Login to Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
