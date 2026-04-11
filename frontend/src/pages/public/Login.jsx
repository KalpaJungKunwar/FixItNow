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
        `${API_URL}/users/me?populate[0]=role&populate[1]=provider_profile`,
        { headers: { Authorization: `Bearer ${jwt}` } },
      );

      login(userRes.data, jwt);

      const roleType = userRes.data.roleType;
      if (roleType === "provider") navigate("/providerdashboard");
      else if (roleType === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.error?.message || "Invalid email or password.";

      if (msg.toLowerCase().includes("pending")) {
        setError(
          "⏳ Your account is pending admin approval. Please check back in 24–48 hours.",
        );
      } else if (msg.toLowerCase().includes("rejected")) {
        setError(
          "❌ Your account has been rejected. Please contact support at support@fixitnow.com.",
        );
      } else {
        setError(msg);
      }
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
