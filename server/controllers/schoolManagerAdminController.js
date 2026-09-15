import { schoolManagerService } from '../services/schoolManagerService.js';
import { AuditLog } from '../models/AuditLog.js';

// Helper to record immutable audit trail
const recordAudit = async (req, action, target, details = {}) => {
  try {
    await AuditLog.create({
      actor: {
        id: req.user?._id || null,
        name: req.user?.name || 'System Admin',
        email: req.user?.email || 'admin@megatrix.internal',
        role: req.user?.isSuperAdmin ? 'SUPERADMIN' : (req.user?.accessLevel?.toUpperCase() || 'ADMIN'),
      },
      action,
      target: {
        id: target.id || null,
        type: target.type || 'RESOURCE',
        name: target.name || '',
        email: target.email || '',
      },
      platform: 'schoolmanager',
      details,
      ipAddress: req.ip || req.connection?.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'MegaTrix Core',
    });
  } catch (err) {
    console.error('[AuditLog Error]: Failed to create audit log for schoolmanager:', err.message);
  }
};

export const schoolManagerAdminController = {
  // 1. Health
  getHealth: async (req, res) => {
    const result = await schoolManagerService.getHealth();
    return res.status(result.statusCode || (result.success ? 200 : 503)).json(result);
  },

  // 2. Overview Metrics
  getOverview: async (req, res) => {
    const result = await schoolManagerService.getOverview();
    return res.status(result.statusCode || (result.success ? 200 : 500)).json(result);
  },

  // 3. Schools
  listSchools: async (req, res) => {
    const result = await schoolManagerService.listSchools(req.query);
    return res.status(result.statusCode || (result.success ? 200 : 500)).json(result);
  },

  getSchoolDetails: async (req, res) => {
    const { id } = req.params;
    const result = await schoolManagerService.getSchoolDetails(id);

    if (result.success && result.school) {
      await recordAudit(req, 'SCHOOL_VIEWED', {
        id: result.school._id,
        name: result.school.name,
        type: 'SCHOOL',
      }, { code: result.school.code });
    }

    return res.status(result.statusCode || (result.success ? 200 : 500)).json(result);
  },

  blockSchool: async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A specific reason is required to block a school tenant.',
      });
    }

    const payload = {
      reason: reason.trim(),
      actorName: req.user?.name || 'Administrator',
      actorEmail: req.user?.email || 'admin@megatrix.internal',
    };

    const result = await schoolManagerService.blockSchool(id, payload);

    if (result.success) {
      await recordAudit(req, 'SCHOOL_BLOCKED', {
        id,
        name: result.school?.name || 'School Tenant',
        type: 'SCHOOL',
      }, {
        reason: reason.trim(),
        code: result.school?.code,
      });
    }

    return res.status(result.statusCode || (result.success ? 200 : 500)).json(result);
  },

  reactivateSchool: async (req, res) => {
    const { id } = req.params;
    const payload = {
      actorName: req.user?.name || 'Administrator',
      actorEmail: req.user?.email || 'admin@megatrix.internal',
    };

    const result = await schoolManagerService.reactivateSchool(id, payload);

    if (result.success) {
      await recordAudit(req, 'SCHOOL_REACTIVATED', {
        id,
        name: result.school?.name || 'School Tenant',
        type: 'SCHOOL',
      }, {
        code: result.school?.code,
      });
    }

    return res.status(result.statusCode || (result.success ? 200 : 500)).json(result);
  },

  deleteSchool: async (req, res) => {
    const { id } = req.params;
    const { confirmationName } = req.body;

    // Strict SuperAdmin enforcement for destructive delete
    if (!req.user?.isSuperAdmin && req.user?.accessLevel !== 'full') {
      return res.status(403).json({
        success: false,
        message: 'Permanent deletion of an educational institution requires Superadmin authority.',
      });
    }

    if (!confirmationName) {
      return res.status(400).json({
        success: false,
        message: 'Confirmation school name is required to execute permanent tenant deletion.',
      });
    }

    const payload = {
      confirmationName,
      actorName: req.user?.name,
      actorEmail: req.user?.email,
      isSuperAdmin: true,
    };

    const result = await schoolManagerService.deleteSchool(id, payload);

    if (result.success) {
      await recordAudit(req, 'SCHOOL_DELETED', {
        id,
        name: confirmationName,
        type: 'SCHOOL',
      }, {
        note: 'Permanently removed school and tenant records',
        confirmedBy: req.user?.email,
      });
    }

    return res.status(result.statusCode || (result.success ? 200 : 500)).json(result);
  },

  // 4. Users
  listUsers: async (req, res) => {
    const result = await schoolManagerService.listUsers(req.query);
    return res.status(result.statusCode || (result.success ? 200 : 500)).json(result);
  },

  getUserDetails: async (req, res) => {
    const { id } = req.params;
    const result = await schoolManagerService.getUserDetails(id, req.query);

    if (result.success && result.user) {
      await recordAudit(req, 'USER_VIEWED', {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        type: 'USER',
      }, { role: result.user.role });
    }

    return res.status(result.statusCode || (result.success ? 200 : 500)).json(result);
  },

  blockUser: async (req, res) => {
    const { id } = req.params;
    const { role, reason } = req.body;

    const payload = {
      role,
      reason: reason || 'Administrative suspension',
      actorName: req.user?.name,
      actorEmail: req.user?.email,
    };

    const result = await schoolManagerService.blockUser(id, payload);

    if (result.success) {
      await recordAudit(req, 'USER_BLOCKED', {
        id,
        type: 'USER',
      }, { role, reason: payload.reason });
    }

    return res.status(result.statusCode || (result.success ? 200 : 500)).json(result);
  },

  reactivateUser: async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    const payload = {
      role,
      actorName: req.user?.name,
      actorEmail: req.user?.email,
    };

    const result = await schoolManagerService.reactivateUser(id, payload);

    if (result.success) {
      await recordAudit(req, 'USER_REACTIVATED', {
        id,
        type: 'USER',
      }, { role });
    }

    return res.status(result.statusCode || (result.success ? 200 : 500)).json(result);
  },

  adminResetPassword: async (req, res) => {
    const { id } = req.params;
    const { role, reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A valid administrative reason is required to perform an email-less password reset.',
      });
    }

    const payload = {
      role,
      reason: reason.trim(),
      actorName: req.user?.name,
      actorEmail: req.user?.email,
    };

    const result = await schoolManagerService.adminResetPassword(id, payload);

    if (result.success) {
      // Audit the sensitive operation — NEVER record temporaryPassword in AuditLog!
      await recordAudit(req, 'USER_ADMIN_PASSWORD_RESET', {
        id,
        name: result.userName || '',
        email: result.userEmail || '',
        type: 'USER',
      }, {
        reason: reason.trim(),
        role: result.role,
        forcedRenewal: true,
      });
    }

    return res.status(result.statusCode || (result.success ? 200 : 500)).json(result);
  },

  // 5. Activity
  listActivity: async (req, res) => {
    const result = await schoolManagerService.listActivity(req.query);
    return res.status(result.statusCode || (result.success ? 200 : 500)).json(result);
  },

  // 6. Deep Link SSO
  generateSSOLink: async (req, res) => {
    const { schoolId } = req.body;
    const result = await schoolManagerService.generateSSOLink(schoolId);
    return res.status(result.statusCode || (result.success ? 200 : 500)).json(result);
  },
};

export default schoolManagerAdminController;
