import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  DollarSign,
  Building2,
  CreditCard,
  Tag,
  Calendar,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { accountsApi } from '../../../services/adminApi';
import DarkDateRangePicker from '../../../components/common/DarkDateRangePicker';
import { fmtPKR } from '../../../config/currency';

const ExpensesLedgerTab = ({ onOpenAddExpense, onOpenEditExpense, refreshKey }) => {
  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ preset: 'all_time', startDate: '', endDate: '' });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await accountsApi.getExpenses({
        category: categoryFilter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      if (res.success) {
        setExpenseData(res);
      }
    } catch (err) {
      console.error('[ExpensesLedgerTab] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [categoryFilter, dateRange, refreshKey]);

  const handleDeleteCoreExpense = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete core expense "${title}"?`)) return;
    try {
      await accountsApi.deleteCoreExpense(id);
      toast.success('Core Expense removed');
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete expense');
    }
  };

  const fmt = fmtPKR;

  const expenses = expenseData?.expenses || [];
  const filteredExpenses = expenses.filter((e) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (e.title || '').toLowerCase().includes(q) ||
      (e.vendor || '').toLowerCase().includes(q) ||
      (e.categoryLabel || '').toLowerCase().includes(q) ||
      String(e._id || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ─────────────────────────────────────────────────────────────
       * 1. EXPENSE OVERVIEW SUMMARY CARDS
       * ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Total Operating OpEx
          </span>
          <span className="text-2xl font-bold font-mono text-red-400 mt-1 block">
            {fmt(expenseData?.totalAmount)}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">
            {expenseData?.totalCount || 0} Total Operating Items
          </span>
        </div>

        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Software & Cloud Tools
          </span>
          <span className="text-2xl font-bold font-mono text-purple-400 mt-1 block">
            {fmt(expenses.filter(e => e.category === 'software_saas').reduce((sum, e) => sum + (e.amount || 0), 0))}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">
            AI APIs, Hosting & Infrastructure
          </span>
        </div>

        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Operations & Marketing
          </span>
          <span className="text-2xl font-bold font-mono text-mx-blue mt-1 block">
            {fmt(expenses.filter(e => e.category !== 'software_saas').reduce((sum, e) => sum + (e.amount || 0), 0))}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">
            Campaigns, Overheads & Administrative Costs
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 2. CONTROLS & ADD BUTTON
       * ───────────────────────────────────────────────────────────── */}
      <div className="p-3 rounded-md bg-mx-panel border border-mx-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mx-subtle" />
          <input
            type="text"
            placeholder="Search expenses by title, vendor, or category..."
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-mx-surface border border-mx-border rounded-sm text-xs text-white font-mono focus:outline-none focus:border-mx-blue"
          >
            <option value="all">All Categories</option>
            <option value="software_saas">Software, AI & SaaS</option>
            <option value="payroll">Payroll & Compensation</option>
            <option value="marketing_ads">Marketing & Ads</option>
            <option value="office_infra">Office & Infra</option>
            <option value="contractor">Contractors</option>
            <option value="legal_compliance">Legal & Compliance</option>
            <option value="travel_client">Travel & Client</option>
            <option value="miscellaneous">Miscellaneous</option>
          </select>

          <button
            onClick={onOpenAddExpense}
            className="px-3 py-1.5 rounded-sm bg-mx-blue text-xs font-bold text-white hover:bg-blue-600 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus size={14} /> Add Core Expense
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 3. EXPENSES DATAGRID
       * ───────────────────────────────────────────────────────────── */}
      <div className="rounded-md bg-mx-panel border border-mx-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-mx-border bg-mx-surface text-mx-subtle font-mono">
                <th className="px-4 py-2.5">Ledger Source</th>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5">Expense Title / Vendor</th>
                <th className="px-4 py-2.5">Payment Method</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5 text-right">Amount</th>
                <th className="px-4 py-2.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mx-border/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-mx-subtle font-mono">
                    Consolidating operational expenses...
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-mx-subtle font-mono">
                    No operating expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-mx-surface/60 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        MegaTrix Core
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] font-mono text-mx-subtle">
                        {exp.categoryLabel || exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-white font-medium block">{exp.title}</span>
                      {exp.vendor && (
                        <span className="text-[10px] text-mx-subtle font-mono">
                          Vendor: {exp.vendor}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-mx-subtle">
                      {exp.paymentMethod || 'Corporate'}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-mx-subtle whitespace-nowrap">
                      {exp.date || exp.expenseDate ? new Date(exp.date || exp.expenseDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-red-400">
                      {fmt(exp.amount)}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenEditExpense(exp)}
                          className="p-1 rounded-sm text-mx-subtle hover:text-white hover:bg-mx-surface"
                          title="Edit Expense"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteCoreExpense(exp._id, exp.title)}
                          className="p-1 rounded-sm text-mx-subtle hover:text-red-400 hover:bg-mx-surface"
                          title="Delete Expense"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
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

export default ExpensesLedgerTab;
