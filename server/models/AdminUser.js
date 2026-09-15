import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const permissionItemSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    module: { type: String, required: true },
    resource: { type: String, required: true },
    actions: [{ type: String, required: true }],
  },
  { _id: false }
);

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, default: '' },
    passwordHash: { type: String, default: null },
    status: {
      type: String,
      enum: ['active', 'invited', 'pending', 'suspended', 'disabled'],
      default: 'pending',
      index: true,
    },
    accessLevel: {
      type: String,
      enum: ['full', 'partial'],
      default: 'partial',
      index: true,
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    platformScopes: [{ type: String, default: ['global'] }],
    permissions: [{ type: mongoose.Schema.Types.Mixed }], // Direct granular overrides or wildcard
    isSuperAdmin: { type: Boolean, default: false, index: true },
    invitation: {
      tokenHash: { type: String, default: null },
      invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
      expiresAt: { type: Date, default: null },
      acceptedAt: { type: Date, default: null },
    },
    lastLoginAt: { type: Date, default: null },
    lastLoginIp: { type: String, default: null },
    lastActiveOS: { type: String, default: null },
    lastActiveBrowser: { type: String, default: null },
  },
  { timestamps: true }
);

adminUserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
