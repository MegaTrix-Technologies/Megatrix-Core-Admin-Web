import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import AccountActivation from './pages/AccountActivation';
import DashboardOverview from './pages/DashboardOverview';
import UserManagement from './pages/UserManagement';
import RolesManagement from './pages/RolesManagement';
import AuditLogViewer from './pages/AuditLogViewer';
import SubscriptionManagement from './pages/SubscriptionManagement';
import PlatformRegistry from './pages/PlatformRegistry';
import BizManagerModule from './pages/modules/BizManagerModule';
import SchoolManagerModule from './pages/modules/SchoolManagerModule';
import MailerXModule from './pages/services/MailerXModule';

// Protected Admin Route Guard
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/50 text-xs">
        Authenticating session...
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route (redirect to dashboard if already logged in)
const PublicAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  if (loading) return null;
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Public Login Route */}
            <Route
              path="/login"
              element={
                <PublicAdminRoute>
                  <AdminLogin />
                </PublicAdminRoute>
              }
            />

            {/* Public Account Activation Route for Invited Users */}
            <Route
              path="/activate"
              element={
                <PublicAdminRoute>
                  <AccountActivation />
                </PublicAdminRoute>
              }
            />

            {/* Protected SuperAdmin Dashboard Routes */}
            <Route
              path="/"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <DashboardOverview />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <UserManagement />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/roles"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <RolesManagement />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/audit"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AuditLogViewer />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/subscriptions"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <SubscriptionManagement />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/platforms"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <PlatformRegistry />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/modules/bizmanager"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <BizManagerModule />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/modules/schoolmanager"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <SchoolManagerModule />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/services/mailerx"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <MailerXModule />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </AdminAuthProvider>
  );
}

export default App;
