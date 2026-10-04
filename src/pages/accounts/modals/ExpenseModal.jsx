import React, { useState, useEffect } from 'react';
import { X, Receipt, DollarSign, Calendar, Tag, Building2, CreditCard, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { accountsApi } from '../../../services/adminApi';
import DarkDatePicker from '../../../components/common/DarkDatePicker';
import { PAKISTAN_PAYMENT_METHODS, DEFAULT_PAYMENT_METHOD } from '../../../config/currency';

const CATEGORIES = [
  { id: 'software_saas', label: 'Software, AI & SaaS Tools' },
  { id: 'payroll', label: 'Payroll & Core Compensation' },
  { id: 'marketing_ads', label: 'Marketing & Ad Spend' },
  { id: 'office_infra', label: 'Office & Infrastructure' },
  { id: 'contractor', label: 'Contractors & Freelancers' },
  { id: 'legal_compliance', label: 'Legal & Compliance' },
  { id: 'travel_client', label: 'Travel & Client Relations' },
  { id: 'miscellaneous', label: 'General Overhead & Miscellaneous' },
];

const PAYMENT_METHODS = PAKISTAN_PAYMENT_METHODS;

const ExpenseModal = ({ expense = null, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'software_saas',
    amount: '',
    currency: 'PKR',
    expenseDate: new Date().toISOString().slice(0, 10),
    paymentMethod: DEFAULT_PAYMENT_METHOD,
    vendor: '',
    referenceNumber: '',
    description: '',
    isRecurring: false,
    recurringInterval: 'monthly',
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        category: expense.category || 'software_saas',
        amount: expense.amount || '',
        currency: expense.currency || 'PKR',
        expenseDate: expense.date ? new Date(expense.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        paymentMethod: expense.paymentMethod || DEFAULT_PAYMENT_METHOD,
        vendor: expense.vendor || '',
        referenceNumber: expense.referenceNumber || '',
        description: expense.description || '',
        isRecurring: Boolean(expense.isRecurring),
        recurringInterval: expense.recurringInterval || 'monthly',
      });
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Expense title is required');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error('Valid positive amount is required');
      return;
    }

    setLoading(true);
    try {
      if (expense?._id) {
        await accountsApi.updateCoreExpense(expense._id, formData);
        toast.success('Core Operating Expense updated');
      } else {
        await accountsApi.createCoreExpense(formData);
        toast.success('Core Operating Expense recorded');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-mx-panel border border-mx-border rounded-lg w-full max-w-xl shadow-2xl overflow-hidden animate-fadeIn" data-testid="expense-modal">
        {/* Header */}
        <div className="p-4 border-b border-mx-border flex items-center justify-between bg-mx-surface">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-mx-panel border border-mx-border flex items-center justify-center text-mx-blue">
              <Receipt size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {expense ? 'Edit Core Expense' : 'Record MegaTrix Core Expense'}
              </h2>
              <p className="text-xs text-mx-subtle">
                Operating Cost & Overhead Management
              </p>
            </div>
          </div>
          <button
            type="button"
            data-testid="btn-close-expense"
            onClick={onClose}
            className="p-1.5 rounded-sm text-mx-subtle hover:text-white hover:bg-mx-panel transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4" data-testid="expense-form">
          <div>
            <label className="block text-[11px] font-mono text-mx-subtle uppercase mb-1">
              Expense Title / Description *
            </label>
            <input
              type="text"
              required
              data-testid="input-expense-title"
              placeholder="e.g. AWS Production Cloud Infrastructure"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-mx-surface border border-mx-border rounded-sm text-xs text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-mx-subtle uppercase mb-1">
                Category *
              </label>
              <select
                data-testid="select-expense-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-mx-surface border border-mx-border rounded-sm text-xs text-white focus:outline-none focus:border-mx-blue"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
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
                min="1"
                required
                data-testid="input-expense-amount"
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
                label="Expense Date"
                required={true}
                value={formData.expenseDate}
                onChange={(val) => setFormData({ ...formData, expenseDate: val })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-mx-subtle uppercase mb-1">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 bg-mx-surface border border-mx-border rounded-sm text-xs text-white focus:outline-none focus:border-mx-blue"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-mx-subtle uppercase mb-1">
                Vendor / Service Provider
              </label>
              <input
                type="text"
                placeholder="e.g. Amazon Web Services, Google LLC"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full px-3 py-2 bg-mx-surface border border-mx-border rounded-sm text-xs text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-mx-subtle uppercase mb-1">
                Invoice / Reference Number
              </label>
              <input
                type="text"
                placeholder="e.g. INV-2026-9042"
                value={formData.referenceNumber}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                className="w-full px-3 py-2 bg-mx-surface border border-mx-border rounded-sm text-xs text-white font-mono placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-mx-subtle uppercase mb-1">
              Internal Notes / Purpose
            </label>
            <textarea
              rows={2}
              placeholder="Optional notes regarding this expenditure..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-mx-surface border border-mx-border rounded-sm text-xs text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
            />
          </div>

          {/* Recurring Option */}
          <div className="p-3 rounded-sm bg-mx-surface border border-mx-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw size={14} className="text-mx-blue" />
              <span className="text-xs text-white">Recurring Operational Expense</span>
            </div>
            <input
              type="checkbox"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              className="rounded border-mx-border bg-mx-panel text-mx-blue focus:ring-0"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-mx-border flex items-center justify-end gap-2">
            <button
              type="button"
              data-testid="btn-cancel-expense"
              onClick={onClose}
              className="px-4 py-2 rounded-sm bg-mx-surface border border-mx-border text-xs text-mx-subtle hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="btn-save-expense"
              disabled={loading}
              className="px-4 py-2 rounded-sm bg-mx-blue text-xs font-bold text-white hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {loading ? 'Saving...' : expense ? 'Update Expense' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
