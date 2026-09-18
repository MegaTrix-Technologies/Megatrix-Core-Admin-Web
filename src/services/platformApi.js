import axios from 'axios';

// Resolve backend base URLs (Production defaults with local dev overrides)
const BIZMANAGER_BASE = (import.meta.env.VITE_BIZMANAGER_API_URL || 'https://bizmanager.megatrixai.com')
  .replace(/\/$/, '');

// Ensure SCHOOLHUB_BASE is clean host root without trailing /api so endpoints like /api/admin-integration/... resolve correctly
const configuredSchoolBase = import.meta.env.VITE_SCHOOLMANAGER_API_URL || '';
const rawSchoolBase = (configuredSchoolBase && !configuredSchoolBase.includes('api-core'))
  ? configuredSchoolBase
  : 'https://api-schoolhub.megatrixai.com';
const SCHOOLHUB_BASE = rawSchoolBase.replace(/\/api\/?$/, '').replace(/\/$/, '');
const SERVICE_KEY = import.meta.env.VITE_MEGATRIX_SERVICE_KEY || 'megatrix_core_internal_service_key_2026';

const bizClient = axios.create({
  baseURL: BIZMANAGER_BASE,
  headers: {
    'Content-Type': 'application/json',
    'x-megatrix-service-key': SERVICE_KEY,
  },
  timeout: 8000,
});

const schoolClient = axios.create({
  baseURL: SCHOOLHUB_BASE.replace(/\/$/, ''),
  headers: {
    'Content-Type': 'application/json',
    'x-megatrix-service-key': SERVICE_KEY,
  },
  timeout: 8000,
});

export const platformApi = {
  // ==========================================
  // BizManager Live Endpoints (Port 5000)
  // ==========================================

  async getBizManagerOverview() {
    try {
      const res = await bizClient.get('/api/admin/overview');
      return { success: true, live: true, data: res.data };
    } catch (err) {
      console.warn('[PlatformAPI] BizManager overview offline fallback:', err.message);
      return { success: false, live: false, error: err.message };
    }
  },

  async getBizManagerUsers(params = {}) {
    try {
      const res = await bizClient.get('/api/admin/users', { params });
      return { success: true, live: true, data: res.data };
    } catch (err) {
      console.warn('[PlatformAPI] BizManager users offline fallback:', err.message);
      return { success: false, live: false, error: err.message };
    }
  },

  async toggleBizManagerUserStatus(id, status, reason = 'Administrative update from MegaTrix Admin') {
    try {
      const res = await bizClient.put(`/api/admin/users/${id}/status`, { status, reason });
      return { success: true, live: true, data: res.data };
    } catch (err) {
      console.warn('[PlatformAPI] BizManager toggle user status error:', err.message);
      return { success: false, live: false, error: err.response?.data?.message || err.message };
    }
  },

  async resetBizManagerUserPassword(id, reason = 'Administrative password reset from MegaTrix Admin') {
    try {
      const res = await bizClient.post(`/api/admin/users/${id}/reset-password`, { reason });
      return { success: true, live: true, data: res.data };
    } catch (err) {
      console.warn('[PlatformAPI] BizManager reset password error:', err.message);
      return { success: false, live: false, error: err.response?.data?.message || err.message };
    }
  },

  async updateBizManagerSubscription(id, subData) {
    try {
      const res = await bizClient.put(`/api/admin/users/${id}/subscription`, subData);
      return { success: true, live: true, data: res.data };
    } catch (err) {
      console.warn('[PlatformAPI] BizManager update subscription error:', err.message);
      return { success: false, live: false, error: err.response?.data?.message || err.message };
    }
  },

  async getBizManagerSubscriptionMetrics() {
    try {
      const res = await bizClient.get('/api/admin/subscriptions/metrics');
      return { success: true, live: true, data: res.data };
    } catch (err) {
      console.warn('[PlatformAPI] BizManager subscription metrics offline fallback:', err.message);
      return { success: false, live: false, error: err.message };
    }
  },

  // ==========================================
  // SchoolHub Live Endpoints (Port 5001)
  // ==========================================

  async getSchoolHubOverview() {
    try {
      const res = await schoolClient.get('/api/admin-integration/overview');
      return { success: true, live: true, data: res.data };
    } catch (err) {
      console.warn('[PlatformAPI] SchoolHub overview offline fallback:', err.message);
      return { success: false, live: false, error: err.message };
    }
  },

  async getSchoolHubSchools(params = {}) {
    try {
      const res = await schoolClient.get('/api/admin-integration/schools', { params });
      return { success: true, live: true, data: res.data };
    } catch (err) {
      console.warn('[PlatformAPI] SchoolHub schools offline fallback:', err.message);
      return { success: false, live: false, error: err.message };
    }
  },

  async getSchoolHubUsers(params = {}) {
    try {
      const res = await schoolClient.get('/api/admin-integration/users', { params });
      return { success: true, live: true, data: res.data };
    } catch (err) {
      console.warn('[PlatformAPI] SchoolHub users offline fallback:', err.message);
      return { success: false, live: false, error: err.message };
    }
  },

  async toggleSchoolHubUserBlock(id, isBlocked, role = null) {
    try {
      const endpoint = isBlocked
        ? `/api/admin-integration/users/${id}/block`
        : `/api/admin-integration/users/${id}/reactivate`;
      const res = await schoolClient.patch(endpoint, {
        role,
        actorName: 'MegaTrix Core Admin',
        actorEmail: 'admin@megatrixai.com',
      });
      return { success: true, live: true, data: res.data };
    } catch (err) {
      console.warn('[PlatformAPI] SchoolHub toggle user block error:', err.message);
      return { success: false, live: false, error: err.response?.data?.message || err.message };
    }
  },

  async resetSchoolHubUserPassword(id, role = null, reason = 'Administrative password reset from MegaTrix Admin') {
    try {
      const res = await schoolClient.post(`/api/admin-integration/users/${id}/reset-password`, {
        role,
        reason,
        actorName: 'MegaTrix Core Admin',
        actorEmail: 'admin@megatrixai.com',
      });
      return { success: true, live: true, data: res.data };
    } catch (err) {
      console.warn('[PlatformAPI] SchoolHub reset password error:', err.message);
      return { success: false, live: false, error: err.response?.data?.message || err.message };
    }
  },

  async toggleSchoolHubSchoolBlock(id, isBlocked, reason = 'Administrative block from MegaTrix Admin') {
    try {
      const endpoint = isBlocked
        ? `/api/admin-integration/schools/${id}/block`
        : `/api/admin-integration/schools/${id}/reactivate`;
      const payload = isBlocked
        ? { reason, actorName: 'MegaTrix Core Admin', actorEmail: 'admin@megatrixai.com' }
        : { actorName: 'MegaTrix Core Admin', actorEmail: 'admin@megatrixai.com' };
      const res = await schoolClient.patch(endpoint, payload);
      return { success: true, live: true, data: res.data };
    } catch (err) {
      console.warn('[PlatformAPI] SchoolHub toggle school block error:', err.message);
      return { success: false, live: false, error: err.response?.data?.message || err.message };
    }
  },
};

export default platformApi;
