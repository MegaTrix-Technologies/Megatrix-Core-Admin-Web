import { Credential } from '../models/Credential.js';
import { AuditLog } from '../models/AuditLog.js';
import { encryptSecret, decryptSecret, maskSecret } from '../utils/encryption.js';

/**
 * Seeds default production credentials for a project if none exist
 */
async function seedDefaultProjectCredentials(project, actor) {
  const existingCount = await Credential.countDocuments({ project });
  if (existingCount > 0) return;

  const defaultsByProject = {
    schoolhub: [
      {
        project: 'schoolhub',
        environment: 'production',
        category: 'database',
        name: 'MONGODB_URI',
        description: 'Live MongoDB Atlas cluster connection for school_management database',
        rawSecret: process.env.MONGODB_URI || 'mongodb+srv://cluster0.5tchcnc.mongodb.net/school_management',
      },
      {
        project: 'schoolhub',
        environment: 'production',
        category: 'auth_secret',
        name: 'JWT_SECRET',
        description: 'Authentication token signing key for Campus Admin and Teacher sessions',
        rawSecret: process.env.JWT_SECRET || 'schoolhub-prod-session-key-2026',
      },
      {
        project: 'schoolhub',
        environment: 'production',
        category: 'service_token',
        name: 'MEGATRIX_SERVICE_SECRET',
        description: 'Core Admin to School Hub internal administrative gateway header secret',
        rawSecret: process.env.MEGATRIX_SERVICE_SECRET || 'megatrix_core_internal_service_key_2026',
      },
      {
        project: 'schoolhub',
        environment: 'production',
        category: 'storage',
        name: 'BACKBLAZE_B2_APPLICATION_KEY',
        description: 'Encrypted object storage credentials for school documents and fee challans',
        rawSecret: '002c9a174826bba0000000001:K002abcdef1234567890abcdef12345',
      },
      {
        project: 'schoolhub',
        environment: 'production',
        category: 'smtp',
        name: 'BREVO_SMTP_KEY',
        description: 'Transactional email dispatch for admissions, invitations, and alerts',
        rawSecret: process.env.BREVO_SMTP_PASS || 'xsmtpsib-key-placeholder',
      },
    ],
    bizmanager: [
      {
        project: 'bizmanager',
        environment: 'production',
        category: 'deployment',
        name: 'VERCEL_PROJECT_ID',
        description: 'Vercel production client deployment identifier for bizmanager.megatrixai.com',
        rawSecret: 'prj_megatrix_bizmanager_prod_9921',
      },
      {
        project: 'bizmanager',
        environment: 'production',
        category: 'auth_secret',
        name: 'POS_JWT_SECRET',
        description: 'Cashier checkout terminal and barcode scanner session signing key',
        rawSecret: 'biz-manager-pos-terminal-secret-2026',
      },
      {
        project: 'bizmanager',
        environment: 'production',
        category: 'database',
        name: 'MONGODB_URI_RETAIL',
        description: 'Isolated retail outlet SKU and customer khata ledger storage',
        rawSecret: process.env.MONGODB_URI || 'mongodb+srv://cluster0.5tchcnc.mongodb.net/biz_retail_db',
      },
      {
        project: 'bizmanager',
        environment: 'production',
        category: 'api_key',
        name: 'SMS_GATEWAY_API_KEY',
        description: 'Customer SMS transaction receipt & khata recovery alert gateway',
        rawSecret: 'sms_live_992837482910482918',
      },
    ],
  };

  const toSeed = defaultsByProject[project] || [];
  for (const item of toSeed) {
    const encrypted = encryptSecret(item.rawSecret);
    await Credential.create({
      project: item.project,
      environment: item.environment,
      category: item.category,
      name: item.name,
      description: item.description,
      encryptedValue: encrypted,
      maskedValue: maskSecret(item.rawSecret),
      status: 'active',
      createdBy: {
        id: actor?._id || null,
        name: actor?.name || 'System Bootstrapper',
        email: actor?.email || 'system@megatrix.internal',
      },
      updatedBy: {
        id: actor?._id || null,
        name: actor?.name || 'System Bootstrapper',
        email: actor?.email || 'system@megatrix.internal',
      },
    });
  }
}

