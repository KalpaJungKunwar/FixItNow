import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isCustomer = user?.roleType === "customer";
  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    relative py-1 text-sm font-medium transition-all duration-300 select-none
    ${isActive(path) ? "text-blue-600" : "text-slate-600 hover:text-blue-600"}
    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] 
    after:w-full after:bg-blue-600 after:scale-x-0 after:transition-transform 
    ${isActive(path) ? "after:scale-x-100" : "hover:after:scale-x-100"}
  `;

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-full w-full pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -bottom-10 left-1/4 w-32 h-32 rounded-full bg-indigo-100/40 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center space-x-2 group select-none">
     
          <span className="text-2xl font-bold tracking-tight text-slate-800">
            Fixit<span className="text-blue-600">Now</span>
          </span>
        </Link>

        <nav className="flex items-center select-none">
          <div className="hidden md:flex items-center space-x-8">
            {isCustomer ? (
              <>
                <Link to="/" className={navLinkClass("/")}>
                  Home
                </Link>
                <Link to="/services" className={navLinkClass("/services")}>
                  Services
                </Link>
                <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                  Bookings
                </Link>
                <Link to="/profile" className={navLinkClass("/profile")}>
                  Profile
                </Link>
              </>
            ) : (
              !user && (
                <>
                  <Link to="/" className={navLinkClass("/")}>
                    Home
                  </Link>
                  <Link
                    to="/login"
                    className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 shadow-md shadow-blue-100"
                  >
                    Get Started
                  </Link>
                </>
              )
            )}
          </div>
          
          {user && (
            <div className="flex items-center pl-4 border-l border-slate-200 ml-4">
              <button
                onClick={handleLogout}
                className="group flex items-center space-x-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              >
                <span>Logout</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
