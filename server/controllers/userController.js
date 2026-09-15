import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { AdminUser } from '../models/AdminUser.js';
import { Role } from '../models/Role.js';
import { Invitation } from '../models/Invitation.js';
import { AuditLog } from '../models/AuditLog.js';
import { mailerxRelay } from '../services/mailerxRelay.js';
import { calculateEffectivePermissions } from '../middleware/auth.js';

export const userController = {
  /**
   * List Users with Search, Filter & Pagination
   */
  listUsers: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        status = '',
        accessLevel = '',
        platform = '',
        role = '',
      } = req.query;

      const query = {};

      if (search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
      }

      if (status && status !== 'all') {
        query.status = status;
      }

      if (accessLevel && accessLevel !== 'all') {
        query.accessLevel = accessLevel;
      }

      if (platform && platform !== 'all') {
        query.platformScopes = platform;
      }

      if (role && role !== 'all') {
        query.roles = role;
      }

      // If partial admin has restricted platform scope, only show users belonging to those platform scopes
      if (!req.user.isSuperAdmin && req.user.accessLevel !== 'full') {
        const actorPlatforms = req.user.platformScopes || [];
        if (!actorPlatforms.includes('global')) {
          query.platformScopes = { $in: actorPlatforms };
        }
      }

      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      const total = await AdminUser.countDocuments(query);
      const users = await AdminUser.find(query)
        .populate('roles', 'name slug isSystem')
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10));

      return res.json({
        success: true,
        users,
        pagination: {
          total,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
        },
      });
    } catch (err) {
      console.error('[ListUsers Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
    }
  },

  /**
   * Get Single User & Effective Access Calculation
   */
  getUser: async (req, res) => {
    try {
      const user = await AdminUser.findById(req.params.id).populate('roles');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const effectivePermissions = Array.from(calculateEffectivePermissions(user));

      // Get recent audit logs related to this user
      const recentAudit = await AuditLog.find({ 'target.id': user._id.toString() })
        .sort({ createdAt: -1 })
        .limit(10);

      return res.json({
        success: true,
        user: {
          ...user.toObject(),
          effectivePermissions,
          auditHistory: recentAudit,
        },
      });
    } catch (err) {
      console.error('[GetUser Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch user details.' });
    }
  },

  /**
   * Create User Direct (With immediate password)
   */
  createUser: async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        password,
        accessLevel = 'partial',
        roles = [],
        platformScopes = ['global'],
        permissions = [],
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existing = await AdminUser.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await AdminUser.create({
        name: name.trim(),
        email: normalizedEmail,
        phone: phone || '',
        passwordHash,
        status: 'active',
        accessLevel,
        roles,
        platformScopes,
        permissions,
        isSuperAdmin: false,
      });

      // Audit Log
      await AuditLog.create({
        actor: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.isSuperAdmin ? 'SUPERADMIN' : req.user.accessLevel.toUpperCase(),
        },
        action: 'USER_CREATE',
        target: { id: user._id, type: 'USER', email: user.email, name: user.name },
        details: { accessLevel, platformScopes, rolesCount: roles.length },
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
      });

      return res.status(201).json({
        success: true,
        message: `Administrator account for ${user.name} created successfully.`,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          status: user.status,
          accessLevel: user.accessLevel,
        },
      });
    } catch (err) {
      console.error('[CreateUser Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to create user.' });
    }
  },

  /**
   * Invite User via MailerX Email Dispatch
   */
  inviteUser: async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        accessLevel = 'partial',
        roles = [],
        platformScopes = ['global'],
        permissions = [],
      } = req.body;

      if (!name || !email) {
        return res.status(400).json({ success: false, message: 'Name and email are required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      let user = await AdminUser.findOne({ email: normalizedEmail });

      if (user && user.status === 'active') {
        return res.status(400).json({ success: false, message: 'An active user already exists with this email address.' });
      }

      // Generate cryptographically secure token
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + 48 * 3600 * 1000); // 48 hours validity

      if (!user) {
        user = await AdminUser.create({
          name: name.trim(),
          email: normalizedEmail,
          phone: phone || '',
          status: 'invited',
          accessLevel,
          roles,
          platformScopes,
          permissions,
          isSuperAdmin: false,
          invitation: {
            tokenHash,
            invitedBy: req.user._id,
            expiresAt,
          },
        });
      } else {
        // Re-inviting existing pending user
        user.name = name.trim();
        user.status = 'invited';
        user.accessLevel = accessLevel;
        user.roles = roles;
        user.platformScopes = platformScopes;
        user.permissions = permissions;
        user.invitation = {
          tokenHash,
          invitedBy: req.user._id,
          expiresAt,
        };
        await user.save();
      }

      // Record in Invitation collection
      await Invitation.create({
        email: normalizedEmail,
        name: name.trim(),
        phone: phone || '',
        tokenHash,
        accessLevel,
        roles,
        platformScopes,
        permissions,
        invitedBy: req.user._id,
        status: 'pending',
        expiresAt,
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5175';
      const invitationUrl = `${frontendUrl}/activate?token=${rawToken}`;

      // Dispatch authentic email via MailerX
      const emailResult = await mailerxRelay.sendInvitation({
        recipientEmail: normalizedEmail,
        recipientName: name.trim(),
        invitationUrl,
        accessLevel,
        invitedByName: req.user.name,
      });

      // Audit Log
      await AuditLog.create({
        actor: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.isSuperAdmin ? 'SUPERADMIN' : req.user.accessLevel.toUpperCase(),
        },
        action: 'INVITATION_SENT',
        target: { id: user._id, type: 'USER', email: user.email, name: user.name },
        details: { accessLevel, platformScopes, emailDispatched: emailResult.success },
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
      });

      return res.status(201).json({
        success: true,
        message: `Invitation successfully dispatched to ${normalizedEmail} via MailerX!`,
        invitationUrl,
        invitationToken: rawToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          status: user.status,
          accessLevel: user.accessLevel,
        },
      });
    } catch (err) {
      console.error('[InviteUser Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to dispatch invitation.' });
    }
  },

  /**
   * Update User Profile, Roles, and Permissions
   */
  updateUser: async (req, res) => {
    try {
      const user = await AdminUser.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      // CRITICAL SUPERADMIN PROTECTION:
      if (user.isSuperAdmin && !req.user.isSuperAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Security policy violation: Only the Superadmin can modify the Superadmin account.',
        });
      }

      const { name, phone, accessLevel, roles, platformScopes, permissions } = req.body;

      if (name) user.name = name.trim();
      if (phone !== undefined) user.phone = phone;

      // Only alter permissions if provided
      if (accessLevel && !user.isSuperAdmin) {
        user.accessLevel = accessLevel;
      }
      if (Array.isArray(roles) && !user.isSuperAdmin) {
        user.roles = roles;
      }
      if (Array.isArray(platformScopes) && !user.isSuperAdmin) {
        user.platformScopes = platformScopes;
      }
      if (Array.isArray(permissions) && !user.isSuperAdmin) {
        user.permissions = permissions;
      }

      await user.save();

      // Audit Log
      await AuditLog.create({
        actor: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.isSuperAdmin ? 'SUPERADMIN' : req.user.accessLevel.toUpperCase(),
        },
        action: 'USER_UPDATE',
        target: { id: user._id, type: 'USER', email: user.email, name: user.name },
        details: { accessLevel: user.accessLevel, platformScopes: user.platformScopes },
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
      });

      return res.json({
        success: true,
        message: `Account details for ${user.name} updated.`,
        user,
      });
    } catch (err) {
      console.error('[UpdateUser Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to update user.' });
    }
  },

  /**
   * Update User Status (active, suspended, disabled)
   */
  updateStatus: async (req, res) => {
    try {
      const { status, reason } = req.body;
      const validStatuses = ['active', 'suspended', 'disabled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value.' });
      }

      const user = await AdminUser.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      // CRITICAL SUPERADMIN PROTECTION:
      if (user.isSuperAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Security policy violation: The Superadmin account cannot be suspended or disabled.',
        });
      }

      const previousStatus = user.status;
      user.status = status;
      await user.save();

      // Audit Log
      await AuditLog.create({
        actor: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.isSuperAdmin ? 'SUPERADMIN' : req.user.accessLevel.toUpperCase(),
        },
        action: 'USER_STATUS_CHANGE',
        target: { id: user._id, type: 'USER', email: user.email, name: user.name },
        details: { previousStatus, newStatus: status, reason: reason || 'Status updated by administrator' },
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
      });

      return res.json({
        success: true,
        message: `User status changed to ${status.toUpperCase()}.`,
        user,
      });
    } catch (err) {
      console.error('[UpdateStatus Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to update status.' });
    }
  },

  /**
   * Delete User (Soft Delete by setting status to disabled, or hard delete)
   */
  deleteUser: async (req, res) => {
    try {
      const user = await AdminUser.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      // CRITICAL SUPERADMIN PROTECTION:
      if (user.isSuperAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Security policy violation: The Superadmin account cannot be deleted.',
        });
      }

      await AdminUser.findByIdAndDelete(req.params.id);

      // Audit Log
      await AuditLog.create({
        actor: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.isSuperAdmin ? 'SUPERADMIN' : req.user.accessLevel.toUpperCase(),
        },
        action: 'USER_DELETE',
        target: { id: user._id, type: 'USER', email: user.email, name: user.name },
        details: { deletedEmail: user.email },
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
      });

      return res.json({
        success: true,
        message: `User ${user.name} permanently removed.`,
      });
    } catch (err) {
      console.error('[DeleteUser Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete user.' });
    }
  },
};
