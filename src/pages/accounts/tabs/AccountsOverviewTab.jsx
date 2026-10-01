import React from 'react';
import MetricCard from '../../../components/MetricCard';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  ShieldCheck,
} from 'lucide-react';

const AccountsOverviewTab = ({
  overviewData,
  basisView = 'dual', // 'dual', 'cash', 'accrual'
  onSelectTab,
  onOpenAdjustment,
}) => {
  if (!overviewData) {
    return (
      <div className="py-16 text-center text-mx-subtle text-xs font-mono">
        Loading financial telemetry...
      </div>
    );
  }

  const { summary, aging, expenseBreakdown, commissionSummary, projectsSummary, reconciliationSummary } =
    overviewData;

  const cash = summary?.cashBasis || {};
  const accrual = summary?.accrualBasis || {};
  const cost = summary?.consolidatedCost || {};

  const fmt = (num = 0) =>
    `$${Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ─────────────────────────────────────────────────────────────
       * 1. TOP DUAL-BASIS SCORECARD METRICS
       * ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Realized Cash Inflow */}
        <div className="p-4 rounded-md bg-mx-panel border border-mx-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-mx-subtle uppercase tracking-wider font-mono">
              Realized Cash Inflow
            </span>
            <div className="w-8 h-8 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="my-3">
            <span className="font-mono text-2xl lg:text-3xl font-bold text-emerald-400 block">
              {fmt(cash.totalCashInflow)}
            </span>
            <span className="text-[11px] font-mono text-mx-subtle">
              Sales: {fmt(cash.realizedSalesInflow)} | Other: {fmt(cash.totalOtherIncome)}
            </span>
          </div>
          <div className="pt-2 border-t border-mx-border/60 flex items-center justify-between text-[11px] text-mx-subtle font-mono">
            <span>Basis: Cash Received</span>
            <span className="text-emerald-400 font-bold">{summary?.counts?.inflowsCount || 0} Inflows</span>
          </div>
        </div>

        {/* Accrued Booked Sales Revenue */}
        <div className="p-4 rounded-md bg-mx-panel border border-mx-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-mx-subtle uppercase tracking-wider font-mono">
              Booked Contract Revenue
            </span>
            <div className="w-8 h-8 rounded-sm bg-mx-blue/10 border border-mx-blue/20 flex items-center justify-center text-mx-blue">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="my-3">
            <span className="font-mono text-2xl lg:text-3xl font-bold text-white block">
              {fmt(accrual.bookedSales)}
            </span>
            <span className="text-[11px] font-mono text-amber-400">
              Receivables Due: {fmt(accrual.pendingReceivables)}
            </span>
          </div>
          <div className="pt-2 border-t border-mx-border/60 flex items-center justify-between text-[11px] text-mx-subtle font-mono">
            <span>Basis: Accrual Bookings</span>
            <span className="text-white font-bold">{summary?.counts?.salesCount || 0} Contracts</span>
          </div>
        </div>

        {/* Consolidated Operating Expenses */}
        <div className="p-4 rounded-md bg-mx-panel border border-mx-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-mx-subtle uppercase tracking-wider font-mono">
              Consolidated Expenses
            </span>
            <div className="w-8 h-8 rounded-sm bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Receipt size={16} />
            </div>
          </div>
          <div className="my-3">
            <span className="font-mono text-2xl lg:text-3xl font-bold text-red-400 block">
              {fmt(cost.totalCost)}
            </span>
            <span className="text-[11px] font-mono text-mx-subtle">
              OpEx: {fmt((cost.leadHunterExpenses || 0) + (cost.coreExpenses || 0))} | Comm: {fmt(cost.commissions || 0)}
            </span>
          </div>
          <div className="pt-2 border-t border-mx-border/60 flex items-center justify-between text-[11px] text-mx-subtle font-mono">
            <span>Core + LeadHunter</span>
            <span className="text-red-400 font-bold">
              {(summary?.counts?.lhExpensesCount || 0) + (summary?.counts?.coreExpensesCount || 0)} Items
            </span>
          </div>
        </div>

        {/* Realized Net Profit */}
        <div className="p-4 rounded-md bg-mx-panel border border-mx-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-mx-subtle uppercase tracking-wider font-mono">
              Realized Net Profit
            </span>
            <div
              className={`w-8 h-8 rounded-sm flex items-center justify-center ${
                cash.realizedNetProfit >= 0
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}
            >
              {cash.realizedNetProfit >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            </div>
          </div>
          <div className="my-3">
            <span
              className={`font-mono text-2xl lg:text-3xl font-bold block ${
                cash.realizedNetProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {fmt(cash.realizedNetProfit)}
            </span>
            <span className="text-[11px] font-mono text-mx-subtle">
              Realized Margin: <b className="text-white">{cash.realizedProfitMargin || 0}%</b>
            </span>
          </div>
          <div className="pt-2 border-t border-mx-border/60 flex items-center justify-between text-[11px] text-mx-subtle font-mono">
            <span>Projected Margin:</span>
            <span className="text-mx-blue font-bold">{accrual.projectedProfitMargin || 0}%</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 2. DUAL-BASIS COMPARISON STRIP
       * ───────────────────────────────────────────────────────────── */}
      <div className="p-5 rounded-md bg-mx-panel border border-mx-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-mx-border">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Dual-Basis Accounting Paradigm
            </h3>
            <p className="text-[11px] text-mx-subtle">
              Side-by-side reconciliation of Realized Cash Inflow vs Accrued Contract Bookings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Cash Inflow: {fmt(cash.totalCashInflow)}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Accrual Bookings: {fmt(accrual.bookedSales)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Cash Basis Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between font-mono font-bold text-emerald-400 pb-1 border-b border-mx-border/50">
              <span>CASH BASIS (REALIZED CAPITAL)</span>
              <span>AMOUNT</span>
            </div>
            <div className="flex justify-between py-1 text-mx-subtle">
              <span>Realized Sales Cash Inflow</span>
              <span className="text-white font-mono">{fmt(cash.realizedSalesInflow)}</span>
            </div>
            <div className="flex justify-between py-1 text-mx-subtle">
              <span>Other Operating Income</span>
              <span className="text-white font-mono">{fmt(cash.totalOtherIncome)}</span>
            </div>
            <div className="flex justify-between py-1 text-mx-subtle">
              <span>Less: Operating Expenses (LeadHunter + Core)</span>
              <span className="text-red-400 font-mono">-{fmt(cash.totalOperatingExpenses)}</span>
            </div>
            <div className="flex justify-between py-1 text-mx-subtle">
              <span>Less: Attributed Commissions</span>
              <span className="text-purple-400 font-mono">-{fmt(cash.totalCommissionCost)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-mx-border font-mono font-bold">
              <span className="text-white">Realized Net Operating Profit</span>
              <span className={cash.realizedNetProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                {fmt(cash.realizedNetProfit)} ({cash.realizedProfitMargin}%)
              </span>
            </div>
          </div>

          {/* Accrual Basis Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between font-mono font-bold text-mx-blue pb-1 border-b border-mx-border/50">
              <span>ACCRUAL BASIS (CONTRACTED REVENUE)</span>
              <span>AMOUNT</span>
            </div>
            <div className="flex justify-between py-1 text-mx-subtle">
              <span>Total Contract Bookings (Sales)</span>
              <span className="text-white font-mono">{fmt(accrual.bookedSales)}</span>
            </div>
            <div className="flex justify-between py-1 text-mx-subtle">
              <span>Other Operating Income</span>
              <span className="text-white font-mono">{fmt(accrual.totalOtherIncome)}</span>
            </div>
            <div className="flex justify-between py-1 text-mx-subtle">
              <span>Less: Total Operating Expenses</span>
              <span className="text-red-400 font-mono">-{fmt(accrual.totalOperatingExpenses)}</span>
            </div>
            <div className="flex justify-between py-1 text-mx-subtle">
              <span>Less: Accrued Commission Liabilities</span>
              <span className="text-purple-400 font-mono">-{fmt(accrual.totalCommissionLiability)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-mx-border font-mono font-bold">
              <span className="text-white">Projected / Accrual Net Profit</span>
              <span className={accrual.projectedNetProfit >= 0 ? 'text-mx-blue' : 'text-red-400'}>
                {fmt(accrual.projectedNetProfit)} ({accrual.projectedProfitMargin}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 3. RECEIVABLES AGING BUCKETS PREVIEW
       * ───────────────────────────────────────────────────────────── */}
      <div className="p-5 rounded-md bg-mx-panel border border-mx-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Clock size={14} className="text-amber-400" /> Receivables Aging Portfolio ({fmt(aging?.totalReceivables)})
            </h3>
            <p className="text-[11px] text-mx-subtle">
              5-Tier overdue aging analysis across outstanding CRM client contracts
            </p>
          </div>
          <button
            onClick={() => onSelectTab('receivables')}
            className="text-[11px] font-mono text-mx-blue hover:underline flex items-center gap-1"
          >
            View Full Aging Ledger &rarr;
          </button>
        </div>

        {/* 5 Buckets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {aging?.buckets &&
            [
              { key: 'current', label: 'Current (0d)', color: 'text-emerald-400', bg: 'border-emerald-500/20' },
              { key: 'days1_30', label: '1-30 Days', color: 'text-blue-400', bg: 'border-blue-500/20' },
              { key: 'days31_60', label: '31-60 Days', color: 'text-amber-400', bg: 'border-amber-500/20' },
              { key: 'days61_90', label: '61-90 Days', color: 'text-orange-400', bg: 'border-orange-500/20' },
              { key: 'days90_plus', label: '90+ Days (High Risk)', color: 'text-red-400', bg: 'border-red-500/20' },
            ].map((b) => {
              const bData = aging.buckets[b.key] || { amount: 0, count: 0, percentage: 0 };
              return (
                <div
                  key={b.key}
                  className={`p-3 rounded-md bg-mx-surface border ${b.bg} flex flex-col justify-between`}
                >
                  <span className="text-[10px] font-mono text-mx-subtle uppercase block truncate">
                    {b.label}
                  </span>
                  <span className={`text-base font-bold font-mono mt-1 ${b.color}`}>
                    {fmt(bData.amount)}
                  </span>
                  <div className="flex items-center justify-between text-[10px] font-mono text-mx-subtle mt-2 pt-1 border-t border-mx-border/40">
                    <span>{bData.count} Deals</span>
                    <span>{bData.percentage}%</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 4. GRID: EXPENSE DISTRIBUTION & AGENT COMMISSIONS
       * ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Consolidated Expense Categories */}
        <div className="p-4 rounded-md bg-mx-panel border border-mx-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Receipt size={14} className="text-mx-subtle" /> Expense Distribution ({fmt(expenseBreakdown?.totalExpenses)})
            </h3>
            <button
              onClick={() => onSelectTab('expenses')}
              className="text-[10px] font-mono text-mx-blue hover:underline"
            >
              Manage OpEx &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {expenseBreakdown?.categorySummary?.length === 0 ? (
              <div className="py-6 text-center text-mx-subtle text-xs font-mono">
                No categorized operating expenses recorded.
              </div>
            ) : (
              expenseBreakdown?.categorySummary?.slice(0, 5).map((cat) => (
                <div key={cat.key} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-mx-subtle">{cat.label}</span>
                    <span className="text-white font-bold">
                      {fmt(cat.total)} <span className="text-mx-subtle text-[10px]">({cat.percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-mx-surface overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full"
                      style={{ width: `${Math.min(100, cat.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Agent Commissions */}
        <div className="p-4 rounded-md bg-mx-panel border border-mx-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Users size={14} className="text-mx-subtle" /> Top Agent Commissions ({fmt(commissionSummary?.totalLiability)})
            </h3>
            <button
              onClick={() => onSelectTab('commissions')}
              className="text-[10px] font-mono text-mx-blue hover:underline"
            >
              Commissions Desk &rarr;
            </button>
          </div>

          <div className="divide-y divide-mx-border/50">
            {commissionSummary?.topAgents?.length === 0 ? (
              <div className="py-6 text-center text-mx-subtle text-xs font-mono">
                No active sales commissions recorded.
              </div>
            ) : (
              commissionSummary?.topAgents?.map((ag) => (
                <div key={ag.userId} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-medium block">{ag.name}</span>
                    <span className="text-[10px] font-mono text-mx-subtle">
                      {ag.dealsCount} closed deals | {Array.isArray(ag.roles) ? ag.roles.join(', ') : 'Closer'}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-purple-400 font-bold block">{fmt(ag.totalEarnings)}</span>
                    <span className="text-[10px] text-mx-subtle">Direct: {fmt(ag.directEarnings)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 5. RECONCILIATION & DISCREPANCY HEALTH CHECK BANNER
       * ───────────────────────────────────────────────────────────── */}
      <div
        className={`p-4 rounded-md border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          reconciliationSummary?.criticalCount > 0
            ? 'bg-red-500/10 border-red-500/30'
            : reconciliationSummary?.totalDiscrepancies > 0
            ? 'bg-amber-500/10 border-amber-500/30'
            : 'bg-emerald-500/10 border-emerald-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-sm flex items-center justify-center ${
              reconciliationSummary?.criticalCount > 0
                ? 'bg-red-500/20 text-red-400'
                : reconciliationSummary?.totalDiscrepancies > 0
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            {reconciliationSummary?.totalDiscrepancies > 0 ? (
              <AlertTriangle size={18} />
            ) : (
              <ShieldCheck size={18} />
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase font-mono">
              Reconciliation Health: {reconciliationSummary?.totalDiscrepancies || 0} Anomalies Detected
            </h4>
            <p className="text-[11px] text-mx-subtle">
              {reconciliationSummary?.criticalCount > 0
                ? `${reconciliationSummary.criticalCount} Critical Ledger Mismatch(es) requiring immediate resolution.`
                : 'All CRM sales, payment transactions, and contract allocations are in balance.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('reconciliation')}
            className="px-3 py-1.5 rounded-sm bg-mx-surface border border-mx-border text-xs text-white hover:bg-mx-panel transition-colors font-mono"
          >
            Run Audit Scanner
          </button>
          <button
            onClick={onOpenAdjustment}
            className="px-3 py-1.5 rounded-sm bg-amber-500 text-xs font-bold text-black hover:bg-amber-400 transition-colors font-mono"
          >
            + Post Adjustment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountsOverviewTab;
