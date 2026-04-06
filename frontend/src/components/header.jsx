import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isProvider = user?.roleType === "provider";
  const isCustomer = user?.roleType === "customer";

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-semibold text-blue-500">
          FixitNow
        </Link>

        <nav className="flex items-center space-x-6 text-sm text-gray-600">
          {isCustomer && (
            <>
              <Link to="/" className="hover:text-gray-900">
                Home
              </Link>
              <Link to="/services" className="hover:text-gray-900">
                Services
              </Link>

              <Link to="/profile" className="hover:text-gray-900">
                Profile
              </Link>

              <Link to="/dashboard" className="hover:text-gray-900">
                My Bookings
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="hover:text-gray-900">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2 text-white"
              >
                Sign Up
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                👤 {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