export const credentialController = {
  /**
   * GET /api/credentials
   * Returns list of credential metadata and masked values (encryptedValue is NOT sent)
   */
  listCredentials: async (req, res) => {
    try {
      const { project = 'schoolhub', environment, category } = req.query;

      if (!['schoolhub', 'bizmanager'].includes(project)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid project. Only schoolhub and bizmanager are supported.',
        });
      }

      // Check and seed default production credentials if empty
      await seedDefaultProjectCredentials(project, req.user);

      const query = { project };
      if (environment && environment !== 'all') query.environment = environment;
      if (category && category !== 'all') query.category = category;

      const credentials = await Credential.find(query)
        .sort({ createdAt: 1 })
        .lean();

      // Log metadata inspection in audit
      try {
        await AuditLog.create({
          actor: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.isSuperAdmin ? 'SUPERADMIN' : (req.user.accessLevel || 'FULL').toUpperCase(),
          },
          action: 'CREDENTIAL_METADATA_VIEWED',
          target: {
            id: null,
            type: 'CREDENTIAL_VAULT',
            name: `${project.toUpperCase()} Credentials List`,
          },
          platform: project,
          details: {
            project,
            recordCount: credentials.length,
          },
          ipAddress: req.ip || req.connection?.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
      } catch (err) {
        console.error('[Audit Log Failure]:', err.message);
      }

      return res.json({
        success: true,
        project,
        count: credentials.length,
        credentials,
      });
    } catch (err) {
      console.error('[listCredentials Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve credentials.' });
    }
  },

  /**
   * POST /api/credentials/:id/reveal
   * Strictly protected: Decrypts ONE secret and records explicit audit log.
   */
  revealCredential: async (req, res) => {
    try {
      const { id } = req.params;
      const credential = await Credential.findById(id).select('+encryptedValue');

      if (!credential) {
        return res.status(404).json({ success: false, message: 'Credential record not found.' });
      }

      // Decrypt using AES-256-GCM
      const decryptedSecret = decryptSecret(credential.encryptedValue);

      // Audit REVEAL action (NEVER log the decrypted secret!)
      try {
        await AuditLog.create({
          actor: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.isSuperAdmin ? 'SUPERADMIN' : (req.user.accessLevel || 'FULL').toUpperCase(),
          },
          action: 'CREDENTIAL_REVEALED',
          target: {
            id: credential._id.toString(),
            type: 'CREDENTIAL',
            name: credential.name,
          },
          platform: credential.project,
          details: {
            credentialName: credential.name,
            environment: credential.environment,
            category: credential.category,
            project: credential.project,
            note: 'Explicit cryptographic reveal requested by authorized administrator',
          },
          ipAddress: req.ip || req.connection?.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
      } catch (err) {
        console.error('[Audit Log Failure]:', err.message);
      }

      return res.json({
        success: true,
        credential: {
          _id: credential._id,
          name: credential.name,
          project: credential.project,
          environment: credential.environment,
          category: credential.category,
          secretValue: decryptedSecret,
        },
      });
    } catch (err) {
      console.error('[revealCredential Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to decrypt credential.' });
    }
  },

  /**
   * POST /api/credentials
   * Encrypts and saves a new credential
   */
  createCredential: async (req, res) => {
    try {
      const { project, environment = 'production', category = 'other', name, description = '', secretValue } = req.body;

      if (!project || !['schoolhub', 'bizmanager'].includes(project)) {
        return res.status(400).json({ success: false, message: 'Valid project is required (schoolhub or bizmanager).' });
      }

      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Credential name is required.' });
      }

      if (!secretValue || typeof secretValue !== 'string') {
        return res.status(400).json({ success: false, message: 'Valid secret value is required.' });
      }

      // Check for duplicate name in same project and environment
      const existing = await Credential.findOne({ project, environment, name: name.trim() });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `A credential named "${name}" already exists for ${project} in ${environment}.`,
        });
      }

      const encrypted = encryptSecret(secretValue);
      const masked = maskSecret(secretValue);

      const newCred = await Credential.create({
        project,
        environment,
        category,
        name: name.trim().toUpperCase(),
        description: description.trim(),
        encryptedValue: encrypted,
        maskedValue: masked,
        status: 'active',
        createdBy: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
        },
        updatedBy: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
        },
      });

      // Audit creation (NEVER log the secret)
      try {
        await AuditLog.create({
          actor: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.isSuperAdmin ? 'SUPERADMIN' : (req.user.accessLevel || 'FULL').toUpperCase(),
          },
          action: 'CREDENTIAL_CREATED',
          target: {
            id: newCred._id.toString(),
            type: 'CREDENTIAL',
            name: newCred.name,
          },
          platform: project,
          details: {
            name: newCred.name,
            project: newCred.project,
            environment: newCred.environment,
            category: newCred.category,
          },
          ipAddress: req.ip || req.connection?.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
      } catch (err) {
        console.error('[Audit Log Failure]:', err.message);
      }

      const sanitized = newCred.toObject();
      delete sanitized.encryptedValue;

      return res.status(201).json({
        success: true,
        credential: sanitized,
      });
    } catch (err) {
      console.error('[createCredential Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to create credential.' });
    }
  },

  /**
   * PUT /api/credentials/:id
   * Updates metadata or rotates secret value
   */
  updateCredential: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, category, environment, status, secretValue } = req.body;

      const cred = await Credential.findById(id).select('+encryptedValue');
      if (!cred) {
        return res.status(404).json({ success: false, message: 'Credential record not found.' });
      }

      let isRotated = false;

      if (secretValue && typeof secretValue === 'string' && secretValue.trim().length > 0) {
        cred.encryptedValue = encryptSecret(secretValue);
        cred.maskedValue = maskSecret(secretValue);
        cred.lastRotatedAt = new Date();
        isRotated = true;
      }

      if (name) cred.name = name.trim().toUpperCase();
      if (description !== undefined) cred.description = description.trim();
      if (category) cred.category = category;
      if (environment) cred.environment = environment;
      if (status) cred.status = status;

      cred.updatedBy = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      };

      await cred.save();

      // Audit update or rotation (NEVER log the secret)
      try {
        await AuditLog.create({
          actor: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.isSuperAdmin ? 'SUPERADMIN' : (req.user.accessLevel || 'FULL').toUpperCase(),
          },
          action: isRotated ? 'CREDENTIAL_ROTATED' : 'CREDENTIAL_UPDATED',
          target: {
            id: cred._id.toString(),
            type: 'CREDENTIAL',
            name: cred.name,
          },
          platform: cred.project,
          details: {
            name: cred.name,
            project: cred.project,
            isRotated,
            category: cred.category,
            environment: cred.environment,
          },
          ipAddress: req.ip || req.connection?.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
      } catch (err) {
        console.error('[Audit Log Failure]:', err.message);
      }

      const sanitized = cred.toObject();
      delete sanitized.encryptedValue;

      return res.json({
        success: true,
        credential: sanitized,
      });
    } catch (err) {
      console.error('[updateCredential Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to update credential.' });
    }
  },

  /**
   * DELETE /api/credentials/:id
   * Securely removes a credential record
   */
  deleteCredential: async (req, res) => {
    try {
      const { id } = req.params;
      const cred = await Credential.findById(id);

      if (!cred) {
        return res.status(404).json({ success: false, message: 'Credential record not found.' });
      }

      const credentialName = cred.name;
      const project = cred.project;

      await Credential.findByIdAndDelete(id);

      // Audit deletion (NEVER log the secret)
      try {
        await AuditLog.create({
          actor: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.isSuperAdmin ? 'SUPERADMIN' : (req.user.accessLevel || 'FULL').toUpperCase(),
          },
          action: 'CREDENTIAL_DELETED',
          target: {
            id,
            type: 'CREDENTIAL',
            name: credentialName,
          },
          platform: project,
          details: {
            credentialName,
            project,
          },
          ipAddress: req.ip || req.connection?.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
      } catch (err) {
        console.error('[Audit Log Failure]:', err.message);
      }

      return res.json({
        success: true,
        message: `Credential ${credentialName} removed securely.`,
      });
    } catch (err) {
      console.error('[deleteCredential Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete credential.' });
    }
  },
};
