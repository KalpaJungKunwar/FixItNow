import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isCustomer = user?.roleType === "customer";

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
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
              <Link to="/dashboard" className="hover:text-gray-900">
                My Bookings
              </Link>
              <Link to="/profile" className="hover:text-gray-900">
                Profile
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link to="/" className="hover:text-gray-900">
                Home
              </Link>
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
