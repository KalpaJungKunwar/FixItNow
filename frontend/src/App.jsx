import { useState, useCallback } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/header";
import Footer from "./components/footer";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/public/Login";
import Home from "./pages/public/Home";
import Register from "./pages/public/Register";
import PendingApproval from "./pages/public/PendingApproval";
import Services from "./pages/customer/services";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerProfile from "./pages/customer/CustomerProfile";
import ProviderDashboard from "./pages/serviceProvider/providerdashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailed from "./pages/payment/PaymentFailed";
import ProtectedRoute, { PublicOnlyRoute } from "./routes/ProtectedRoute";

const NO_LAYOUT_ROUTES = ["/providerdashboard", "/admin"];

function Layout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const hideLayout = NO_LAYOUT_ROUTES.includes(location.pathname);

  const handleLogout = useCallback(() => {
    setShowWarning(false);
    logout();
    navigate("/");
  }, [logout, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header isLoggedIn={!!user} />}
      <main className="flex-grow">{children}</main>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/pending-approval"
            element={
              <PublicOnlyRoute>
                <PendingApproval />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/services"
            element={
              <ProtectedRoute allowedRole="customer">
                <Services />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRole="customer">
                <CustomerProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/providerdashboard"
            element={
              <ProtectedRoute allowedRole="provider">
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
          <Route path="/payment/verify" element={<PaymentSuccess />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
