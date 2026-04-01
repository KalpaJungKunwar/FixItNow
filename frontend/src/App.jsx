import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/header";
import Footer from "./components/footer";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Services from "./pages/services";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProviderDashboard from "./pages/providerdashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PendingApproval from "./pages/PendingApproval";

const NO_LAYOUT_ROUTES = ["/providerdashboard", "/admin"];

function Layout({ children }) {
  const location = useLocation();
  const { user } = useAuth();
  const hideLayout = NO_LAYOUT_ROUTES.includes(location.pathname);

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
      <Layout>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute allowedRole="customer">
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pending-approval" element={<PendingApproval />} />

          <Route path="/services" element={
            <ProtectedRoute allowedRole="customer">
              <Services />
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute allowedRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/providerdashboard" element={
            <ProtectedRoute allowedRole="provider">
              <ProviderDashboard />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;