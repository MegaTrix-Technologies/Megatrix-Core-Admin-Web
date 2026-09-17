import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';
import { AuditLog } from '../models/AuditLog.js';

const JWT_SECRET = process.env.JWT_SECRET || 'megatrix-global-admin-jwt-secret-2026-production';

/**
 * Resolves a flat Set of "platform:module:resource:action" strings for a user
 */
export function calculateEffectivePermissions(user) {
  if (user.isSuperAdmin || user.accessLevel === 'full') {
    return new Set(['*']);
  }

  const effective = new Set();
  const allowedPlatforms = new Set(user.platformScopes || ['global']);

  const addPermItem = (perm) => {
    if (!perm) return;
    if (typeof perm === 'string') {
      if (perm === '*') {
        effective.add('*');
        return;
      }
      const parts = perm.split(':');
      if (allowedPlatforms.has(parts[0]) || allowedPlatforms.has('global')) {
        effective.add(perm);
      }
      return;
    }
    if (typeof perm === 'object' && perm.platform) {
      if (!allowedPlatforms.has(perm.platform) && !allowedPlatforms.has('global')) return;
      for (const act of perm.actions || []) {
        effective.add(`${perm.platform}:${perm.module}:${perm.resource}:${act}`);
      }
    }
  };

  // 1. Inherited from Roles
  if (Array.isArray(user.roles)) {
    for (const role of user.roles) {
      if (!role || !Array.isArray(role.permissions)) continue;
      for (const perm of role.permissions) {
        addPermItem(perm);
      }
    }
  }

  // 2. Direct User Permissions
  if (Array.isArray(user.permissions)) {
    for (const perm of user.permissions) {
      addPermItem(perm);
    }
  }

  return effective;
}

/**
 * Verifies JWT token and attaches user & effective permissions to request
 */
export const verifyAdminToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No bearer token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await AdminUser.findById(decoded.id).populate('roles');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User account not found.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Account access revoked. Current lifecycle status: ${user.status.toUpperCase()}`,
        status: user.status,
      });
    }

    req.user = user;
    req.effectivePermissions = calculateEffectivePermissions(user);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid authentication token.' });
  }
};

/**
 * Enforces that actor possesses the required granular action permission.
 * Supports:
 * - requirePermission('global', 'users', 'directory', 'view')
 * - requirePermission('global:users:directory:view')
 * - requirePermission('global.users.view') -> resolves to global:users:directory:view
 */
export const requirePermission = (...args) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    }

    // SuperAdmin or Full Access user always bypasses
    if (req.user.isSuperAdmin || req.user.accessLevel === 'full') {
      return next();
    }

    let requiredKey = '';
    let platform = 'global';

    if (args.length === 1) {
      const perm = args[0];
      if (perm.includes(':')) {
        requiredKey = perm;
        platform = perm.split(':')[0];
      } else if (perm.includes('.')) {
        const parts = perm.split('.');
        if (parts.length === 3) {
          const [plat, mod, act] = parts;
          platform = plat;
          let res = 'directory';
          if (mod === 'roles') res = 'role_matrix';
          else if (mod === 'audit') res = 'logs';
          else if (mod === 'settings') res = 'configuration';
          requiredKey = `${plat}:${mod}:${res}:${act}`;
        } else if (parts.length === 4) {
          requiredKey = parts.join(':');
          platform = parts[0];
        }
      }
    } else if (args.length === 4) {
      const [plat, mod, res, act] = args;
      platform = plat;
      requiredKey = `${plat}:${mod}:${res}:${act}`;
    }

    if (
      req.effectivePermissions.has(requiredKey) ||
      req.effectivePermissions.has(args[0]) ||
      req.effectivePermissions.has('*')
    ) {
      return next();
    }

    // Unauthorized attempt: log audit record
    try {
      await AuditLog.create({
        actor: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.isSuperAdmin ? 'SUPERADMIN' : req.user.accessLevel.toUpperCase(),
        },
        action: 'UNAUTHORIZED_ATTEMPT',
        target: {
          id: req.params.id || null,
          type: 'RESOURCE',
          name: requiredKey,
        },
        platform,
        details: {
          attemptedPermission: requiredKey,
          requestPath: req.originalUrl,
          method: req.method,
        },
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
      });
    } catch (e) {
      console.error('[Audit Log Failure]:', e.message);
    }

    return res.status(403).json({
      success: false,
      message: `Permission denied. Missing required authority: [${requiredKey}]`,
      requiredPermission: requiredKey,
    });
  };
};

/**
 * Blocks partial admins from elevating privileges or assigning permissions they do not have
 */
export const preventSelfEscalation = (req, res, next) => {
  const actor = req.user;
  if (!actor) return res.status(401).json({ success: false, message: 'Unauthenticated.' });

  // SuperAdmin has unrestricted delegation rights
  if (actor.isSuperAdmin) {
    return next();
  }

  const body = req.body || {};

  // 1. Cannot grant SuperAdmin status
  if (body.isSuperAdmin === true) {
    return res.status(403).json({
      success: false,
      message: 'Escalation blocked: Only Superadmin can grant Superadmin status.',
    });
  }

  // 2. Non-Full-Access actor cannot grant Full Access
  if (body.accessLevel === 'full' && actor.accessLevel !== 'full') {
    return res.status(403).json({
      success: false,
      message: 'Escalation blocked: Partial Access administrators cannot grant Full Access.',
    });
  }

  // 3. Actor cannot assign permissions outside their own effective permissions
  if (Array.isArray(body.permissions)) {
    for (const perm of body.permissions) {
      for (const act of perm.actions || []) {
        const key = `${perm.platform}:${perm.module}:${perm.resource}:${act}`;
        if (!actor.effectivePermissions.has(key) && !actor.effectivePermissions.has('*')) {
          return res.status(403).json({
            success: false,
            message: `Escalation blocked: You cannot grant permission [${key}] which you do not possess.`,
          });
        }
      }
    }
  }

  next();
};

/**
 * Enforces that actor is Superadmin or Full Access Administrator for Credentials access
 */
export const requireCredentialsAccess = async (req, res, next) => {
  const actor = req.user;
  if (!actor) {
    return res.status(401).json({ success: false, message: 'Unauthenticated.' });
  }

  // SuperAdmin or Full Access user has authority
  if (actor.isSuperAdmin || actor.accessLevel === 'full') {
    return next();
  }

  // Audit unauthorized attempt
  try {
    await AuditLog.create({
      actor: {
        id: actor._id,
        name: actor.name,
        email: actor.email,
        role: actor.isSuperAdmin ? 'SUPERADMIN' : (actor.accessLevel || 'PARTIAL').toUpperCase(),
      },
      action: 'UNAUTHORIZED_CREDENTIALS_ACCESS_ATTEMPT',
      target: {
        id: req.params.id || null,
        type: 'CREDENTIAL',
        name: req.query?.project || req.body?.name || 'CREDENTIAL_VAULT',
      },
      platform: req.query?.project || 'global',
      details: {
        attemptedPath: req.originalUrl,
        method: req.method,
        reason: 'Restricted to Superadmin and Full Access Administrators only',
      },
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent'],
    });
  } catch (err) {
    console.error('[Audit Log Failure]:', err.message);
  }

  return res.status(403).json({
    success: false,
    message: 'Access Denied: Credential management is strictly restricted to Superadmin and authorized Full Access administrators.',
  });
};
