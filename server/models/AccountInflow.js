import mongoose from 'mongoose';

const accountInflowSchema = new mongoose.Schema(
  {
    inflowNumber: {
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    type: {
      type: String,
      enum: ['sale_payment', 'project_milestone', 'investment', 'capital_injection', 'other_income'],
      default: 'other_income',
      index: true,
    },
    source: {
      type: String,
      default: 'Direct Client',
    },
    saleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AccountSale',
      default: null,
      index: true,
    },
    projectId: {
      type: String,
      default: null,
      index: true,
    },
    paymentMethod: {
      type: String,
      default: 'Bank Transfer',
    },
    reference: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    recordedBy: {
      type: String,
      default: 'Admin',
    },
  },
  { timestamps: true }
);

export const AccountInflow = mongoose.models.AccountInflow || mongoose.model('AccountInflow', accountInflowSchema);
