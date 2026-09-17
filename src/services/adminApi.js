import axios from 'axios';

const ADMIN_API_BASE = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5002/api';

const apiClient = axios.create({
  baseURL: ADMIN_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('megatrix_admin_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch (e) {
      console.error('[AdminAPI] Failed to parse admin user token from localStorage:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isLoginPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/activate');
      if (!isLoginPage) {
        localStorage.removeItem('megatrix_admin_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  // Generic HTTP Wrappers
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),

  // 1. Authentication & Invitations
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  verifyInvitation: async (token) => {
    const res = await apiClient.get(`/auth/invitations/verify?token=${encodeURIComponent(token)}`);
    return res.data;
  },

  activateInvitation: async ({ token, password, confirmPassword }) => {
    const res = await apiClient.post('/auth/invitations/activate', {
      token,
      password,
      confirmPassword,
    });
    return res.data;
  },

  // 2. Overview Metrics & Live Database Statistics
  getOverview: async () => {
    const res = await apiClient.get('/overview/metrics');
    return res.data;
  },

  // 3. User Management
  getUsers: async (params = {}) => {
    const res = await apiClient.get('/users', { params });
    return res.data;
  },

  getUser: async (id) => {
    const res = await apiClient.get(`/users/${id}`);
    return res.data;
  },

  createUser: async (userData) => {
    const res = await apiClient.post('/users', userData);
    return res.data;
  },

  inviteUser: async (invitationData) => {
    const res = await apiClient.post('/users/invite', invitationData);
    return res.data;
  },

  updateUser: async (id, userData) => {
    const res = await apiClient.put(`/users/${id}`, userData);
    return res.data;
  },

  toggleUserStatus: async (id, status, reason = '') => {
    const res = await apiClient.patch(`/users/${id}/status`, { status, reason });
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await apiClient.delete(`/users/${id}`);
    return res.data;
  },

  // 4. Role & Permissions Management
  getRoles: async () => {
    const res = await apiClient.get('/roles');
    return res.data;
  },

  createRole: async (roleData) => {
    const res = await apiClient.post('/roles', roleData);
    return res.data;
  },

  updateRole: async (id, roleData) => {
    const res = await apiClient.put(`/roles/${id}`, roleData);
    return res.data;
  },

  deleteRole: async (id) => {
    const res = await apiClient.delete(`/roles/${id}`);
    return res.data;
  },

  getPermissionsRegistry: async () => {
    const res = await apiClient.get('/permissions/registry');
    return res.data;
  },

  // 5. Immutable Security Audit Trail
  getAuditLogs: async (params = {}) => {
    const res = await apiClient.get('/audit', { params });
    return res.data;
  },

  exportAuditLogs: async (params = {}) => {
    const res = await apiClient.get('/audit/export', { params });
    return res.data;
  },

  // 6. School Manager First-Class Governance Suite
  getSchoolManagerHealth: async () => {
    try {
      const res = await apiClient.get('/admin/schoolmanager/health');
      return res.data;
    } catch (err) {
      return { success: false, offline: true, message: err.response?.data?.message || err.message };
    }
  },

  getSchoolManagerOverview: async () => {
    const res = await apiClient.get('/admin/schoolmanager/overview');
    return res.data;
  },

  getSchoolManagerSchools: async (params = {}) => {
    const res = await apiClient.get('/admin/schoolmanager/schools', { params });
    return res.data;
  },

  getSchoolManagerSchool: async (id) => {
    const res = await apiClient.get(`/admin/schoolmanager/schools/${id}`);
    return res.data;
  },

  blockSchool: async (id, reason) => {
    const res = await apiClient.patch(`/admin/schoolmanager/schools/${id}/block`, { reason });
    return res.data;
  },

  reactivateSchool: async (id) => {
    const res = await apiClient.patch(`/admin/schoolmanager/schools/${id}/reactivate`);
    return res.data;
  },

  deleteSchool: async (id, confirmationName) => {
    const res = await apiClient.delete(`/admin/schoolmanager/schools/${id}`, {
      data: { confirmationName },
    });
    return res.data;
  },

  getSchoolManagerUsers: async (params = {}) => {
    const res = await apiClient.get('/admin/schoolmanager/users', { params });
    return res.data;
  },

  getSchoolManagerUser: async (id, params = {}) => {
    const res = await apiClient.get(`/admin/schoolmanager/users/${id}`, { params });
    return res.data;
  },

  blockSchoolUser: async (id, role, reason) => {
    const res = await apiClient.patch(`/admin/schoolmanager/users/${id}/block`, { role, reason });
    return res.data;
  },

  reactivateSchoolUser: async (id, role) => {
    const res = await apiClient.patch(`/admin/schoolmanager/users/${id}/reactivate`, { role });
    return res.data;
  },

  adminResetPassword: async (id, role, reason) => {
    const res = await apiClient.post(`/admin/schoolmanager/users/${id}/reset-password`, { role, reason });
    return res.data;
  },

  getSchoolManagerActivity: async (params = {}) => {
    const res = await apiClient.get('/admin/schoolmanager/activity', { params });
    return res.data;
  },

  generateSchoolSSO: async (schoolId) => {
    const res = await apiClient.post('/admin/schoolmanager/sso-token', { schoolId });
    return res.data;
  },

  // 7. External Platform Module Proxies & Health
  getBizManagerSummary: async () => {
    try {
      const url = `${import.meta.env.VITE_BIZMANAGER_API_URL || 'https://bizmanager.megatrixai.com'}/api/admin/overview`;
      const res = await axios.get(url, { timeout: 3000 });
      return { online: true, data: res.data };
    } catch {
      return { online: false, data: null };
    }
  },

  getSchoolManagerSummary: async () => {
    try {
      const res = await apiClient.get('/admin/schoolmanager/health');
      return { online: res.data?.status === 'operational' || res.data?.success, data: res.data };
    } catch {
      return { online: false, data: null };
    }
  },

  getMailerXTelemetry: async () => {
    return {
      online: true,
      service: 'Brevo Direct SMTP Relay',
      host: import.meta.env.VITE_BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
      port: import.meta.env.VITE_BREVO_SMTP_PORT || 587,
      account: import.meta.env.VITE_BREVO_SMTP_USER || 'b6117c001@smtp-brevo.com',
    };
  },

  // 8. Restricted Project Credentials (AES-256-GCM)
  getCredentials: async (params = {}) => {
    const res = await apiClient.get('/credentials', { params });
    return res.data;
  },

  revealCredential: async (id) => {
    const res = await apiClient.post(`/credentials/${id}/reveal`);
    return res.data;
  },

  createCredential: async (data) => {
    const res = await apiClient.post('/credentials', data);
    return res.data;
  },

  updateCredential: async (id, data) => {
    const res = await apiClient.put(`/credentials/${id}`, data);
    return res.data;
  },

  deleteCredential: async (id) => {
    const res = await apiClient.delete(`/credentials/${id}`);
    return res.data;
  },

  // 9. Account Impersonation (Spoof) Engine
  initiateSpoof: async ({ platform, targetUserId, reason }) => {
    const res = await apiClient.post('/spoof/initiate', { platform, targetUserId, reason });
    return res.data;
  },

  terminateSpoof: async ({ spoofSessionId, platform, targetUserId }) => {
    const res = await apiClient.post('/spoof/terminate', { spoofSessionId, platform, targetUserId });
    return res.data;
  },

  // Gateway mode helpers for UI compatibility
  getMode: () => 'live',
  setMode: () => {},
  checkLiveGateway: async () => ({ online: true }),
};

export default adminApi;
