import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  CreditCard,
  Building2,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { accountsApi } from '../../../services/adminApi';
import DarkDateRangePicker from '../../../components/common/DarkDateRangePicker';
import { fmtPKR } from '../../../config/currency';

const InflowsLedgerTab = () => {
  const [loading, setLoading] = useState(true);
  const [inflowData, setInflowData] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ preset: 'all_time', startDate: '', endDate: '' });

  const fetchInflows = async () => {
    setLoading(true);
    try {
      const res = await accountsApi.getInflows({
        type: typeFilter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      if (res.success) {
        setInflowData(res);
      }
    } catch (err) {
      console.error('[InflowsLedgerTab] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInflows();
  }, [typeFilter, dateRange]);

  const fmt = fmtPKR;

  const inflows = inflowData?.inflows || [];
  const methodDist = inflowData?.methodDistribution || {};

  const filteredInflows = inflows.filter((inf) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (inf.title || '').toLowerCase().includes(q) ||
      (inf.description || '').toLowerCase().includes(q) ||
      String(inf._id || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ─────────────────────────────────────────────────────────────
       * 1. INFLOW STATS & METHOD DISTRIBUTION
       * ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Total Realized Inflows
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
            {fmt(inflowData?.totalAmount)}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">
            {inflowData?.count || 0} Total verified inflow transactions
          </span>
        </div>

        <div className="p-4 rounded-md bg-mx-panel border border-mx-border md:col-span-2 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block mb-2">
            Payment Channels & Deposit Distribution
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.keys(methodDist).length === 0 ? (
              <span className="text-xs text-mx-subtle font-mono">No transaction methods recorded</span>
            ) : (
              Object.entries(methodDist).map(([method, amt]) => (
                <div
                  key={method}
                  className="px-3 py-1.5 rounded-sm bg-mx-surface border border-mx-border text-xs flex items-center gap-2"
                >
                  <CreditCard size={12} className="text-mx-blue" />
                  <span className="text-white font-medium">{method}:</span>
                  <span className="text-emerald-400 font-mono font-bold">{fmt(amt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 2. CONTROLS & SEARCH BAR
       * ───────────────────────────────────────────────────────────── */}
      <div className="p-3 rounded-md bg-mx-panel border border-mx-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mx-subtle" />
          <input
            type="text"
            placeholder="Search inflows by description, reference, or TX ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-mx-surface border border-mx-border rounded-sm text-xs text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DarkDateRangePicker
            preset={dateRange.preset}
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onApplyRange={(range) => setDateRange(range)}
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-mx-surface border border-mx-border rounded-sm text-xs text-white font-mono focus:outline-none focus:border-mx-blue"
          >
            <option value="all">All Inflow Types</option>
            <option value="sales_advance">Sales Advance</option>
            <option value="project_payment">Project Payment</option>
            <option value="other_income">Other Operating Income</option>
            <option value="investment">Capital Investment</option>
          </select>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 3. INFLOWS DATAGRID
       * ───────────────────────────────────────────────────────────── */}
      <div className="rounded-md bg-mx-panel border border-mx-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left" data-testid="inflows-table">
            <thead>
              <tr className="border-b border-mx-border bg-mx-surface text-mx-subtle font-mono">
                <th className="px-4 py-2.5">TX ID</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Description / Memo</th>
                <th className="px-4 py-2.5">Payment Method</th>
                <th className="px-4 py-2.5 text-right">Amount</th>
                <th className="px-4 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mx-border/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-mx-subtle font-mono">
                    Querying cash inflows telemetry...
                  </td>
                </tr>
              ) : filteredInflows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-mx-subtle font-mono">
                    No cash inflow records found.
                  </td>
                </tr>
              ) : (
                filteredInflows.map((inf) => (
                  <tr key={inf._id} className="hover:bg-mx-surface/60 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-mx-subtle">
                      #{String(inf._id).slice(-6)}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-mx-subtle whitespace-nowrap">
                      {inf.date ? new Date(inf.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase bg-mx-surface text-mx-subtle border border-mx-border">
                        {inf.type?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-white font-medium">
                      {inf.title || inf.description || 'Cash Inflow'}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-mx-subtle">
                      {inf.paymentMethod || 'Bank Transfer'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-emerald-400">
                      {fmt(inf.amount)}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {inf.status || 'completed'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InflowsLedgerTab;
