import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Wrong role → redirect to their correct dashboard
  if (allowedRole && user.roleType !== allowedRole) {
    if (user.roleType === "admin") return <Navigate to="/admin" replace />;
    if (user.roleType === "provider")
      return <Navigate to="/providerdashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
