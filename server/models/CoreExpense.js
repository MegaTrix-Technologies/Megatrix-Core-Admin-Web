import mongoose from 'mongoose';

const coreExpenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Core Operating Expense',
    },
    reason: {
      type: String,
      trim: true,
      default: function () {
        return this.title || 'Core Operating Expense';
      },
    },
    category: {
      type: String,
      required: true,
      default: 'software_saas',
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    expenseDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    date: {
      type: Date,
      default: function () {
        return this.expenseDate || Date.now();
      },
      index: true,
    },
    paymentMethod: {
      type: String,
      default: 'Corporate Account',
    },
    vendor: {
      type: String,
      default: '',
      trim: true,
    },
    referenceNumber: {
      type: String,
      default: '',
      trim: true,
    },
    referenceId: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'paid', 'rejected'],
      default: 'approved',
      index: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
      index: true,
    },
    recurringInterval: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'one_time'],
      default: 'monthly',
    },
    recurrence: {
      type: String,
      default: 'one_time',
    },
    tags: {
      type: [String],
      default: [],
    },
    sourcePlatform: {
      type: String,
      default: 'core', // 'core' vs 'leadhunter'
      index: true,
    },
    createdBy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
      name: { type: String, default: 'Superadmin' },
      email: { type: String, default: 'admin.megatrix@gmail.com' },
    },
    updatedBy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
      name: { type: String, default: 'Superadmin' },
      email: { type: String, default: 'admin.megatrix@gmail.com' },
    },
  },
  { timestamps: true }
);

// Pre-save synchronization hook to ensure backwards and forwards compatibility
coreExpenseSchema.pre('save', function () {
  if (this.title && !this.reason) {
    this.reason = this.title;
  } else if (this.reason && !this.title) {
    this.title = this.reason;
  }
  if (this.expenseDate && !this.date) {
    this.date = this.expenseDate;
  } else if (this.date && !this.expenseDate) {
    this.expenseDate = this.date;
  }
  if (this.referenceNumber && !this.referenceId) {
    this.referenceId = this.referenceNumber;
  } else if (this.referenceId && !this.referenceNumber) {
    this.referenceNumber = this.referenceId;
  }
  if (this.isRecurring && this.recurrence === 'one_time') {
    this.recurrence = this.recurringInterval || 'monthly';
  }
});

coreExpenseSchema.index({ expenseDate: -1, category: 1 });
coreExpenseSchema.index({ date: -1, category: 1 });
coreExpenseSchema.index({ sourcePlatform: 1, expenseDate: -1 });

export const CoreExpense = mongoose.model('CoreExpense', coreExpenseSchema);
