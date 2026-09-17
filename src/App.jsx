import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import AccountActivation from './pages/AccountActivation';
import PlatformDashboard from './pages/PlatformDashboard';
import GlobalUserManagement from './pages/GlobalUserManagement';
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
    return <Navigate to="/dashboard" replace />;
  }
  return children;
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
            {/* ─── PUBLIC AUTHENTICATION ROUTES ─── */}
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
              element={<AccountActivation />}
            />

            {/* ─── 1. PLATFORM EXECUTIVE DASHBOARD ─── */}
            <Route
              path="/"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <PlatformDashboard />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <PlatformDashboard />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            {/* ─── 2. GLOBAL USER MANAGEMENT ─── */}
            <Route
              path="/users"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <GlobalUserManagement />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            {/* ─── 3. SCHOOL HUB PROJECT WORKSPACE ─── */}
            <Route
              path="/projects/school-hub"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <SchoolManagerModule defaultTab="users" />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            {/* Alias /schoolhub */}
            <Route
              path="/schoolhub"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <SchoolManagerModule defaultTab="users" />
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
              path="/projects/school-hub/users/:subview"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <ProductUserManagement />
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
              element={<Navigate to="/projects/school-hub" replace />}
            />

            {/* ─── 4. BIZ MANAGER PROJECT WORKSPACE ─── */}
            <Route
              path="/projects/biz-manager"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <BizManagerModule defaultTab="users" />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            {/* Alias /bizmanager */}
            <Route
              path="/bizmanager"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <BizManagerModule defaultTab="users" />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/bizmanager/stores"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <BizManagerModule defaultTab="stock" />
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
              path="/projects/biz-manager/users/:subview"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <ProductUserManagement />
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
              element={<Navigate to="/projects/biz-manager" replace />}
            />

            {/* ─── 5. GOVERNANCE & SETTINGS ─── */}
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

            {/* ─── 6. LEGACY COMPATIBILITY REDIRECTS ─── */}
            <Route
              path="/modules/schoolmanager"
              element={<Navigate to="/projects/school-hub" replace />}
            />
            <Route
              path="/modules/bizmanager"
              element={<Navigate to="/projects/biz-manager" replace />}
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
              path="/platforms/bizmanager"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <BizManagerModule defaultTab="users" />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/platforms/schoolhub"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <SchoolManagerModule defaultTab="users" />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/platforms"
              element={<Navigate to="/dashboard" replace />}
            />
            <Route
              path="/subscriptions"
              element={<Navigate to="/projects/school-hub" replace />}
            />
            <Route
              path="/services/mailerx"
              element={<Navigate to="/dashboard" replace />}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </div>
    </AdminAuthProvider>
  );
}

export default App;
