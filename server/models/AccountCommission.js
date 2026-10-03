import mongoose from 'mongoose';

const accountCommissionSchema = new mongoose.Schema(
  {
    commissionNumber: {
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
    beneficiary: {
      userId: { type: String, required: true, index: true },
      name: { type: String, required: true },
      email: { type: String, default: '' },
      role: { type: String, default: 'Agent' },
    },
    saleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AccountSale',
      required: true,
      index: true,
    },
    saleNumber: { type: String, default: '' },
    clientName: { type: String, default: '' },
    saleAmount: { type: Number, required: true, min: 0 },
    roleType: {
      type: String,
      enum: ['lead_generator', 'sales_closer', 'developer', 'referral', 'other'],
      required: true,
      index: true,
    },
    percentage: { type: Number, default: 0, min: 0 },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['accrued', 'approved', 'paid', 'cancelled'],
      default: 'accrued',
      index: true,
    },
    paidAt: { type: Date, default: null },
    paymentReference: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const AccountCommission =
  mongoose.models.AccountCommission || mongoose.model('AccountCommission', accountCommissionSchema);
