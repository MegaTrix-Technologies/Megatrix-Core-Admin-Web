import mongoose from 'mongoose';

const accountSnapshotSchema = new mongoose.Schema(
  {
    sourcePlatform: {
      type: String,
      required: true,
      default: 'leadhunter',
      index: true
    },
    snapshotType: {
      type: String,
      enum: ['live_aggregate', 'daily_close', 'monthly_close', 'manual_sync'],
      default: 'live_aggregate',
      index: true
    },
    period: {
      preset: { type: String, default: 'all_time' },
      label: { type: String, default: 'All Time' },
      startDate: { type: Date },
      endDate: { type: Date }
    },
    metrics: {
      bookedSales: { type: Number, default: 0 },
      realizedSales: { type: Number, default: 0 },
      pendingReceivables: { type: Number, default: 0 },
      totalOtherIncome: { type: Number, default: 0 },
      totalInvestment: { type: Number, default: 0 },
      totalExpenses: { type: Number, default: 0 },
      totalCommissionLiability: { type: Number, default: 0 },
      realizedNetProfit: { type: Number, default: 0 },
      realizedProfitMargin: { type: Number, default: 0 },
      projectedNetProfit: { type: Number, default: 0 },
      projectedProfitMargin: { type: Number, default: 0 },
      netCashFlow: { type: Number, default: 0 }
    },
    recordCounts: {
      salesCount: { type: Number, default: 0 },
      projectsCount: { type: Number, default: 0 },
      inflowsCount: { type: Number, default: 0 },
      expensesCount: { type: Number, default: 0 },
      agentsCount: { type: Number, default: 0 }
    },
    syncId: {
      type: String,
      default: null,
      index: true
    }
  },
  { timestamps: true }
);

accountSnapshotSchema.index({ sourcePlatform: 1, createdAt: -1 });

export const AccountSnapshot = mongoose.model('AccountSnapshot', accountSnapshotSchema);
