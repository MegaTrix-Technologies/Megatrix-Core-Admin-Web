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

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    isSystem: { type: Boolean, default: false }, // System roles cannot be deleted
    platformScopes: [{ type: String, default: ['global'] }],
    permissions: [{ type: mongoose.Schema.Types.Mixed }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  },
  { timestamps: true }
);

export const Role = mongoose.model('Role', roleSchema);
