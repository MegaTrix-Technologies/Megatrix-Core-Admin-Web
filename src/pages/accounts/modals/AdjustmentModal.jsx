import React, { useState } from 'react';
import { X, Scale, AlertTriangle, ShieldCheck, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { accountsApi } from '../../../services/adminApi';
import DarkDatePicker from '../../../components/common/DarkDatePicker';

const ADJUSTMENT_TYPES = [
  { id: 'cash_inflow', label: 'Cash Inflow Correction (+/- Realized Flow)' },
  { id: 'accrual_revenue', label: 'Accrual Revenue Adjustment (+/- Bookings)' },
  { id: 'expense_offset', label: 'Operating Expense Offset / Refund' },
  { id: 'receivable_writeoff', label: 'Bad Debt / Uncollectible Write-off' },
];

const AdjustmentModal = ({ onClose, onSuccess, initialData = {} }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    adjustmentType: initialData.adjustmentType || 'cash_inflow',
    amount: initialData.difference ? Math.abs(initialData.difference) : '',
    currency: 'PKR',
    reason: initialData.reason || '',
    effectiveDate: new Date().toISOString().slice(0, 10),
    targetEntity: initialData.entityType || 'general',
    targetId: initialData.entityId ? String(initialData.entityId) : '',
    impactCategory: 'cash_flow',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Adjustment title is required');
      return;
    }
    if (!formData.amount || Number(formData.amount) === 0) {
      toast.error('Non-zero adjustment amount is required');
      return;
    }
    if (!formData.reason.trim()) {
      toast.error('Audit justification and reason are strictly required for adjustments');
      return;
    }

    setLoading(true);
    try {
      await accountsApi.createAdjustment(formData);
      toast.success('Administrative Adjustment recorded & applied');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to post adjustment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-mx-panel border border-mx-border rounded-lg w-full max-w-xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 border-b border-mx-border flex items-center justify-between bg-mx-surface">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-mx-panel border border-mx-border flex items-center justify-center text-amber-400">
              <Scale size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Record Administrative Adjustment
              </h2>
              <p className="text-xs text-mx-subtle">
                Controlled General Ledger Correction & Audit Event
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-mx-subtle hover:text-white hover:bg-mx-panel transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2 text-amber-300 text-xs font-mono">
          <AlertTriangle size={14} className="shrink-0" />
          <span>
            Adjustments alter calculated financial statements and are logged immutably.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-mx-subtle uppercase mb-1">
              Adjustment Title / Memo *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bank Fee Reconciliation Offset / Sale #4092 Correction"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-mx-surface border border-mx-border rounded-sm text-xs text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-mx-subtle uppercase mb-1">
                Adjustment Type *
              </label>
              <select
                value={formData.adjustmentType}
                onChange={(e) => setFormData({ ...formData, adjustmentType: e.target.value })}
                className="w-full px-3 py-2 bg-mx-surface border border-mx-border rounded-sm text-xs text-white focus:outline-none focus:border-mx-blue"
              >
                {ADJUSTMENT_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-mx-subtle uppercase mb-1">
                Amount (PKR) *
              </label>
              <input
                type="number"
                step="1"
                required
                placeholder="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 bg-mx-surface border border-mx-border rounded-sm text-xs text-white font-mono placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <DarkDatePicker
                label="Effective Date"
                required={true}
                value={formData.effectiveDate}
                onChange={(val) => setFormData({ ...formData, effectiveDate: val })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-mx-subtle uppercase mb-1">
                Target Entity Reference
              </label>
              <input
                type="text"
                placeholder="Optional ID (e.g. Sale ID, Inflow ID)"
                value={formData.targetId}
                onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                className="w-full px-3 py-2 bg-mx-surface border border-mx-border rounded-sm text-xs text-white font-mono placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-mx-subtle uppercase mb-1">
              Audit Justification & Reason *
            </label>
            <textarea
              rows={3}
              required
              placeholder="State the detailed operational or banking rationale for this manual ledger adjustment..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 bg-mx-surface border border-mx-border rounded-sm text-xs text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-mx-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-sm bg-mx-surface border border-mx-border text-xs text-mx-subtle hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-sm bg-amber-500 text-xs font-bold text-black hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Apply Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdjustmentModal;
