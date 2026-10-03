import mongoose from 'mongoose';

const accountAdjustmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: 'Administrative Adjustment',
    },
    adjustmentType: {
      type: String,
      default: 'cash_inflow',
      index: true,
    },
    type: {
      type: String,
      default: 'cash_inflow',
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'PKR',
    },
    category: {
      type: String,
      default: 'Reconciliation Correction',
    },
    impactCategory: {
      type: String,
      default: 'cash_flow',
    },
    effectiveDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    date: {
      type: Date,
      default: function () {
        return this.effectiveDate || Date.now();
      },
      index: true,
    },
    sourcePlatform: {
      type: String,
      default: 'core',
      index: true,
    },
    targetEntity: {
      type: String,
      default: 'general',
    },
    targetId: {
      type: String,
      default: null,
    },
    targetRecordId: {
      type: String,
      default: null,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    reference: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['applied', 'approved', 'pending_approval', 'reverted'],
      default: 'applied',
      index: true,
    },
    createdBy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
      name: { type: String, default: 'Superadmin' },
      email: { type: String, default: 'admin@megatrix.internal' },
    },
    approvedBy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
      name: { type: String, default: 'Superadmin' },
      email: { type: String, default: 'admin@megatrix.internal' },
    },
  },
  { timestamps: true }
);

accountAdjustmentSchema.pre('save', function () {
  if (this.effectiveDate && !this.date) {
    this.date = this.effectiveDate;
  } else if (this.date && !this.effectiveDate) {
    this.effectiveDate = this.date;
  }
  if (this.adjustmentType && !this.type) {
    this.type = this.adjustmentType;
  } else if (this.type && !this.adjustmentType) {
    this.adjustmentType = this.type;
  }
  if (this.targetId && !this.targetRecordId) {
    this.targetRecordId = this.targetId;
  } else if (this.targetRecordId && !this.targetId) {
    this.targetId = this.targetRecordId;
  }
});

accountAdjustmentSchema.index({ effectiveDate: -1, adjustmentType: 1 });
accountAdjustmentSchema.index({ date: -1, type: 1 });
accountAdjustmentSchema.index({ sourcePlatform: 1, targetRecordId: 1 });

export const AccountAdjustment = mongoose.model('AccountAdjustment', accountAdjustmentSchema);
