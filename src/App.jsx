import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import AccountActivation from './pages/AccountActivation';
import BizManagerModule from './pages/modules/BizManagerModule';
import SchoolManagerModule from './pages/modules/SchoolManagerModule';
import ProductUserManagement from './pages/ProductUserManagement';
import SettingsPage from './pages/SettingsPage';

// Protected Admin Route Guard
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/50 text-xs font-tech">
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

// Intelligent Root Dispatcher: Renders the active portal's primary dashboard
const ActivePortalDashboard = () => {
  const { activePlatform } = useAdminAuth();
  const isSchoolHub =
    activePlatform?.id === 'schoolhub' ||
    activePlatform?.aliasId === 'schoolhub' ||
    activePlatform?.id === 'schoolmanager';

  return isSchoolHub ? (
    <SchoolManagerModule defaultTab="overview" />
  ) : (
    <BizManagerModule defaultTab="invoices" />
  );
};

function App() {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-black text-white selection:bg-mx-blue selection:text-white">
        <ToastContainer
          position="top-right"
          autoClose={3500}
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
            {/* ─── PUBLIC ROUTES ─── */}
            <Route
              path="/login"
              element={
                <PublicAdminRoute>
                  <AdminLogin />
                </PublicAdminRoute>
              }
            />

            <Route
              path="/activate"
              element={
                <PublicAdminRoute>
                  <AccountActivation />
                </PublicAdminRoute>
              }
            />

            {/* ─── ROOT COMMAND CENTER (DYNAMIC ACTIVE PORTAL) ─── */}
            <Route
              path="/"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <ActivePortalDashboard />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            {/* ─── 1. SCHOOL HUB INTEGRATED SAAS ROUTES ─── */}
            <Route
              path="/schoolhub"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <SchoolManagerModule defaultTab="overview" />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/schoolhub/schools"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <SchoolManagerModule defaultTab="schools" />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/schoolhub/challans"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <SchoolManagerModule defaultTab="plans" />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/schoolhub/users/:subview"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <ProductUserManagement />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/schoolhub/users"
              element={<Navigate to="/schoolhub/users/all" replace />}
            />

            {/* ─── 2. BIZ MANAGER INTEGRATED SAAS ROUTES ─── */}
            <Route
              path="/bizmanager"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <BizManagerModule defaultTab="invoices" />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/bizmanager/stores"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <BizManagerModule defaultTab="stores" />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/bizmanager/invoices"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <BizManagerModule defaultTab="invoices" />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/bizmanager/finance"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <BizManagerModule defaultTab="khata" />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/bizmanager/users/:subview"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <ProductUserManagement />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/bizmanager/users"
              element={<Navigate to="/bizmanager/users/all" replace />}
            />

            {/* ─── 3. GOVERNANCE & SETTINGS (PROFILE, SECURITY, ADMIN USERS) ─── */}
            <Route
              path="/settings"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <SettingsPage />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            {/* ─── LEGACY COMPATIBILITY REDIRECTS (PRESERVES EXISTING ENDPOINTS) ─── */}
            <Route
              path="/modules/schoolmanager"
              element={<Navigate to="/schoolhub" replace />}
            />
            <Route
              path="/modules/bizmanager"
              element={<Navigate to="/bizmanager" replace />}
            />
            <Route
              path="/users"
              element={<Navigate to="/settings?tab=admins" replace />}
            />
            <Route
              path="/roles"
              element={<Navigate to="/settings?tab=admins" replace />}
            />
            <Route
              path="/audit"
              element={<Navigate to="/settings?tab=security" replace />}
            />
            <Route
              path="/platforms"
              element={<Navigate to="/" replace />}
            />
            <Route
              path="/subscriptions"
              element={<Navigate to="/schoolhub/challans" replace />}
            />
            <Route
              path="/services/mailerx"
              element={<Navigate to="/" replace />}
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
