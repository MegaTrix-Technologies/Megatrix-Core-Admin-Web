import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Search,
  DollarSign,
  Percent,
  Layers,
} from 'lucide-react';
import { accountsApi } from '../../../services/adminApi';
import { fmtPKR } from '../../../config/currency';

const ProjectFinancialsTab = () => {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await accountsApi.getProjects();
      if (res.success) {
        setProjectData(res);
      }
    } catch (err) {
      console.error('[ProjectFinancialsTab] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fmt = fmtPKR;

  const projects = projectData?.projects || [];
  const summary = projectData?.summary || {};

  const filteredProjects = projects.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (p.title || '').toLowerCase().includes(q) ||
        (p.clientName || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ─────────────────────────────────────────────────────────────
       * 1. PROJECT UNIT ECONOMICS SUMMARY
       * ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Total Contract Revenue
          </span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">
            {fmt(summary.totalRevenue)}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">{summary.totalProjects || 0} Projects</span>
        </div>

        <div className="p-3 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Direct Project Costs
          </span>
          <span className="text-xl font-bold font-mono text-red-400 mt-1 block">
            {fmt(summary.totalCost)}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">Expenses & Commissions</span>
        </div>

        <div className="p-3 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Net Margin Contribution
          </span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
            {fmt(summary.totalNetContribution)}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">Gross Project Profit</span>
        </div>

        <div className="p-3 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Average Project Margin
          </span>
          <span className="text-xl font-bold font-mono text-mx-blue mt-1 block">
            {summary.avgMargin || 0}%
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">Net Contribution %</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 2. CONTROLS & FILTERS
       * ───────────────────────────────────────────────────────────── */}
      <div className="p-3 rounded-md bg-mx-panel border border-mx-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mx-subtle" />
          <input
            type="text"
            placeholder="Search projects by title or client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-mx-surface border border-mx-border rounded-sm text-xs text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-mx-surface border border-mx-border rounded-sm text-xs text-white font-mono focus:outline-none focus:border-mx-blue"
          >
            <option value="all">All Project Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Under Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 3. PROJECTS DATAGRID
       * ───────────────────────────────────────────────────────────── */}
      <div className="rounded-md bg-mx-panel border border-mx-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-mx-border bg-mx-surface text-mx-subtle font-mono">
                <th className="px-4 py-2.5">Project Name</th>
                <th className="px-4 py-2.5">Client</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Contract Value</th>
                <th className="px-4 py-2.5 text-right">Cash Inflow</th>
                <th className="px-4 py-2.5 text-right">Receivables</th>
                <th className="px-4 py-2.5 text-right">Direct Costs</th>
                <th className="px-4 py-2.5 text-right">Net Contribution</th>
                <th className="px-4 py-2.5 text-right">Margin %</th>
                <th className="px-4 py-2.5 text-center">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mx-border/50">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-mx-subtle font-mono">
                    Calculating project unit economics...
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-mx-subtle font-mono">
                    No projects found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => (
                  <tr key={p.projectId} className="hover:bg-mx-surface/60 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="text-white font-medium block">{p.title}</span>
                      <span className="text-[10px] font-mono text-mx-subtle">
                        {p.assignedDevs?.length > 0 ? p.assignedDevs.join(', ') : 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-white">{p.clientName}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase ${
                          p.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {p.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-white">
                      {fmt(p.contractRevenue)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-emerald-400">
                      {fmt(p.cashCollected)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-amber-400">
                      {fmt(p.receivables)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-red-400">
                      {fmt(p.totalProjectCost)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-emerald-400">
                      {fmt(p.netContribution)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-white">
                      {p.netMarginPercent}%
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase ${
                          p.healthStatus === 'Healthy'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : p.healthStatus === 'At Risk'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {p.healthStatus}
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

export default ProjectFinancialsTab;
