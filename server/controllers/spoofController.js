import crypto from 'crypto';
import axios from 'axios';
import { AuditLog } from '../models/AuditLog.js';

export const initiate = async (req, res) => {
  try {
    const { platform, targetUserId, reason } = req.body;

    if (!reason || reason.length < 10) {
      return res.status(400).json({ error: 'Reason is required and must be at least 10 characters long.' });
    }

    if (platform !== 'bizmanager' && platform !== 'schoolmanager') {
      return res.status(400).json({ error: 'Invalid platform.' });
    }

    if (!req.user.isSuperAdmin && req.user.accessLevel !== 'full') {
      return res.status(403).json({ error: 'Insufficient permissions to initiate spoofing.' });
    }

    const spoofSessionId = crypto.randomBytes(32).toString('hex');
    let targetApiUrl;

    if (platform === 'bizmanager') {
      targetApiUrl = process.env.BIZMANAGER_API_URL || 'http://localhost:5000';
    } else {
      targetApiUrl = process.env.SCHOOL_MANAGER_API_URL || 'http://localhost:5001';
    }

    const serviceKey = process.env.MEGATRIX_SERVICE_SECRET || 'megatrix_core_internal_service_key_2026';

    const response = await axios.post(
      `${targetApiUrl}/api/admin-integration/impersonate`,
      {
        targetUserId,
        adminActorId: req.user._id,
        adminEmail: req.user.email,
        spoofSessionId
      },
      {
        headers: {
          'x-megatrix-service-key': serviceKey
        }
      }
    );

    const auditLog = new AuditLog({
      actor: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role || 'admin'
      },
      action: 'IMPERSONATION_STARTED',
      target: {
        id: targetUserId,
        type: 'USER',
        name: response.data.userInfo?.name,
        email: response.data.userInfo?.email
      },
      platform,
      details: {
        reason,
        spoofSessionId,
        handoffUrl: response.data.portalUrl
      },
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    await auditLog.save();

    return res.json({
      success: true,
      spoofSessionId,
      handoffUrl: response.data.portalUrl,
      targetUser: response.data.userInfo
    });
  } catch (error) {
    console.error('Spoof initiation error:', error.message);
    return res.status(500).json({ error: 'Failed to initiate impersonation session. Target platform may be offline or returned an error.' });
  }
};

export const terminate = async (req, res) => {
  try {
    const { spoofSessionId, platform, targetUserId } = req.body;

    const auditLog = new AuditLog({
      actor: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role || 'admin'
      },
      action: 'IMPERSONATION_ENDED',
      target: {
        id: targetUserId,
        type: 'USER',
        name: 'Unknown', // we don't have this in terminate request body natively
        email: 'Unknown'
      },
      platform,
      details: {
        spoofSessionId,
        endedBy: 'admin_manual'
      },
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    await auditLog.save();

    return res.json({
      success: true,
      message: 'Impersonation session terminated.'
    });
  } catch (error) {
    console.error('Spoof termination error:', error.message);
    return res.status(500).json({ error: 'Failed to terminate impersonation session.' });
  }
};
