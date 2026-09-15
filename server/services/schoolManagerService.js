import axios from 'axios';

const SCHOOL_MANAGER_INTEGRATION_URL =
  process.env.SCHOOLMANAGER_INTERNAL_API_URL || 'http://localhost:5001/api/admin-integration';
const SERVICE_KEY =
  process.env.MEGATRIX_SERVICE_SECRET || 'megatrix_core_internal_service_key_2026';

const apiClient = axios.create({
  baseURL: SCHOOL_MANAGER_INTEGRATION_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
    'x-megatrix-service-key': SERVICE_KEY,
  },
});

/**
 * Normalizes error handling for service-to-service calls
 */
const handleServiceError = (error, context = 'School Manager operation') => {
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
    return {
      success: false,
      offline: true,
      statusCode: 503,
      message: 'School Manager service unavailable. Live administrative gateway could not be reached.',
    };
  }

  const statusCode = error.response?.status || 500;
  const message = error.response?.data?.message || error.message || `${context} failed`;
  return {
    success: false,
    offline: false,
    statusCode,
    message,
    details: error.response?.data || null,
  };
};

export const schoolManagerService = {
  // Health
  getHealth: async () => {
    try {
      const res = await apiClient.get('/health');
      return res.data;
    } catch (err) {
      return handleServiceError(err, 'Health check');
    }
  },

  // Overview KPIs
  getOverview: async () => {
    try {
      const res = await apiClient.get('/overview');
      return res.data;
    } catch (err) {
      return handleServiceError(err, 'Get overview');
    }
  },

  // Schools
  listSchools: async (params = {}) => {
    try {
      const res = await apiClient.get('/schools', { params });
      return res.data;
    } catch (err) {
      return handleServiceError(err, 'List schools');
    }
  },

  getSchoolDetails: async (id) => {
    try {
      const res = await apiClient.get(`/schools/${id}`);
      return res.data;
    } catch (err) {
      return handleServiceError(err, 'Get school details');
    }
  },

  blockSchool: async (id, data = {}) => {
    try {
      const res = await apiClient.patch(`/schools/${id}/block`, data);
      return res.data;
    } catch (err) {
      return handleServiceError(err, 'Block school');
    }
  },

  reactivateSchool: async (id, data = {}) => {
    try {
      const res = await apiClient.patch(`/schools/${id}/reactivate`, data);
      return res.data;
    } catch (err) {
      return handleServiceError(err, 'Reactivate school');
    }
  },

  deleteSchool: async (id, data = {}) => {
    try {
      const res = await apiClient.delete(`/schools/${id}`, { data });
      return res.data;
    } catch (err) {
      return handleServiceError(err, 'Delete school');
    }
  },

  // Users
  listUsers: async (params = {}) => {
    try {
      const res = await apiClient.get('/users', { params });
      return res.data;
    } catch (err) {
      return handleServiceError(err, 'List users');
    }
  },

  getUserDetails: async (id, params = {}) => {
    try {
      const res = await apiClient.get(`/users/${id}`, { params });
      return res.data;
    } catch (err) {
      return handleServiceError(err, 'Get user details');
    }
  },

  blockUser: async (id, data = {}) => {
    try {
      const res = await apiClient.patch(`/users/${id}/block`, data);
      return res.data;
    } catch (err) {
      return handleServiceError(err, 'Block user');
    }
  },

  reactivateUser: async (id, data = {}) => {
    try {
      const res = await apiClient.patch(`/users/${id}/reactivate`, data);
      return res.data;
    } catch (err) {
      return handleServiceError(err, 'Reactivate user');
    }
  },

  adminResetPassword: async (id, data = {}) => {
    try {
      const res = await apiClient.post(`/users/${id}/reset-password`, data);
      return res.data;
    } catch (err) {
      return handleServiceError(err, 'Admin reset password');
    }
  },

  // Activity
  listActivity: async (params = {}) => {
    try {
      const res = await apiClient.get('/activity', { params });
      return res.data;
    } catch (err) {
      return handleServiceError(err, 'List activity');
    }
  },

  // SSO Token
  generateSSOLink: async (schoolId) => {
    try {
      const res = await apiClient.post('/sso-token', { schoolId });
      return res.data;
    } catch (err) {
      return handleServiceError(err, 'Generate SSO link');
    }
  },
};

export default schoolManagerService;
