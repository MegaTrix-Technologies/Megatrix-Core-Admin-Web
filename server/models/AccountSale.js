import mongoose from 'mongoose';

const paymentItemSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    paymentMethod: { type: String, default: 'Bank Transfer' },
    referenceNote: { type: String, default: '' },
    recordedBy: { type: String, default: 'Admin' },
  },
  { _id: true }
);

const productItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
  },
  { _id: false }
);

const accountSaleSchema = new mongoose.Schema(
  {
    saleNumber: {
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
    customer: {
      businessName: { type: String, required: true, trim: true },
      contactPerson: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      city: { type: String, default: 'Lahore' },
      area: { type: String, default: '' },
      category: { type: String, default: 'General' },
    },
    products: [productItemSchema],
    totalAmount: { type: Number, required: true, min: 0, index: true },
    advanceAmount: { type: Number, default: 0, min: 0 },
    remainingAmount: { type: Number, default: 0, min: 0, index: true },
    status: {
      type: String,
      enum: [
        'draft',
        'contract_signed',
        'advance_paid',
        'partial_payment',
        'payment_completed',
        'defaulted',
        'cancelled',
        'refunded',
      ],
      default: 'contract_signed',
      index: true,
    },
    paymentMethod: { type: String, default: 'Bank Transfer' },
    payments: [paymentItemSchema],

    // Attribution
    leadGeneratedBy: {
      id: { type: String, default: null },
      name: { type: String, default: 'Sales Desk' },
      email: { type: String, default: '' },
    },
    closedBy: {
      id: { type: String, default: null },
      name: { type: String, default: 'Super Admin' },
      email: { type: String, default: '' },
    },
    assignedDevelopers: [
      {
        id: { type: String, default: null },
        name: { type: String, default: '' },
        role: { type: String, default: 'Developer' },
      },
    ],
    referralPartner: {
      id: { type: String, default: null },
      name: { type: String, default: '' },
      email: { type: String, default: '' },
    },

    // Project Delivery Link
    projectId: { type: String, default: null, index: true },
    projectName: { type: String, default: '' },
    isProjectDelivered: { type: Boolean, default: false, index: true },
    deliveredAt: { type: Date, default: null },

    // Commission Rates Snapshot (at deal close)
    commissionRates: {
      leadGenPercent: { type: Number, default: 10 },
      closerPercent: { type: Number, default: 15 },
      developerPercent: { type: Number, default: 20 },
      referralPercent: { type: Number, default: 0 },
    },
    estimatedCommission: { type: Number, default: 0 },

    closedAt: { type: Date, default: Date.now, index: true },
    dueDate: { type: Date, default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Pre-save calculation helper
accountSaleSchema.pre('save', function () {
  if (this.totalAmount !== undefined && this.advanceAmount !== undefined) {
    this.remainingAmount = Math.max(0, this.totalAmount - this.advanceAmount);
    if (this.status !== 'defaulted' && this.status !== 'cancelled' && this.status !== 'refunded') {
      if (this.remainingAmount === 0 && this.totalAmount > 0) {
        this.status = 'payment_completed';
      } else if (this.advanceAmount > 0) {
        this.status = 'partial_payment';
      } else if (!this.status || this.status === 'draft') {
        this.status = 'contract_signed';
      }
    }
  }
});

export const AccountSale = mongoose.models.AccountSale || mongoose.model('AccountSale', accountSaleSchema);
