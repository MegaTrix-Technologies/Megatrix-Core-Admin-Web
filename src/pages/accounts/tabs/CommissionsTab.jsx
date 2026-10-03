import React, { useState, useEffect } from 'react';
import {
  Users,
  Percent,
  DollarSign,
  Briefcase,
  TrendingUp,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { accountsApi } from '../../../services/adminApi';
import { fmtPKR } from '../../../config/currency';

const CommissionsTab = ({ onOpenSaleDetail }) => {
  const [loading, setLoading] = useState(true);
  const [commissionData, setCommissionData] = useState(null);
  const [search, setSearch] = useState('');
  const [expandedAgentId, setExpandedAgentId] = useState(null);

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const res = await accountsApi.getCommissions();
      if (res.success) {
        setCommissionData(res);
      }
    } catch (err) {
      console.error('[CommissionsTab] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fmt = fmtPKR;

  const agents = commissionData?.agents || [];
  const filteredAgents = agents.filter((ag) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (ag.name || '').toLowerCase().includes(q) ||
      (ag.email || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ─────────────────────────────────────────────────────────────
       * 1. SUMMARY STATS
       * ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Total Commission Liability
          </span>
          <span className="text-2xl font-bold font-mono text-purple-400 mt-1 block">
            {fmt(commissionData?.totalCommissionLiability)}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">
            Calculated across all completed CRM deals
          </span>
        </div>

        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Pending Commission Payouts
          </span>
          <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
            {fmt(commissionData?.totalPendingPayouts)}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">
            Unsettled agent balance liabilities
          </span>
        </div>

        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Active Commissionable Agents
          </span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">
            {commissionData?.agentsCount || 0} Reps
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">
            Closers, Setters & Referral Affiliates
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 2. SEARCH BAR
       * ───────────────────────────────────────────────────────────── */}
      <div className="p-3 rounded-md bg-mx-panel border border-mx-border flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mx-subtle" />
          <input
            type="text"
            placeholder="Search agents by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-mx-surface border border-mx-border rounded-sm text-xs text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 3. AGENT LEADERBOARD & ITEMIZATION
       * ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-mx-subtle text-xs font-mono">
            Loading agent commission liabilities...
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="py-12 text-center text-mx-subtle text-xs font-mono">
            No agent commission records found.
          </div>
        ) : (
          filteredAgents.map((ag) => {
            const isExpanded = expandedAgentId === ag.userId;
            const rates = ag.commissionRates || {};

            return (
              <div
                key={ag.userId}
                className="rounded-md bg-mx-panel border border-mx-border overflow-hidden transition-colors"
              >
                {/* Agent Summary Row */}
                <div
                  onClick={() => setExpandedAgentId(isExpanded ? null : ag.userId)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-mx-surface/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-mx-surface border border-mx-border flex items-center justify-center text-purple-400 font-bold font-mono">
                      {ag.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {ag.name}
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-mx-surface text-mx-subtle border border-mx-border">
                          {Array.isArray(ag.roles) ? ag.roles.join(', ') : 'Sales Rep'}
                        </span>
                      </h4>
                      <p className="text-xs text-mx-subtle font-mono">{ag.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Rates Info */}
                    <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-mx-subtle">
                      <span>Lead: <b className="text-white">{rates.leadGenPercent || 0}%</b></span>
                      <span>Closer: <b className="text-white">{rates.closerPercent || 0}%</b></span>
                      <span>Dev: <b className="text-white">{rates.developerPercent || 0}%</b></span>
                    </div>

                    {/* Earnings */}
                    <div className="text-right font-mono">
                      <span className="text-base font-bold text-purple-400 block">
                        {fmt(ag.totalEarnings)}
                      </span>
                      <span className="text-[10px] text-mx-subtle">
                        {ag.dealsCount} Deals | Ref: {fmt(ag.referralEarnings)}
                      </span>
                    </div>

                    <button className="text-mx-subtle">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Itemized Deals Table */}
                {isExpanded && (
                  <div className="p-4 border-t border-mx-border bg-mx-surface/80 space-y-3">
                    <h5 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">
                      Itemized Completed Deals ({ag.itemized?.length || 0})
                    </h5>

                    {ag.itemized?.length === 0 ? (
                      <div className="py-4 text-center text-mx-subtle text-xs font-mono">
                        No fully completed deals eligible for commission payout yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="border-b border-mx-border text-mx-subtle font-mono">
                              <th className="pb-2">Sale ID</th>
                              <th className="pb-2">Client Name</th>
                              <th className="pb-2 text-right">Contract Value</th>
                              <th className="pb-2">Roles Earned</th>
                              <th className="pb-2 text-right">Commission Earned</th>
                              <th className="pb-2 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-mx-border/40">
                            {ag.itemized.map((item) => (
                              <tr key={item.saleId} className="py-2">
                                <td className="py-2 font-mono text-mx-subtle">
                                  #{String(item.saleId).slice(-6)}
                                </td>
                                <td className="py-2 text-white font-medium">{item.clientName}</td>
                                <td className="py-2 text-right font-mono text-white">
                                  {fmt(item.totalSaleAmount)}
                                </td>
                                <td className="py-2 font-mono text-mx-subtle">
                                  {item.rolesEarned?.map((r) => `${r.role} (${r.percent}%)`).join(', ')}
                                </td>
                                <td className="py-2 text-right font-mono text-purple-400 font-bold">
                                  {fmt(item.dealEarnings)}
                                </td>
                                <td className="py-2 text-center">
                                  <button
                                    onClick={() => onOpenSaleDetail(item.saleId)}
                                    className="px-2 py-0.5 rounded-sm bg-mx-panel border border-mx-border text-[10px] font-mono text-mx-blue hover:text-white"
                                  >
                                    View Deal
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommissionsTab;
