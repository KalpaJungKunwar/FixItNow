import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/public/Login";
import Home from "./pages/public/Home";
import Register from "./pages/public/Register";
import PendingApproval from "./pages/public/PendingApproval";
import Services from "./pages/customer/Services";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerProfile from "./pages/customer/CustomerProfile";
import ProviderDashboard from "./pages/serviceProvider/ProviderDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailed from "./pages/payment/PaymentFailed";
import ProtectedRoute, { PublicOnlyRoute } from "./routes/ProtectedRoute";

const NO_LAYOUT_ROUTES = ["/providerdashboard", "/admin"];

function Layout({ children }) {
  const location = useLocation();
  const { user } = useAuth();
  const hideLayout = NO_LAYOUT_ROUTES.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header />}
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
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
