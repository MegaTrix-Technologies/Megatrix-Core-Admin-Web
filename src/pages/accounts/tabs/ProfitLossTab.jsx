import React, { useState, useEffect } from 'react';
import {
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react';
import { accountsApi } from '../../../services/adminApi';
import { fmtPKR } from '../../../config/currency';

const ProfitLossTab = () => {
  const [loading, setLoading] = useState(true);
  const [pnlData, setPnlData] = useState(null);

  const fetchPnl = async () => {
    setLoading(true);
    try {
      const res = await accountsApi.getProfitLoss();
      if (res.success) {
        setPnlData(res.statement);
      }
    } catch (err) {
      console.error('[ProfitLossTab] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPnl();
  }, []);

  const fmt = fmtPKR;

  if (loading) {
    return (
      <div className="py-16 text-center text-mx-subtle text-xs font-mono">
        Generating Profit & Loss statement from synchronized ledgers...
      </div>
    );
  }

  if (!pnlData) {
    return (
      <div className="py-16 text-center text-mx-subtle text-xs font-mono">
        No financial data available for statement compilation.
      </div>
    );
  }

  const { revenue, costOfDelivery, grossProfit, grossMarginPercent, operatingExpenses, totalOperatingExpenses, operatingProfit, netProfitMarginPercent, accrualComparison } =
    pnlData;

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────
       * 1. TOP P&L SCORECARD
       * ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Total Operating Revenue
          </span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">
            {fmt(revenue?.totalRevenue)}
          </span>
          <span className="text-[10px] font-mono text-emerald-400">Cash Realized Inflows</span>
        </div>

        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Gross Margin
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
            {fmt(grossProfit)}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">
            Gross Margin: <b className="text-white">{grossMarginPercent}%</b>
          </span>
        </div>

        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Realized Net Profit
          </span>
          <span
            className={`text-2xl font-bold font-mono mt-1 block ${
              operatingProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {fmt(operatingProfit)}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">
            Net Margin: <b className="text-white">{netProfitMarginPercent}%</b>
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 2. FORMAL P&L STATEMENT TABLE
       * ───────────────────────────────────────────────────────────── */}
      <div className="rounded-md bg-mx-panel border border-mx-border overflow-hidden p-6 space-y-6">
        <div className="border-b border-mx-border pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Consolidated Statement of Profit & Loss
            </h3>
            <p className="text-xs text-mx-subtle">
              MegaTrix Global Command Center (Standardized Cash Basis with Accrual Bridge)
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-1 rounded-sm bg-mx-surface border border-mx-border text-mx-subtle">
            All Time Consolidated
          </span>
        </div>

        {/* SECTION 1: REVENUE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400 border-b border-mx-border pb-1">
            <span>1. OPERATING REVENUE</span>
            <span>REALIZED (PKR)</span>
          </div>
          <div className="flex justify-between text-xs py-1 text-mx-subtle pl-4">
            <span>Sales & Contract Cash Inflows (Advances / Collected)</span>
            <span className="text-white font-mono">{fmt(revenue?.realizedSales)}</span>
          </div>
          <div className="flex justify-between text-xs py-1 text-mx-subtle pl-4">
            <span>Direct Project Delivery Inflows</span>
            <span className="text-white font-mono">{fmt(revenue?.projectPayments)}</span>
          </div>
          <div className="flex justify-between text-xs py-1 text-mx-subtle pl-4">
            <span>Other Ancillary Income</span>
            <span className="text-white font-mono">{fmt(revenue?.otherIncome)}</span>
          </div>
          <div className="flex justify-between text-xs py-1.5 border-t border-mx-border/60 font-mono font-bold pl-2 bg-mx-surface/40">
            <span className="text-white">TOTAL OPERATING REVENUE</span>
            <span className="text-emerald-400">{fmt(revenue?.totalRevenue)}</span>
          </div>
        </div>

        {/* SECTION 2: COST OF DELIVERY / COMMISSIONS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-400 border-b border-mx-border pb-1">
            <span>2. COST OF SALES & AGENT COMMISSIONS</span>
            <span>AMOUNT (PKR)</span>
          </div>
          <div className="flex justify-between text-xs py-1 text-mx-subtle pl-4">
            <span>Sales Closer, Setter & Developer Commissions</span>
            <span className="text-purple-400 font-mono">{fmt(costOfDelivery?.commissionLiabilities)}</span>
          </div>
          <div className="flex justify-between text-xs py-1.5 border-t border-mx-border/60 font-mono font-bold pl-2 bg-mx-surface/40">
            <span className="text-white">TOTAL COST OF DELIVERY</span>
            <span className="text-purple-400">{fmt(costOfDelivery?.totalCOGS)}</span>
          </div>
        </div>

        {/* GROSS PROFIT HIGHLIGHT */}
        <div className="p-3 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between font-mono font-bold text-xs">
          <span className="text-white">GROSS PROFIT (REVENUE LESS COMMISSIONS)</span>
          <span className="text-emerald-400 text-sm">
            {fmt(grossProfit)} ({grossMarginPercent}%)
          </span>
        </div>

        {/* SECTION 3: OPERATING EXPENSES */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-red-400 border-b border-mx-border pb-1">
            <span>3. OPERATING EXPENSES (OpEx)</span>
            <span>AMOUNT (PKR)</span>
          </div>
          {operatingExpenses?.map((cat) => (
            <div key={cat.key} className="flex justify-between text-xs py-1 text-mx-subtle pl-4">
              <span>{cat.label}</span>
              <span className="text-white font-mono">{fmt(cat.total)}</span>
            </div>
          ))}
          <div className="flex justify-between text-xs py-1.5 border-t border-mx-border/60 font-mono font-bold pl-2 bg-mx-surface/40">
            <span className="text-white">TOTAL OPERATING EXPENSES</span>
            <span className="text-red-400">{fmt(totalOperatingExpenses)}</span>
          </div>
        </div>

        {/* SECTION 4: NET OPERATING PROFIT */}
        <div
          className={`p-4 rounded-md border flex items-center justify-between font-mono font-bold text-sm ${
            operatingProfit >= 0
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'bg-red-500/20 border-red-500/40 text-red-400'
          }`}
        >
          <span className="text-white uppercase">REALIZED NET OPERATING PROFIT</span>
          <span className="text-lg">
            {fmt(operatingProfit)} <span className="text-xs">({netProfitMarginPercent}% Margin)</span>
          </span>
        </div>

        {/* SECTION 5: ACCRUAL BASIS RECONCILIATION BRIDGE */}
        {accrualComparison && (
          <div className="p-4 rounded-sm bg-mx-surface border border-mx-border space-y-2">
            <h5 className="text-[11px] font-bold text-white uppercase font-mono text-mx-blue">
              Accrual Basis Contract Booking Bridge
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-mx-panel border border-mx-border">
                <span className="text-[10px] text-mx-subtle block">Contract Bookings</span>
                <span className="text-white font-bold">{fmt(accrualComparison.totalBookedRevenue)}</span>
              </div>
              <div className="p-2 rounded bg-mx-panel border border-mx-border">
                <span className="text-[10px] text-mx-subtle block">Uncollected Receivables</span>
                <span className="text-amber-400 font-bold">{fmt(accrualComparison.uncollectedReceivables)}</span>
              </div>
              <div className="p-2 rounded bg-mx-panel border border-mx-border">
                <span className="text-[10px] text-mx-subtle block">Projected Accrual Profit</span>
                <span className="text-mx-blue font-bold">{fmt(accrualComparison.projectedNetProfit)} ({accrualComparison.projectedProfitMargin}%)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfitLossTab;
