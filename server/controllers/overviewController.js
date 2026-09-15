import { AdminUser } from '../models/AdminUser.js';
import { Role } from '../models/Role.js';
import { Invitation } from '../models/Invitation.js';
import { AuditLog } from '../models/AuditLog.js';
import { schoolManagerService } from '../services/schoolManagerService.js';

export const getOverviewMetrics = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      invitedUsers,
      suspendedUsers,
      totalRoles,
      pendingInvitations,
      recentAuditLogs,
    ] = await Promise.all([
      AdminUser.countDocuments({ status: { $ne: 'deleted' } }),
      AdminUser.countDocuments({ status: 'active' }),
      AdminUser.countDocuments({ status: 'invited' }),
      AdminUser.countDocuments({ status: 'suspended' }),
      Role.countDocuments(),
      Invitation.countDocuments({ status: 'pending', expiresAt: { $gt: new Date() } }),
      AuditLog.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    // Platform user access counts
    const [bizManagerUsers, schoolManagerUsers, mailerXUsers, fullAccessUsers] = await Promise.all([
      AdminUser.countDocuments({
        status: { $ne: 'deleted' },
        $or: [{ accessLevel: 'full' }, { platformAccess: 'bizmanager' }],
      }),
      AdminUser.countDocuments({
        status: { $ne: 'deleted' },
        $or: [{ accessLevel: 'full' }, { platformAccess: 'schoolmanager' }],
      }),
      AdminUser.countDocuments({
        status: { $ne: 'deleted' },
        $or: [{ accessLevel: 'full' }, { platformAccess: 'mailerx' }],
      }),
      AdminUser.countDocuments({
        status: { $ne: 'deleted' },
        accessLevel: 'full',
      }),
    ]);

    // Live cross-platform telemetry for School Manager
    let schoolManagerTelemetry = { online: false, data: null };
    try {
      const smRes = await schoolManagerService.getOverview();
      if (smRes && smRes.success) {
        schoolManagerTelemetry = { online: true, ...smRes.metrics };
      }
    } catch {
      schoolManagerTelemetry = { online: false, data: null };
    }

    return res.json({
      success: true,
      metrics: {
        users: {
          total: totalUsers,
          active: activeUsers,
          invited: invitedUsers,
          suspended: suspendedUsers,
        },
        roles: {
          total: totalRoles,
        },
        invitations: {
          pending: pendingInvitations,
        },
        platforms: {
          fullAccess: fullAccessUsers,
          bizmanager: bizManagerUsers,
          schoolmanager: schoolManagerUsers,
          mailerx: mailerXUsers,
        },
        schoolManager: schoolManagerTelemetry,
      },
      recentActivity: recentAuditLogs,
    });
  } catch (error) {
    console.error('getOverviewMetrics error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve overview metrics' });
  }
};
