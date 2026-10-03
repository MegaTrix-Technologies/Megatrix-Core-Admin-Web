import mongoose from 'mongoose';

const accountProjectSchema = new mongoose.Schema(
  {
    projectNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    sourceLegacyId: {
      type: String,
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      default: 'Direct Client',
    },
    saleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AccountSale',
      default: null,
      index: true,
    },
    contractValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    budgetedCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    actualCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['planning', 'in_progress', 'review', 'delivered', 'completed', 'on_hold', 'cancelled'],
      default: 'in_progress',
      index: true,
    },
    leadDeveloper: {
      type: String,
      default: 'MegaTrix Engineering',
    },
    assignedDevelopers: [
      {
        name: { type: String },
        role: { type: String, default: 'Developer' },
      },
    ],
    isDelivered: {
      type: Boolean,
      default: false,
      index: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Virtual for Profit Margin
accountProjectSchema.virtual('profitMargin').get(function () {
  if (!this.contractValue || this.contractValue <= 0) return 0;
  const net = this.contractValue - (this.actualCost || this.budgetedCost || 0);
  return parseFloat(((net / this.contractValue) * 100).toFixed(1));
});

export const AccountProject = mongoose.models.AccountProject || mongoose.model('AccountProject', accountProjectSchema);
