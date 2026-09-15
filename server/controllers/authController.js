import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { AdminUser } from '../models/AdminUser.js';
import { Invitation } from '../models/Invitation.js';
import { AuditLog } from '../models/AuditLog.js';
import { calculateEffectivePermissions } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'megatrix-global-admin-jwt-secret-2026-production';

export const authController = {
  /**
   * SuperAdmin & Administrator Login
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = await AdminUser.findOne({ email: normalizedEmail }).populate('roles');

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        // Log failed attempt
        await AuditLog.create({
          action: 'LOGIN_FAILED',
          target: { id: user._id, type: 'USER', email: user.email, name: user.name },
          details: { reason: 'Incorrect password attempt' },
          ipAddress: req.ip || req.connection?.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
        return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
      }

      if (user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: `Account cannot log in. Status: ${user.status.toUpperCase()}.`,
          status: user.status,
        });
      }

      // Update session metrics
      user.lastLoginAt = new Date();
      user.lastLoginIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';
      user.lastActiveBrowser = req.headers['user-agent']?.slice(0, 80) || 'Unknown Browser';
      await user.save();

      // Sign JWT
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          accessLevel: user.accessLevel,
          isSuperAdmin: user.isSuperAdmin,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const effectivePermissions = Array.from(calculateEffectivePermissions(user));

      // Log login success
      await AuditLog.create({
        actor: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.isSuperAdmin ? 'SUPERADMIN' : user.accessLevel.toUpperCase(),
        },
        action: 'LOGIN_SUCCESS',
        target: { id: user._id, type: 'USER', email: user.email, name: user.name },
        details: { accessLevel: user.accessLevel, isSuperAdmin: user.isSuperAdmin },
        ipAddress: user.lastLoginIp,
        userAgent: req.headers['user-agent'],
      });

      return res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.status,
          accessLevel: user.accessLevel,
          roles: user.roles,
          platformScopes: user.platformScopes,
          isSuperAdmin: user.isSuperAdmin,
          effectivePermissions,
        },
      });
    } catch (err) {
      console.error('[Login Error]:', err);
      return res.status(500).json({ success: false, message: 'Internal server error during authentication.' });
    }
  },

  /**
   * Get Current Authenticated User & Real-time Effective Permissions
   */
  getMe: async (req, res) => {
    try {
      const user = req.user;
      const effectivePermissions = Array.from(req.effectivePermissions);

      return res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.status,
          accessLevel: user.accessLevel,
          roles: user.roles,
          platformScopes: user.platformScopes,
          permissions: user.permissions,
          isSuperAdmin: user.isSuperAdmin,
          lastLoginAt: user.lastLoginAt,
          lastLoginIp: user.lastLoginIp,
          effectivePermissions,
        },
      });
    } catch (err) {
      console.error('[GetMe Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve user profile.' });
    }
  },

  /**
   * Verify and Accept Account Invitation Token
   */
  activateInvitation: async (req, res) => {
    try {
      const { token, password, confirmPassword } = req.body;
      if (!token || !password) {
        return res.status(400).json({ success: false, message: 'Invitation token and password are required.' });
      }

      if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
      }

      if (confirmPassword && password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match.' });
      }

      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      const invitation = await Invitation.findOne({
        tokenHash,
        status: 'pending',
        expiresAt: { $gt: new Date() },
      });

      if (!invitation) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired invitation token. Please request a new invitation.',
        });
      }

      const user = await AdminUser.findOne({ email: invitation.email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'Invited user account not found.' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
      user.status = 'active';
      user.invitation.acceptedAt = new Date();
      await user.save();

      // Mark invitation accepted
      invitation.status = 'accepted';
      invitation.acceptedAt = new Date();
      await invitation.save();

      // Log activation in audit trail
      await AuditLog.create({
        actor: { id: user._id, name: user.name, email: user.email, role: 'USER' },
        action: 'INVITATION_ACCEPT',
        target: { id: user._id, type: 'USER', email: user.email, name: user.name },
        details: { acceptedAt: new Date() },
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
      });

      return res.json({
        success: true,
        message: 'Account successfully activated! You may now sign in with your password.',
      });
    } catch (err) {
      console.error('[Activate Invitation Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to activate invitation.' });
    }
  },

  /**
   * Check token validity for UI preview
   */
  verifyInvitation: async (req, res) => {
    try {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({ success: false, message: 'Token is required.' });
      }
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const invitation = await Invitation.findOne({
        tokenHash,
        status: 'pending',
        expiresAt: { $gt: new Date() },
      });
      if (!invitation) {
        return res.status(400).json({ success: false, message: 'Invalid or expired invitation token.' });
      }
      return res.json({
        success: true,
        invitation: {
          email: invitation.email,
          name: invitation.name,
          platformScopes: invitation.platformScopes,
          accessLevel: invitation.accessLevel,
          expiresAt: invitation.expiresAt,
        },
      });
    } catch (err) {
      console.error('[Verify Invitation Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to verify invitation.' });
    }
  },
};
