import React, { useState, useEffect } from 'react';
import {
  Clock,
  AlertTriangle,
  ShieldAlert,
  Building2,
  Phone,
  User,
  Filter,
  DollarSign,
  Search,
  ExternalLink,
} from 'lucide-react';
import { accountsApi } from '../../../services/adminApi';
import { fmtPKR } from '../../../config/currency';

const ReceivablesAgingTab = ({ onOpenSaleDetail }) => {
  const [loading, setLoading] = useState(true);
  const [agingData, setAgingData] = useState(null);
  const [selectedBucket, setSelectedBucket] = useState('all');
  const [search, setSearch] = useState('');

  const fetchReceivables = async () => {
    setLoading(true);
    try {
      const res = await accountsApi.getReceivables();
      if (res.success) {
        setAgingData(res);
      }
    } catch (err) {
      console.error('[ReceivablesAgingTab] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivables();
  }, []);

  const fmt = fmtPKR;

  const buckets = agingData?.buckets || {};

  // Flatten and filter items
  const allItems = [];
  Object.keys(buckets).forEach((bKey) => {
    (buckets[bKey]?.items || []).forEach((item) => {
      allItems.push({ ...item, bucketKey: bKey });
    });
  });

  const filteredItems = allItems.filter((item) => {
    if (selectedBucket !== 'all' && item.bucketKey !== selectedBucket) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const client = (item.clientName || '').toLowerCase();
      const phone = (item.phone || '').toLowerCase();
      const closer = (item.closerName || '').toLowerCase();
      return client.includes(q) || phone.includes(q) || closer.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ─────────────────────────────────────────────────────────────
       * 1. 5-TIER AGING BUCKETS SCORECARD
       * ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { key: 'current', label: 'Current (On Schedule)', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
          { key: 'days1_30', label: '1 - 30 Days', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
          { key: 'days31_60', label: '31 - 60 Days', color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
          { key: 'days61_90', label: '61 - 90 Days', color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5' },
          { key: 'days90_plus', label: '90+ Days (High Risk)', color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10' },
        ].map((b) => {
          const bData = buckets[b.key] || { amount: 0, count: 0, percentage: 0 };
          const isSelected = selectedBucket === b.key;

          return (
            <button
              key={b.key}
              onClick={() => setSelectedBucket(isSelected ? 'all' : b.key)}
              className={`p-3.5 rounded-md border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'ring-2 ring-mx-blue bg-mx-panel border-mx-blue'
                  : `${b.bg} ${b.border} hover:bg-mx-panel`
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-mx-subtle uppercase truncate">
                  {b.label}
                </span>
                {b.key === 'days90_plus' && bData.count > 0 && (
                  <ShieldAlert size={14} className="text-red-400" />
                )}
              </div>
              <div className="my-2">
                <span className={`text-lg lg:text-xl font-bold font-mono block ${b.color}`}>
                  {fmt(bData.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-mx-subtle pt-1 border-t border-mx-border/40">
                <span>{bData.count} Unpaid Deals</span>
                <span>{bData.percentage}% of portfolio</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 2. CONTROLS & SEARCH BAR
       * ───────────────────────────────────────────────────────────── */}
      <div className="p-3 rounded-md bg-mx-panel border border-mx-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mx-subtle" />
          <input
            type="text"
            placeholder="Search overdue receivables by debtor, phone, or closer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-mx-surface border border-mx-border rounded-sm text-xs text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          {selectedBucket !== 'all' && (
            <button
              onClick={() => setSelectedBucket('all')}
              className="px-2.5 py-1.5 rounded-sm bg-mx-surface border border-mx-border text-[11px] font-mono text-mx-blue hover:text-white"
            >
              Clear Bucket Filter
            </button>
          )}
          <span className="text-xs font-mono text-mx-subtle px-2">
            Total Receivables: <b className="text-amber-400">{fmt(agingData?.totalReceivables)}</b>
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 3. RECEIVABLES AGING DATAGRID
       * ───────────────────────────────────────────────────────────── */}
      <div className="rounded-md bg-mx-panel border border-mx-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-mx-border bg-mx-surface text-mx-subtle font-mono">
                <th className="px-4 py-2.5">Sale ID</th>
                <th className="px-4 py-2.5">Debtor / Business</th>
                <th className="px-4 py-2.5">Contact Phone</th>
                <th className="px-4 py-2.5 text-right">Total Deal</th>
                <th className="px-4 py-2.5 text-right">Paid to Date</th>
                <th className="px-4 py-2.5 text-right">Outstanding Due</th>
                <th className="px-4 py-2.5 text-center">Days Overdue</th>
                <th className="px-4 py-2.5 text-center">Risk Score</th>
                <th className="px-4 py-2.5">Assigned Closer</th>
                <th className="px-4 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mx-border/50">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-mx-subtle font-mono">
                    Computing aging buckets from receivables ledger...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-mx-subtle font-mono">
                    No overdue receivables found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.saleId} className="hover:bg-mx-surface/60 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-mx-subtle">
                      #{String(item.saleId).slice(-6)}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-white font-medium block">{item.clientName}</span>
                      <span className="text-[10px] font-mono text-mx-subtle">{item.area || 'Lahore'}</span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-mx-subtle">{item.phone || 'N/A'}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-white">{fmt(item.totalAmount)}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-emerald-400">
                      {fmt(item.advanceAmount)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-amber-400 font-bold">
                      {fmt(item.remainingAmount)}
                    </td>
                    <td className="px-4 py-2.5 text-center font-mono font-bold text-white">
                      {item.daysOutstanding}d
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase ${
                          item.riskLevel === 'Critical'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : item.riskLevel === 'High'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : item.riskLevel === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-mx-subtle">{item.closerName}</td>
                    <td className="px-4 py-2.5 text-center">
                      <button
                        onClick={() => onOpenSaleDetail(item.saleId)}
                        className="px-2.5 py-1 rounded-sm bg-mx-surface border border-mx-border text-[11px] font-mono text-mx-blue hover:text-white transition-colors"
                      >
                        Dossier
                      </button>
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

export default ReceivablesAgingTab;
