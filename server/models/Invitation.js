import mongoose from 'mongoose';

const permissionItemSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    module: { type: String, required: true },
    resource: { type: String, required: true },
    actions: [{ type: String, required: true }],
  },
  { _id: false }
);

const invitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    tokenHash: { type: String, required: true, unique: true },
    accessLevel: {
      type: String,
      enum: ['full', 'partial'],
      default: 'partial',
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    platformScopes: [{ type: String, default: ['global'] }],
    permissions: [{ type: mongoose.Schema.Types.Mixed }],
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'expired', 'revoked'],
      default: 'pending',
      index: true,
    },
    expiresAt: { type: Date, required: true, index: true },
    acceptedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Invitation = mongoose.model('Invitation', invitationSchema);
