import mongoose from 'mongoose';

const encryptedValueSchema = new mongoose.Schema(
  {
    ciphertext: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    algorithm: { type: String, default: 'aes-256-gcm' },
  },
  { _id: false }
);

const credentialSchema = new mongoose.Schema(
  {
    project: {
      type: String,
      required: true,
      enum: ['schoolhub', 'bizmanager'],
      index: true,
    },
    environment: {
      type: String,
      enum: ['production', 'staging', 'development'],
      default: 'production',
      index: true,
    },
    category: {
      type: String,
      enum: [
        'database',
        'api_key',
        'auth_secret',
        'storage',
        'smtp',
        'service_token',
        'deployment',
        'other',
      ],
      default: 'other',
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    // AES-256-GCM Encrypted Secret (zero plaintext in MongoDB)
    encryptedValue: {
      type: encryptedValueSchema,
      required: true,
      select: false, // Never return encrypted ciphertext in default queries unless explicitly selected
    },
    maskedValue: {
      type: String,
      required: true,
      default: '••••••••••••••••',
    },
    status: {
      type: String,
      enum: ['active', 'deprecated', 'revoked'],
      default: 'active',
      index: true,
    },
    lastRotatedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
      name: { type: String, default: 'System' },
      email: { type: String, default: 'system@megatrix.internal' },
    },
    updatedBy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
      name: { type: String, default: 'System' },
      email: { type: String, default: 'system@megatrix.internal' },
    },
  },
  { timestamps: true }
);

credentialSchema.index({ project: 1, environment: 1 });
credentialSchema.index({ project: 1, name: 1 });

export const Credential = mongoose.model('Credential', credentialSchema);
