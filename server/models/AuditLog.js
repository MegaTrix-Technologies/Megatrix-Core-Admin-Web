import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
      name: { type: String, default: 'System' },
      email: { type: String, default: 'system@megatrix.internal' },
      role: { type: String, default: 'SYSTEM' },
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    target: {
      id: { type: String, default: null },
      type: { type: String, default: 'USER' }, // 'USER', 'ROLE', 'SYSTEM', 'INVITATION'
      name: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    platform: { type: String, default: 'global' },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '127.0.0.1' },
    userAgent: { type: String, default: 'System Agent' },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable append-only
  }
);

// Helpful index for fast audit querying
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ 'actor.email': 1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
