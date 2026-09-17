import express from 'express';
import { authController } from '../controllers/authController.js';
import { userController } from '../controllers/userController.js';
import { roleController } from '../controllers/roleController.js';
import { getAuditLogs, exportAuditLogs } from '../controllers/auditController.js';
import { getOverviewMetrics } from '../controllers/overviewController.js';
import { schoolManagerAdminController } from '../controllers/schoolManagerAdminController.js';
import { credentialController } from '../controllers/credentialController.js';
import {
  verifyAdminToken,
  requirePermission,
  preventSelfEscalation,
  requireCredentialsAccess,
} from '../middleware/auth.js';
import {
  PERMISSIONS_REGISTRY,
  ALL_PERMISSION_KEYS,
} from '../config/permissionsRegistry.js';

const router = express.Router();

/* =========================================================
 * 1. AUTHENTICATION & INVITATION ACTIVATION
 * ========================================================= */
router.post('/auth/login', authController.login);
router.get('/auth/me', verifyAdminToken, authController.getMe);
router.get('/auth/invitations/verify', authController.verifyInvitation);
router.post('/auth/invitations/activate', authController.activateInvitation);

/* =========================================================
 * 2. PERMISSION REGISTRY
 * ========================================================= */
router.get('/permissions/registry', verifyAdminToken, (req, res) => {
  return res.json({
    success: true,
    registry: PERMISSIONS_REGISTRY,
    flatKeys: ALL_PERMISSION_KEYS,
  });
});

/* =========================================================
 * 3. USER MANAGEMENT (CRUD & INVITATIONS)
 * ========================================================= */
router.get('/users', verifyAdminToken, requirePermission('global.users.view'), userController.listUsers);
router.post(
  '/users',
  verifyAdminToken,
  requirePermission('global.users.create'),
  preventSelfEscalation,
  userController.createUser
);
router.post(
  '/users/invite',
  verifyAdminToken,
  requirePermission('global.users.invite'),
  preventSelfEscalation,
  userController.inviteUser
);
router.get('/users/:id', verifyAdminToken, requirePermission('global.users.view'), userController.getUser);
router.put(
  '/users/:id',
  verifyAdminToken,
  requirePermission('global.users.edit'),
  preventSelfEscalation,
  userController.updateUser
);
router.patch(
  '/users/:id/status',
  verifyAdminToken,
  requirePermission('global.users.edit'),
  preventSelfEscalation,
  userController.updateStatus
);
router.delete(
  '/users/:id',
  verifyAdminToken,
  requirePermission('global.users.delete'),
  preventSelfEscalation,
  userController.deleteUser
);

/* =========================================================
 * 4. ROLE & CAPABILITY MANAGEMENT
 * ========================================================= */
router.get('/roles', verifyAdminToken, requirePermission('global.roles.view'), roleController.listRoles);
router.post(
  '/roles',
  verifyAdminToken,
  requirePermission('global.roles.manage'),
  roleController.createRole
);
router.put(
  '/roles/:id',
  verifyAdminToken,
  requirePermission('global.roles.manage'),
  roleController.updateRole
);
router.delete(
  '/roles/:id',
  verifyAdminToken,
  requirePermission('global.roles.manage'),
  roleController.deleteRole
);

/* =========================================================
 * 5. IMMUTABLE SECURITY AUDIT TRAIL
 * ========================================================= */
router.get('/audit', verifyAdminToken, requirePermission('global.audit.view'), getAuditLogs);
router.get(
  '/audit/export',
  verifyAdminToken,
  requirePermission('global.audit.export'),
  exportAuditLogs
);

/* =========================================================
 * 6. LIVE METRICS & OVERVIEW
 * ========================================================= */
router.get('/overview/metrics', verifyAdminToken, getOverviewMetrics);

/* =========================================================
 * 6.1. RESTRICTED PROJECT CREDENTIALS (AES-256-GCM)
 * Strictly restricted to Superadmin & Full Access Admins
 * ========================================================= */
router.get(
  '/credentials',
  verifyAdminToken,
  requireCredentialsAccess,
  credentialController.listCredentials
);
router.post(
  '/credentials/:id/reveal',
  verifyAdminToken,
  requireCredentialsAccess,
  credentialController.revealCredential
);
router.post(
  '/credentials',
  verifyAdminToken,
  requireCredentialsAccess,
  credentialController.createCredential
);
router.put(
  '/credentials/:id',
  verifyAdminToken,
  requireCredentialsAccess,
  credentialController.updateCredential
);
router.delete(
  '/credentials/:id',
  verifyAdminToken,
  requireCredentialsAccess,
  credentialController.deleteCredential
);

/* =========================================================
 * 7. SCHOOL MANAGER GLOBAL GOVERNANCE MODULE
 * ========================================================= */
router.get(
  '/admin/schoolmanager/health',
  verifyAdminToken,
  schoolManagerAdminController.getHealth
);
router.get(
  '/admin/schoolmanager/overview',
  verifyAdminToken,
  requirePermission('schoolmanager.metrics.view'),
  schoolManagerAdminController.getOverview
);

// School Lifecycle & Directory
router.get(
  '/admin/schoolmanager/schools',
  verifyAdminToken,
  requirePermission('schoolmanager.schools.view'),
  schoolManagerAdminController.listSchools
);
router.get(
  '/admin/schoolmanager/schools/:id',
  verifyAdminToken,
  requirePermission('schoolmanager.schools.view'),
  schoolManagerAdminController.getSchoolDetails
);
router.patch(
  '/admin/schoolmanager/schools/:id/block',
  verifyAdminToken,
  requirePermission('schoolmanager.schools.block'),
  schoolManagerAdminController.blockSchool
);
router.patch(
  '/admin/schoolmanager/schools/:id/reactivate',
  verifyAdminToken,
  requirePermission('schoolmanager.schools.reactivate'),
  schoolManagerAdminController.reactivateSchool
);
router.delete(
  '/admin/schoolmanager/schools/:id',
  verifyAdminToken,
  requirePermission('schoolmanager.schools.delete'),
  schoolManagerAdminController.deleteSchool
);

// Global User Governance
router.get(
  '/admin/schoolmanager/users',
  verifyAdminToken,
  requirePermission('schoolmanager.users.view'),
  schoolManagerAdminController.listUsers
);
router.get(
  '/admin/schoolmanager/users/:id',
  verifyAdminToken,
  requirePermission('schoolmanager.users.view'),
  schoolManagerAdminController.getUserDetails
);
router.patch(
  '/admin/schoolmanager/users/:id/block',
  verifyAdminToken,
  requirePermission('schoolmanager.users.block'),
  schoolManagerAdminController.blockUser
);
router.patch(
  '/admin/schoolmanager/users/:id/reactivate',
  verifyAdminToken,
  requirePermission('schoolmanager.users.reactivate'),
  schoolManagerAdminController.reactivateUser
);
router.post(
  '/admin/schoolmanager/users/:id/reset-password',
  verifyAdminToken,
  requirePermission('schoolmanager.users.reset_password'),
  schoolManagerAdminController.adminResetPassword
);

// Cross-School Activity Stream
router.get(
  '/admin/schoolmanager/activity',
  verifyAdminToken,
  requirePermission('schoolmanager.activity.view'),
  schoolManagerAdminController.listActivity
);

// Secure Deep Link SSO
router.post(
  '/admin/schoolmanager/sso-token',
  verifyAdminToken,
  requirePermission('schoolmanager.schools.view'),
  schoolManagerAdminController.generateSSOLink
);

export default router;

