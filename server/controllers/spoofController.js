import crypto from 'crypto';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { AuditLog } from '../models/AuditLog.js';

export const initiate = async (req, res) => {
  try {
    const { platform, targetUserId, reason, targetUserName, targetUserEmail } = req.body;

    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({ error: 'Reason is required and must be at least 10 characters long.' });
    }

    if (platform !== 'bizmanager' && platform !== 'schoolmanager' && platform !== 'schoolhub') {
      return res.status(400).json({ error: 'Invalid platform.' });
    }

    if (!req.user.isSuperAdmin && req.user.accessLevel !== 'full') {
      return res.status(403).json({ error: 'Insufficient permissions to initiate spoofing.' });
    }

    const spoofSessionId = crypto.randomBytes(32).toString('hex');
    let handoffUrl = '';
    let userInfo = {
      _id: targetUserId,
      name: targetUserName || 'Target User',
      email: targetUserEmail || '',
    };

    if (platform === 'bizmanager') {
      // BizManager is hosted solely on Vercel frontend without a separate backend API
      const BIZMANAGER_JWT_SECRET =
        process.env.BIZMANAGER_JWT_SECRET || 'bizzai-dev-jwt-secret-key-minimum-32-characters-long';
      const bizAppUrl = (
        process.env.BIZMANAGER_APP_URL || 'https://bizmanager.megatrixai.com'
      ).replace(/\/$/, '');

      const token = jwt.sign(
        {
          id: targetUserId,
          _id: targetUserId,
          userId: targetUserId,
          name: targetUserName || 'BizManager Merchant',
          email: targetUserEmail || '',
          shopName: req.body.targetShopName || 'Retail Counter',
          role: req.body.targetRole || 'owner',
          isSpoof: true,
          jti: crypto.randomBytes(16).toString('hex'),
          iat: Math.floor(Date.now() / 1000),
          ctx: {
            ip: 'megatrix-admin-spoof',
            ua: req.headers['user-agent']
              ? crypto.createHash('sha256').update(req.headers['user-agent']).digest('hex').substring(0, 16)
              : null,
          },
        },
        BIZMANAGER_JWT_SECRET,
        { expiresIn: '30m' }
      );

      handoffUrl = `${bizAppUrl}/impersonate?token=${encodeURIComponent(token)}&spoof=true&sid=${encodeURIComponent(spoofSessionId)}`;
      userInfo = {
        _id: targetUserId,
        name: targetUserName || 'BizManager Merchant',
        email: targetUserEmail || '',
        shopName: req.body.targetShopName || 'Retail Counter',
        role: req.body.targetRole || 'owner',
      };
    } else {
      // SchoolHub / SchoolManager Integration
      const schoolApiBase = (
        process.env.SCHOOL_MANAGER_API_URL ||
        process.env.SCHOOLMANAGER_INTERNAL_API_URL ||
        'https://api-schoolhub.megatrixai.com/api'
      )
        .replace(/\/api\/?$/, '')
        .replace(/\/$/, '');

      const serviceKey =
        process.env.MEGATRIX_SERVICE_SECRET || 'megatrix_core_internal_service_key_2026';
      const schoolAppUrl = (
        process.env.SCHOOLMANAGER_APP_URL || 'https://schoolhub.megatrixai.com'
      ).replace(/\/$/, '');

      const targetRole = req.body.targetRole || 'teacher';
      const targetSchoolId = req.body.targetSchoolId || '6aa86ac8b787e0c870aa4956';

      try {
        const response = await axios.post(
          `${schoolApiBase}/api/admin-integration/impersonate`,
          {
            targetUserId,
            adminActorId: req.user._id,
            adminEmail: req.user.email,
            spoofSessionId,
          },
          {
            headers: {
              'x-megatrix-service-key': serviceKey,
            },
            timeout: 7000,
          }
        );

        if (response.data?.portalUrl) {
          // Normalize portalUrl to point to production domain if returned as localhost
          handoffUrl = response.data.portalUrl.replace(
            /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/,
            schoolAppUrl
          );
          // Ensure refreshToken is present in handoffUrl
          if (!handoffUrl.includes('refreshToken=')) {
            const SCHOOLHUB_REFRESH_SECRET =
              process.env.SCHOOLHUB_JWT_REFRESH_SECRET || 'school_mgr_super_secure_refresh_token_2025';
            const rfToken = response.data?.refreshToken || jwt.sign(
              {
                userId: targetUserId,
                schoolId: response.data?.userInfo?.schoolId || targetSchoolId,
                role: response.data?.userInfo?.role || targetRole,
                isSpoof: true,
                iat: Math.floor(Date.now() / 1000),
              },
              SCHOOLHUB_REFRESH_SECRET,
              { expiresIn: '7d' }
            );
            handoffUrl += `&refreshToken=${encodeURIComponent(rfToken)}`;
          }
          if (response.data.userInfo) {
            userInfo = response.data.userInfo;
          }
        }
      } catch (apiErr) {
        console.warn('[Spoof] Direct SchoolHub API impersonate failed, generating fallback signed token:', apiErr.message);
        // Resilient fallback: Direct token generation using SchoolHub's JWT secret
        const SCHOOLHUB_JWT_SECRET =
          process.env.SCHOOLHUB_JWT_SECRET || 'school_mgr_super_secure_jwt_secret_2025';
        const SCHOOLHUB_REFRESH_SECRET =
          process.env.SCHOOLHUB_JWT_REFRESH_SECRET || 'school_mgr_super_secure_refresh_token_2025';

        const token = jwt.sign(
          {
            userId: targetUserId,
            schoolId: targetSchoolId,
            role: targetRole,
            isSpoof: true,
            iat: Math.floor(Date.now() / 1000),
          },
          SCHOOLHUB_JWT_SECRET,
          { expiresIn: '30m' }
        );

        const refreshToken = jwt.sign(
          {
            userId: targetUserId,
            schoolId: targetSchoolId,
            role: targetRole,
            isSpoof: true,
            iat: Math.floor(Date.now() / 1000),
          },
          SCHOOLHUB_REFRESH_SECRET,
          { expiresIn: '7d' }
        );

        handoffUrl = `${schoolAppUrl}/impersonate?token=${encodeURIComponent(token)}&refreshToken=${encodeURIComponent(refreshToken)}&spoof=true&sid=${encodeURIComponent(spoofSessionId)}`;
        userInfo = {
          _id: targetUserId,
          name: targetUserName || 'Faculty / Staff Member',
          email: targetUserEmail || '',
          role: targetRole,
          schoolId: targetSchoolId,
        };
      }
    }

    if (!handoffUrl) {
      return res.status(500).json({ error: 'Failed to generate handoff URL for impersonation.' });
    }

    const auditLog = new AuditLog({
      actor: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role || 'admin',
      },
      action: 'IMPERSONATION_STARTED',
      target: {
        id: targetUserId,
        type: 'USER',
        name: userInfo?.name || targetUserName || 'Unknown',
        email: userInfo?.email || targetUserEmail || 'Unknown',
      },
      platform,
      details: {
        reason,
        spoofSessionId,
        handoffUrl,
      },
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent'],
    });

    await auditLog.save();

    return res.json({
      success: true,
      spoofSessionId,
      handoffUrl,
      targetUser: userInfo,
    });
  } catch (error) {
    console.error('Spoof initiation error:', error);
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
