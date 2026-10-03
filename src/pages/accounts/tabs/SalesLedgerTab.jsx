import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  DollarSign,
  User,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import { accountsApi } from '../../../services/adminApi';
import DarkDateRangePicker from '../../../components/common/DarkDateRangePicker';
import { fmtPKR } from '../../../config/currency';

const SalesLedgerTab = ({ onOpenSaleDetail }) => {
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, totalPages: 1, total: 0 });

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [agent, setAgent] = useState('all');
  const [dateRange, setDateRange] = useState({ preset: 'all_time', startDate: '', endDate: '' });
  const [sortBy, setSortBy] = useState('closedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchSales = async (page = 1) => {
    setLoading(true);
    try {
      const res = await accountsApi.getSalesLedger({
        search,
        status,
        agent,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        sortBy,
        sortOrder,
        page,
        limit: pagination.limit,
      });

      if (res.success) {
        setSales(res.sales || []);
        setSummary(res.summary || null);
        setPagination(res.pagination || { page: 1, limit: 25, totalPages: 1, total: 0 });
      }
    } catch (err) {
      console.error('[SalesLedgerTab] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(1);
  }, [search, status, agent, dateRange, sortBy, sortOrder]);

  const fmt = fmtPKR;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* ─────────────────────────────────────────────────────────────
       * 1. SUMMARY STATS STRIP
       * ───────────────────────────────────────────────────────────── */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-md bg-mx-panel border border-mx-border">
            <span className="text-[10px] font-mono text-mx-subtle uppercase block">
              Total Filtered Bookings
            </span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">
              {fmt(summary.totalBooked)}
            </span>
            <span className="text-[10px] font-mono text-mx-subtle">{summary.count} Contract(s)</span>
          </div>

          <div className="p-3 rounded-md bg-mx-panel border border-mx-border">
            <span className="text-[10px] font-mono text-mx-subtle uppercase block">
              Cash Inflow Collected
            </span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
              {fmt(summary.totalPaid)}
            </span>
            <span className="text-[10px] font-mono text-mx-subtle">Realized Advances</span>
          </div>

          <div className="p-3 rounded-md bg-mx-panel border border-mx-border">
            <span className="text-[10px] font-mono text-mx-subtle uppercase block">
              Outstanding Receivables
            </span>
            <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
              {fmt(summary.totalBalance)}
            </span>
            <span className="text-[10px] font-mono text-mx-subtle">Due on Delivery</span>
          </div>

          <div className="p-3 rounded-md bg-mx-panel border border-mx-border">
            <span className="text-[10px] font-mono text-mx-subtle uppercase block">
              Commission Liability
            </span>
            <span className="text-xl font-bold font-mono text-purple-400 mt-1 block">
              {fmt(summary.totalCommission)}
            </span>
            <span className="text-[10px] font-mono text-mx-subtle">Attributed Cost</span>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
       * 2. CONTROLS & FILTERS BAR
       * ───────────────────────────────────────────────────────────── */}
      <div className="p-3 rounded-md bg-mx-panel border border-mx-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mx-subtle" />
          <input
            type="text"
            placeholder="Search by client name, closer, setter, phone, or deal ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-mx-surface border border-mx-border rounded-sm text-xs text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <DarkDateRangePicker
            preset={dateRange.preset}
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onApplyRange={(range) => setDateRange(range)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-mx-surface border border-mx-border rounded-sm text-xs text-white font-mono focus:outline-none focus:border-mx-blue"
          >
            <option value="all">All Deal Statuses</option>
            <option value="advance_paid">Advance Paid</option>
            <option value="payment_completed">Payment Completed</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 bg-mx-surface border border-mx-border rounded-sm text-xs text-white font-mono focus:outline-none focus:border-mx-blue"
          >
            <option value="closedAt">Sort by Date</option>
            <option value="totalAmount">Sort by Contract Value</option>
            <option value="advanceAmount">Sort by Inflow</option>
            <option value="remainingAmount">Sort by Due Balance</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title="Toggle Sort Order"
            className="p-1.5 rounded-sm bg-mx-surface border border-mx-border text-mx-subtle hover:text-white transition-colors"
          >
            <ArrowUpDown size={14} />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 3. SALES DATAGRID TABLE
       * ───────────────────────────────────────────────────────────── */}
      <div className="rounded-md bg-mx-panel border border-mx-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-mx-border bg-mx-surface text-mx-subtle font-mono">
                <th className="px-4 py-2.5">Sale ID</th>
                <th className="px-4 py-2.5">Customer / Business</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Deal Value</th>
                <th className="px-4 py-2.5 text-right">Inflow Paid</th>
                <th className="px-4 py-2.5 text-right">Remaining</th>
                <th className="px-4 py-2.5">Closer / Setter</th>
                <th className="px-4 py-2.5 text-right">Est. Comm</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mx-border/50">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-mx-subtle font-mono">
                    Querying LeadHunter sales database...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-mx-subtle font-mono">
                    No sales contracts found matching criteria.
                  </td>
                </tr>
              ) : (
                sales.map((sale) => {
                  const tot = Number(sale.totalAmount) || 0;
                  const adv = Number(sale.advanceAmount) || 0;
                  const rem =
                    sale.remainingAmount !== undefined
                      ? Number(sale.remainingAmount)
                      : Math.max(0, tot - adv);

                  return (
                    <tr key={sale._id} className="hover:bg-mx-surface/60 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-mx-subtle">
                        #{String(sale._id).slice(-6)}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-white font-medium block">
                          {sale.customer?.businessName || sale.customer?.name || 'Client'}
                        </span>
                        <span className="text-[10px] font-mono text-mx-subtle">
                          {sale.customer?.area || 'Lahore'} | {sale.customer?.category || 'General'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase ${
                            sale.status === 'payment_completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {sale.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-white">
                        {fmt(tot)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-emerald-400">
                        {fmt(adv)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-amber-400 font-medium">
                        {fmt(rem)}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-white block truncate max-w-[120px]">
                          {sale.closedByName || sale.closedBy?.name || 'Closer'}
                        </span>
                        <span className="text-[10px] text-mx-subtle block truncate max-w-[120px]">
                          Setter: {sale.leadGeneratedByName || sale.leadGeneratedBy?.name || 'Setter'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-purple-400">
                        {fmt(sale.estimatedCommission)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-mx-subtle whitespace-nowrap">
                        {sale.closedAt ? new Date(sale.closedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          onClick={() => onOpenSaleDetail(sale._id)}
                          className="px-2.5 py-1 rounded-sm bg-mx-surface border border-mx-border text-[11px] font-mono text-mx-blue hover:bg-mx-panel hover:text-white transition-colors"
                        >
                          Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-mx-border bg-mx-surface flex items-center justify-between text-xs font-mono text-mx-subtle">
          <span>
            Showing Page {pagination.page} of {pagination.totalPages || 1} ({pagination.total} Records)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchSales(pagination.page - 1)}
              className="p-1.5 rounded-sm bg-mx-panel border border-mx-border text-mx-subtle hover:text-white disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchSales(pagination.page + 1)}
              className="p-1.5 rounded-sm bg-mx-panel border border-mx-border text-mx-subtle hover:text-white disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesLedgerTab;
