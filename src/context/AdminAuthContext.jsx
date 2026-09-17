import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../services/adminApi';
import autonomousEngine from '../services/autonomousEngine';
import { PLATFORMS, EXPOSED_PORTALS, getDefaultPlatform, getPlatformById } from '../config/platforms';
import { toast } from 'react-toastify';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('megatrix_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [activePlatform, setActivePlatform] = useState(() => {
    const saved = localStorage.getItem('megatrix_active_platform');
    return saved ? getPlatformById(saved) : getDefaultPlatform();
  });

  const [loading, setLoading] = useState(false);

  // Validate session on mount
  useEffect(() => {
    const verifySession = async () => {
      if (adminUser?.token) {
        // If autonomous local session, keep valid
        if (adminUser.isAutonomous) return;

        try {
          const res = await adminApi.getMe();
          if (res.success && res.user) {
            setAdminUser((prev) => ({
              ...prev,
              ...res.user,
            }));
            localStorage.setItem(
              'megatrix_admin_user',
              JSON.stringify({ ...adminUser, ...res.user })
            );
          }
        } catch (err) {
          // Only clear if server explicitly returned 401 Unauthorized
          if (err.response && err.response.status === 401) {
            setAdminUser(null);
            localStorage.removeItem('megatrix_admin_user');
          } else {
            console.warn('[AdminAuth] Server unreachable on mount, keeping local cached session.');
          }
        }
      }
    };
    verifySession();
  }, []);

  const switchPlatform = (platformId) => {
    const selected = getPlatformById(platformId);
    setActivePlatform(selected);
    localStorage.setItem('megatrix_active_platform', selected.id);
    toast.info(`Switched active portal to ${selected.name}`);
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      // 1. Try Live Express Backend (Port 5002 -> MongoDB Atlas)
      try {
        const res = await adminApi.login(email, password);
        if (res.success && res.user) {
          const sessionPayload = {
            token: res.token,
            ...res.user,
          };

          setAdminUser(sessionPayload);
          localStorage.setItem('megatrix_admin_user', JSON.stringify(sessionPayload));
          toast.success(`Welcome back, ${res.user.name || 'Administrator'}! (Live Gateway)`);
          return { success: true };
        }
      } catch (liveErr) {
        // If network error / connection refused (backend offline), fall back to autonomous engine
        const isNetworkRefused =
          !liveErr.response ||
          liveErr.code === 'ERR_NETWORK' ||
          liveErr.message?.includes('Network Error');

        if (isNetworkRefused) {
          console.warn('[AdminAuth] Live Gateway unreachable, falling back to Autonomous Core...');
          const autoRes = await autonomousEngine.login(email, password);
          if (autoRes.success && autoRes.user) {
            const sessionPayload = {
              token: autoRes.token,
              ...autoRes.user,
              isAutonomous: true,
            };
            setAdminUser(sessionPayload);
            localStorage.setItem('megatrix_admin_user', JSON.stringify(sessionPayload));
            toast.info(`Connected via Autonomous Core (Backend Offline)`);
            return { success: true };
          }
        }
        throw liveErr;
      }

      throw new Error('Authentication failed.');
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Authentication failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('megatrix_admin_user');
    toast.info('Logged out of MegaTrix Admin Core.');
  };

  /**
   * Check if current admin possesses the required permission
   */
  const hasPermission = (permKey) => {
    if (!adminUser) return false;
    if (adminUser.isSuperAdmin || adminUser.accessLevel === 'full') return true;
    const perms = adminUser.effectivePermissions || [];
    if (perms.includes('*')) return true;
    return perms.includes(permKey);
  };

  /**
   * Check if current admin has access to a specific platform
   */
  const canAccessPlatform = (platformId) => {
    if (!adminUser) return false;
    if (adminUser.isSuperAdmin || adminUser.accessLevel === 'full') return true;
    const scopes = adminUser.platformScopes || [];
    if (scopes.includes('global') || scopes.includes(platformId)) return true;
    return false;
  };

  const updateAdminUser = (updatedData) => {
    setAdminUser((prev) => {
      const merged = { ...prev, ...updatedData };
      try {
        localStorage.setItem('megatrix_admin_user', JSON.stringify(merged));
      } catch (e) {
        console.error('[AdminAuth] Failed to sync updated user to localStorage:', e);
      }
      return merged;
    });
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        updateAdminUser,
        activePlatform,
        switchPlatform,
        platforms: EXPOSED_PORTALS,
        allPlatforms: PLATFORMS,
        login,
        logout,
        hasPermission,
        canAccessPlatform,
        isAuthenticated: Boolean(adminUser && adminUser.token && adminUser.status === 'active'),
        loading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
