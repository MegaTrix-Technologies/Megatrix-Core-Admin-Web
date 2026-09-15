import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../services/adminApi';
import { PLATFORMS, getDefaultPlatform, getPlatformById } from '../config/platforms';
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
        } catch {
          // Token expired or invalid
          setAdminUser(null);
          localStorage.removeItem('megatrix_admin_user');
        }
      }
    };
    verifySession();
  }, []);

  const switchPlatform = (platformId) => {
    const selected = getPlatformById(platformId);
    setActivePlatform(selected);
    localStorage.setItem('megatrix_active_platform', platformId);
    toast.info(`Switched active platform to ${selected.name}`);
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await adminApi.login(email, password);
      if (res.success && res.user) {
        const sessionPayload = {
          token: res.token,
          ...res.user,
        };

        setAdminUser(sessionPayload);
        localStorage.setItem('megatrix_admin_user', JSON.stringify(sessionPayload));
        toast.success(`Welcome back, ${res.user.name || 'Administrator'}!`);
        return { success: true };
      }
      throw new Error(res.message || 'Authentication failed.');
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

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        activePlatform,
        switchPlatform,
        platforms: PLATFORMS,
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
