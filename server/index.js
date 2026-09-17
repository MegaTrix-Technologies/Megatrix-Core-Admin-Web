import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import apiRouter from './routes/api.js';
import { Role } from './models/Role.js';
import { AdminUser } from './models/AdminUser.js';
import { AuditLog } from './models/AuditLog.js';
import { Credential } from './models/Credential.js';
import { ALL_PERMISSION_KEYS } from './config/permissionsRegistry.js';

const app = express();
const PORT = process.env.PORT || 5002;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('[FATAL] MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Megatrix Global Admin Backend',
    timestamp: new Date().toISOString(),
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

/**
 * Bootstrap Default Roles & Superadmin
 */
async function seedDefaultRolesAndSuperAdmin() {
  try {
    // 1. Seed Roles
    const systemRoles = [
      {
        slug: 'superadmin',
        name: 'Superadmin',
        description: 'Unrestricted global superadministrator with full root authority across all platforms.',
        isSystem: true,
        platformScopes: ['global', 'bizmanager', 'schoolmanager', 'mailerx'],
        permissions: ['*'],
      },
      {
        slug: 'global_admin',
        name: 'Global Administrator',
        description: 'Comprehensive operational management across all integrated platforms and modules.',
        isSystem: true,
        platformScopes: ['global', 'bizmanager', 'schoolmanager', 'mailerx'],
        permissions: ALL_PERMISSION_KEYS,
      },
      {
        slug: 'platform_admin',
        name: 'Platform Administrator',
        description: 'Module administration scoped to authorized platforms.',
        isSystem: true,
        platformScopes: ['bizmanager', 'schoolmanager', 'mailerx'],
        permissions: ALL_PERMISSION_KEYS.filter((p) => !p.startsWith('global.roles') && !p.startsWith('global.audit')),
      },
      {
        slug: 'user_manager',
        name: 'User Manager',
        description: 'Authorized to invite, edit, and manage user lifecycles.',
        isSystem: true,
        platformScopes: ['global'],
        permissions: [
          'global.users.view',
          'global.users.create',
          'global.users.invite',
          'global.users.edit',
        ],
      },
      {
        slug: 'auditor',
        name: 'Security & Compliance Auditor',
        description: 'Read-only access to immutable audit logs and security inspection trails.',
        isSystem: true,
        platformScopes: ['global'],
        permissions: [
          'global.audit.view',
          'global.audit.export',
          'global.users.view',
          'global.roles.view',
        ],
      },
    ];

    const seededRoleMap = {};
    for (const r of systemRoles) {
      let roleDoc = await Role.findOne({ slug: r.slug });
      if (!roleDoc) {
        roleDoc = await Role.create(r);
        console.log(`[Seed] Created System Role: ${r.name} (${r.slug})`);
      } else {
        // Ensure system roles keep canonical definitions
        roleDoc.permissions = r.permissions;
        roleDoc.platformScopes = r.platformScopes;
        await roleDoc.save();
      }
      seededRoleMap[r.slug] = roleDoc;
    }

    // 2. Seed Superadmin Account
    const superAdminEmail = 'admin.megatrix@gmail.com';
    let superAdmin = await AdminUser.findOne({ email: superAdminEmail });

    if (!superAdmin) {
      const plainPassword = process.env.INITIAL_SUPERADMIN_PASSWORD || 'Orangeman235!';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(plainPassword, salt);

      superAdmin = await AdminUser.create({
        name: 'Megatrix Superadmin',
        email: superAdminEmail,
        phone: '+1 (555) 019-2831',
        passwordHash,
        status: 'active',
        accessLevel: 'full',
        isSuperAdmin: true,
        platformScopes: ['global', 'bizmanager', 'schoolmanager', 'mailerx'],
        roles: [seededRoleMap.superadmin._id],
        permissions: ['*'],
      });

      await AuditLog.create({
        actor: { id: null, name: 'System Bootstrapper', email: 'system@megatrix.internal', role: 'SYSTEM' },
        action: 'SUPERADMIN_INITIALIZED',
        target: { id: superAdmin._id, type: 'USER', email: superAdmin.email, name: superAdmin.name },
        details: { note: 'Initial Superadmin provisioned deterministically' },
      });

      console.log(`[Seed] Successfully initialized Superadmin account: ${superAdminEmail}`);
    } else {
      // Ensure superadmin has full access and superadmin role
      superAdmin.isSuperAdmin = true;
      superAdmin.accessLevel = 'full';
      superAdmin.status = 'active';
      if (!superAdmin.roles.includes(seededRoleMap.superadmin._id)) {
        superAdmin.roles.push(seededRoleMap.superadmin._id);
      }
      await superAdmin.save();
    }
  } catch (err) {
    console.error('[Seed Error]:', err);
  }
}

/**
 * Start Server
 */
async function start() {
  try {
    console.log('[Server] Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('[Server] Connected to MongoDB Atlas successfully.');

    await seedDefaultRolesAndSuperAdmin();

    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`  MEGATRIX GLOBAL ADMIN SERVER RUNNING ON PORT ${PORT}`);
      console.log(`  API Base URL: http://localhost:${PORT}/api`);
      console.log(`  Health Check: http://localhost:${PORT}/health`);
      console.log(`=================================================`);
    });
  } catch (err) {
    console.error('[Server Start Error]:', err);
    process.exit(1);
  }
}

start();
