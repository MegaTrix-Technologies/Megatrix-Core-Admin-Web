import { Role } from '../models/Role.js';
import { AdminUser } from '../models/AdminUser.js';
import { AuditLog } from '../models/AuditLog.js';

export const roleController = {
  /**
   * List all Roles with user count
   */
  listRoles: async (req, res) => {
    try {
      const roles = await Role.find().sort({ isSystem: -1, name: 1 });

      // Calculate user count for each role
      const rolesWithCount = await Promise.all(
        roles.map(async (r) => {
          const userCount = await AdminUser.countDocuments({ roles: r._id });
          return {
            ...r.toObject(),
            userCount,
          };
        })
      );

      return res.json({
        success: true,
        roles: rolesWithCount,
      });
    } catch (err) {
      console.error('[ListRoles Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve roles.' });
    }
  },

  /**
   * Create Custom Role
   */
  createRole: async (req, res) => {
    try {
      const { name, description = '', platformScopes = ['global'], permissions = [] } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Role name is required.' });
      }

      const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const existing = await Role.findOne({ slug });
      if (existing) {
        return res.status(400).json({ success: false, message: 'A role with this identifier already exists.' });
      }

      const role = await Role.create({
        name: name.trim(),
        slug,
        description,
        isSystem: false,
        platformScopes,
        permissions,
        createdBy: req.user._id,
      });

      // Audit Log
      await AuditLog.create({
        actor: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.isSuperAdmin ? 'SUPERADMIN' : req.user.accessLevel.toUpperCase(),
        },
        action: 'ROLE_CREATE',
        target: { id: role._id, type: 'ROLE', name: role.name },
        details: { slug, platformScopes, permissionsCount: permissions.length },
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
      });

      return res.status(201).json({
        success: true,
        message: `Custom role "${role.name}" created successfully.`,
        role,
      });
    } catch (err) {
      console.error('[CreateRole Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to create role.' });
    }
  },

  /**
   * Update Role
   */
  updateRole: async (req, res) => {
    try {
      const role = await Role.findById(req.params.id);
      if (!role) {
        return res.status(404).json({ success: false, message: 'Role not found.' });
      }

      if (role.isSystem && !req.user.isSuperAdmin) {
        return res.status(403).json({ success: false, message: 'Only Superadmin can modify system roles.' });
      }

      const { name, description, platformScopes, permissions } = req.body;

      if (name) role.name = name.trim();
      if (description !== undefined) role.description = description;
      if (Array.isArray(platformScopes)) role.platformScopes = platformScopes;
      if (Array.isArray(permissions)) role.permissions = permissions;

      await role.save();

      // Audit Log
      await AuditLog.create({
        actor: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.isSuperAdmin ? 'SUPERADMIN' : req.user.accessLevel.toUpperCase(),
        },
        action: 'ROLE_UPDATE',
        target: { id: role._id, type: 'ROLE', name: role.name },
        details: { updatedFields: Object.keys(req.body) },
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
      });

      return res.json({
        success: true,
        message: `Role "${role.name}" updated successfully.`,
        role,
      });
    } catch (err) {
      console.error('[UpdateRole Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to update role.' });
    }
  },

  /**
   * Delete Role (Custom only)
   */
  deleteRole: async (req, res) => {
    try {
      const role = await Role.findById(req.params.id);
      if (!role) {
        return res.status(404).json({ success: false, message: 'Role not found.' });
      }

      if (role.isSystem) {
        return res.status(403).json({ success: false, message: 'System built-in roles cannot be deleted.' });
      }

      const assignedCount = await AdminUser.countDocuments({ roles: role._id });
      if (assignedCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete role "${role.name}" because it is currently assigned to ${assignedCount} user(s). Reassign them first.`,
        });
      }

      await Role.findByIdAndDelete(req.params.id);

      // Audit Log
      await AuditLog.create({
        actor: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.isSuperAdmin ? 'SUPERADMIN' : req.user.accessLevel.toUpperCase(),
        },
        action: 'ROLE_DELETE',
        target: { id: role._id, type: 'ROLE', name: role.name },
        details: { deletedRoleSlug: role.slug },
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
      });

      return res.json({
        success: true,
        message: `Role "${role.name}" deleted.`,
      });
    } catch (err) {
      console.error('[DeleteRole Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete role.' });
    }
  },
};
