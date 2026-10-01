import mongoose from 'mongoose';

const accountSyncLogSchema = new mongoose.Schema(
  {
    sourcePlatform: {
      type: String,
      required: true,
      default: 'leadhunter',
      index: true
    },
    syncId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: null
    },
    durationMs: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['running', 'success', 'partial', 'failed'],
      default: 'running',
      index: true
    },
    mode: {
      type: String,
      enum: ['api_gateway', 'atlas_direct_fallback'],
      default: 'api_gateway'
    },
    recordsFetched: {
      sales: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
      inflows: { type: Number, default: 0 },
      expenses: { type: Number, default: 0 },
      commissions: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    errors: [
      {
        endpoint: { type: String },
        message: { type: String },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    triggeredBy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
      name: { type: String, default: 'System Scheduler' },
      email: { type: String, default: 'system@megatrix.internal' }
    }
  },
  { timestamps: true }
);

accountSyncLogSchema.index({ sourcePlatform: 1, startedAt: -1 });

export const AccountSyncLog = mongoose.model('AccountSyncLog', accountSyncLogSchema);
