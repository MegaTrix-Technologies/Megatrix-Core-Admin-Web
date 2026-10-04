import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
} from 'lucide-react';
import { accountsApi } from '../../../services/adminApi';
import { fmtPKR } from '../../../config/currency';

const CashFlowTab = () => {
  const [loading, setLoading] = useState(true);
  const [cashFlowData, setCashFlowData] = useState(null);

  const fetchCashFlow = async () => {
    setLoading(true);
    try {
      const res = await accountsApi.getCashFlow();
      if (res.success) {
        setCashFlowData(res.cashFlow);
      }
    } catch (err) {
      console.error('[CashFlowTab] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashFlow();
  }, []);

  const fmt = fmtPKR;

  if (loading) {
    return (
      <div className="py-16 text-center text-mx-subtle text-xs font-mono">
        Compiling Direct Cash Flow Statement...
      </div>
    );
  }

  if (!cashFlowData) {
    return (
      <div className="py-16 text-center text-mx-subtle text-xs font-mono">
        No cash flow data available.
      </div>
    );
  }

  const { operatingActivities, financingActivities, netCashChange } = cashFlowData;

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────
       * 1. TOP CASH CHANGE SCORECARD
       * ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Net Cash Flow from Operations
          </span>
          <span
            className={`text-2xl font-bold font-mono mt-1 block ${
              operatingActivities?.netOperatingCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {fmt(operatingActivities?.netOperatingCashFlow)}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">Core Operating Velocity</span>
        </div>

        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Financing & Capital Activities
          </span>
          <span className="text-2xl font-bold font-mono text-mx-blue mt-1 block">
            {fmt(financingActivities?.netFinancingCashFlow)}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">Investments & Adjustments</span>
        </div>

        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Net Liquid Cash Change
          </span>
          <span
            className={`text-2xl font-bold font-mono mt-1 block ${
              netCashChange >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {fmt(netCashChange)}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">Total Liquid Delta</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 2. DIRECT CASH FLOW STATEMENT TABLE
       * ───────────────────────────────────────────────────────────── */}
      <div className="rounded-md bg-mx-panel border border-mx-border overflow-hidden p-6 space-y-6" data-testid="cash-flow-statement-container">
        <div className="border-b border-mx-border pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Direct Method Cash Flow Statement
            </h3>
            <p className="text-xs text-mx-subtle">
              Consolidated real cash movement across company bank accounts & gateways
            </p>
          </div>
        </div>

        {/* SECTION 1: OPERATING ACTIVITIES */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400 border-b border-mx-border pb-1">
            <span>1. CASH FLOWS FROM OPERATING ACTIVITIES</span>
            <span>AMOUNT (PKR)</span>
          </div>
          <div className="flex justify-between text-xs py-1 text-mx-subtle pl-4">
            <span>Cash Receipts from Customer Sales Advances & Inflows</span>
            <span className="text-emerald-400 font-mono">
              +{fmt(operatingActivities?.salesAdvancesReceived || operatingActivities?.cashFromSales || 0)}
            </span>
          </div>
          <div className="flex justify-between text-xs py-1 text-mx-subtle pl-4">
            <span>Other Operating Income Receipts</span>
            <span className="text-emerald-400 font-mono">
              +{fmt(operatingActivities?.otherOperatingInflows || operatingActivities?.otherIncome || 0)}
            </span>
          </div>
          <div className="flex justify-between text-xs py-1 text-mx-subtle pl-4">
            <span>Cash Paid to Vendors, SaaS, Office & Infrastructure</span>
            <span className="text-red-400 font-mono">
              {fmt(operatingActivities?.operatingExpensesPaid || operatingActivities?.operatingExpenses || 0)}
            </span>
          </div>
          <div className="flex justify-between text-xs py-1 text-mx-subtle pl-4">
            <span>Cash Paid for Sales & Developer Commissions</span>
            <span className="text-red-400 font-mono">
              {fmt(operatingActivities?.commissionsPaid || operatingActivities?.commissionPayouts || 0)}
            </span>
          </div>
          <div className="flex justify-between text-xs py-2 border-t border-mx-border/60 font-mono font-bold pl-2 bg-mx-surface/40">
            <span className="text-white">NET CASH GENERATED BY OPERATING ACTIVITIES</span>
            <span className={(operatingActivities?.netOperatingCashFlow || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              {fmt(operatingActivities?.netOperatingCashFlow || 0)}
            </span>
          </div>
        </div>

        {/* SECTION 2: FINANCING ACTIVITIES */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-mx-blue border-b border-mx-border pb-1">
            <span>2. CASH FLOWS FROM FINANCING & CAPITAL ACTIVITIES</span>
            <span>AMOUNT (PKR)</span>
          </div>
          <div className="flex justify-between text-xs py-1 text-mx-subtle pl-4">
            <span>Capital Investment & Partner Injections</span>
            <span className="text-white font-mono">
              +{fmt(financingActivities?.investmentCapitalInflows || financingActivities?.capitalInjections || 0)}
            </span>
          </div>
          <div className="flex justify-between text-xs py-1 text-mx-subtle pl-4">
            <span>Administrative Reconciliation Adjustments</span>
            <span className="text-white font-mono">
              {fmt(financingActivities?.administrativeAdjustments || financingActivities?.adjustments || 0)}
            </span>
          </div>
          <div className="flex justify-between text-xs py-2 border-t border-mx-border/60 font-mono font-bold pl-2 bg-mx-surface/40">
            <span className="text-white">NET CASH FROM FINANCING ACTIVITIES</span>
            <span className="text-mx-blue">{fmt(financingActivities?.netFinancingCashFlow || 0)}</span>
          </div>
        </div>

        {/* NET CASH CHANGE HIGHLIGHT */}
        <div
          className={`p-4 rounded-md border flex items-center justify-between font-mono font-bold text-sm ${
            netCashChange >= 0
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'bg-red-500/20 border-red-500/40 text-red-400'
          }`}
        >
          <span className="text-white uppercase">NET INCREASE / (DECREASE) IN CASH IN HAND</span>
          <span className="text-lg">{fmt(netCashChange)}</span>
        </div>
      </div>
    </div>
  );
};

export default CashFlowTab;
