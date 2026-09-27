import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

// Public
import Landing from "./pages/public/Landing";
import Booking from "./pages/public/Booking";
import Tracking from "./pages/public/Tracking";
import SubmitTestimonial from "./pages/public/SubmitTestimonial";

// Staff
import Login from "./pages/staff/Login";
import Dashboard from "./pages/staff/Dashboard";
import NewOrder from "./pages/staff/NewOrder";
import Orders from "./pages/staff/Orders";
import Customers from "./pages/staff/Customers";
import Delivery from "./pages/staff/Delivery";
import Reports from "./pages/staff/Reports";
import Testimonials from "./pages/staff/Testimonials";
import QRCodePage from "./pages/staff/QRCode";

function StaffLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ============ PUBLIC ============ */}
          <Route path="/" element={<Landing />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/track" element={<Tracking />} />
          <Route path="/track/:code" element={<Tracking />} />
          <Route path="/testimoni" element={<SubmitTestimonial />} />

          {/* ============ STAFF ============ */}
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StaffLayout>
                  <Dashboard />
                </StaffLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/new"
            element={
              <ProtectedRoute roles={["owner", "staff"]}>
                <StaffLayout>
                  <NewOrder />
                </StaffLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <StaffLayout>
                  <Orders />
                </StaffLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute roles={["owner", "staff"]}>
                <StaffLayout>
                  <Customers />
                </StaffLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/delivery"
            element={
              <ProtectedRoute roles={["owner", "staff"]}>
                <StaffLayout>
                  <Delivery />
                </StaffLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/testimonials"
            element={
              <ProtectedRoute roles={["owner", "staff"]}>
                <StaffLayout>
                  <Testimonials />
                </StaffLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/qr"
            element={
              <ProtectedRoute roles={["owner", "staff"]}>
                <StaffLayout>
                  <QRCodePage />
                </StaffLayout>
              </ProtectedRoute>
            }
          />

          {/* ============ OWNER ONLY ============ */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute roles={["owner"]}>
                <StaffLayout>
                  <Reports />
                </StaffLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}