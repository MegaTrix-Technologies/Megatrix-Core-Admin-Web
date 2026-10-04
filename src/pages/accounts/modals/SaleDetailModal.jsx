import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Briefcase,
  Layers,
  CreditCard,
  Percent,
  PlusCircle,
  FileCheck,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { accountsApi } from '../../../services/adminApi';
import { fmtPKR, PAKISTAN_PAYMENT_METHODS, DEFAULT_PAYMENT_METHOD } from '../../../config/currency';
import DarkDatePicker from '../../../components/common/DarkDatePicker';

const SaleDetailModal = ({ saleId, onClose, onPaymentRecorded }) => {
  const [loading, setLoading] = useState(true);
  const [saleData, setSaleData] = useState(null);
  const [inflows, setInflows] = useState([]);
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  // Payment Form State
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(DEFAULT_PAYMENT_METHOD);
  const [referenceNote, setReferenceNote] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const fetchDetail = async () => {
    if (!saleId) return;
    setLoading(true);
    try {
      const res = await accountsApi.getSaleDetail(saleId);
      if (res.success) {
        setSaleData(res.sale);
        setInflows(res.inflows || []);
        setProject(res.project || null);
        const rem =
          res.sale.remainingAmount !== undefined
            ? res.sale.remainingAmount
            : Math.max(0, (res.sale.totalAmount || 0) - (res.sale.advanceAmount || 0));
        setPaymentAmount(rem > 0 ? String(rem) : '');
      } else {
        setError(res.message || 'Failed to load sale details');
      }
    } catch (err) {
      setError(err.message || 'Network error fetching sale details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [saleId]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!saleId) return null;

  const fmt = fmtPKR;

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    const amt = Number(paymentAmount);
    if (!amt || amt <= 0) {
      toast.error('Valid positive payment amount is required.');
      return;
    }

    const currentRem =
      saleData.remainingAmount !== undefined
        ? saleData.remainingAmount
        : Math.max(0, (saleData.totalAmount || 0) - (saleData.advanceAmount || 0));

    if (amt > currentRem) {
      toast.error(`Payment amount (${fmt(amt)}) cannot exceed remaining balance (${fmt(currentRem)}).`);
      return;
    }

    setSubmittingPayment(true);
    try {
      const res = await accountsApi.recordSalePayment(saleId, {
        amount: amt,
        paymentMethod,
        referenceNote: referenceNote.trim() || 'Installment Payment',
        notes: paymentNotes.trim(),
        date: paymentDate,
      });

      if (res.success) {
        toast.success(`Payment of ${fmt(amt)} recorded successfully!`);
        setShowPaymentForm(false);
        setReferenceNote('');
        setPaymentNotes('');
        fetchDetail();
        if (onPaymentRecorded) {
          onPaymentRecorded(res.sale);
        }
      } else {
        toast.error(res.message || 'Failed to record installment.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Error recording installment.');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const remaining =
    saleData?.remainingAmount !== undefined
      ? saleData.remainingAmount
      : Math.max(0, (saleData?.totalAmount || 0) - (saleData?.advanceAmount || 0));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      data-testid="modal-sale-detail"
    >
      <div
        className="bg-mx-panel border border-mx-border rounded-lg w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn"
        data-testid="sale-detail-modal"
      >
        {/* Header */}
        <div className="p-4 border-b border-mx-border flex items-center justify-between bg-mx-surface">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-mx-panel border border-mx-border flex items-center justify-center text-mx-blue">
              <DollarSign size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Sale Dossier: {saleData?.saleNumber || `#${String(saleId).slice(-6)}`}
                {saleData && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase ${
                      saleData.status === 'payment_completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {saleData.status?.replace('_', ' ')}
                  </span>
                )}
              </h2>
              <p className="text-xs text-mx-subtle">
                Core Sales Contract Reference, Realized Inflows & Installment Workflow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-mx-subtle hover:text-white hover:bg-mx-panel transition-colors"
            data-testid="btn-close-sale-detail"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-16 text-center text-mx-subtle text-xs font-mono">
              Loading contract ledger and financial telemetry...
            </div>
          ) : error ? (
            <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          ) : saleData ? (
            <>
              {/* Top Financial Highlights Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-md bg-mx-surface border border-mx-border">
                  <span className="text-[10px] font-mono text-mx-subtle uppercase block">
                    Total Contract Value
                  </span>
                  <span className="text-lg font-bold font-mono text-white mt-1 block" data-testid="detail-total-amount">
                    {fmt(saleData.totalAmount)}
                  </span>
                </div>
                <div className="p-3 rounded-md bg-mx-surface border border-mx-border">
                  <span className="text-[10px] font-mono text-mx-subtle uppercase block">
                    Advance Collected
                  </span>
                  <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block" data-testid="detail-advance-amount">
                    {fmt(saleData.advanceAmount)}
                  </span>
                </div>
                <div className="p-3 rounded-md bg-mx-surface border border-mx-border">
                  <span className="text-[10px] font-mono text-mx-subtle uppercase block">
                    Remaining Receivable
                  </span>
                  <span
                    className={`text-lg font-bold font-mono mt-1 block ${
                      remaining > 0 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                    data-testid="detail-remaining-amount"
                  >
                    {fmt(remaining)}
                  </span>
                </div>
                <div className="p-3 rounded-md bg-mx-surface border border-mx-border">
                  <span className="text-[10px] font-mono text-mx-subtle uppercase block">
                    Estimated Commission
                  </span>
                  <span className="text-lg font-bold font-mono text-purple-400 mt-1 block" data-testid="detail-commission-amount">
                    {fmt(saleData.estimatedCommission)}
                  </span>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
               * OPERATIONAL PAYMENT WORKFLOW (Record Installment)
               * ───────────────────────────────────────────────────────────── */}
              {remaining > 0 ? (
                <div className="p-4 rounded-md bg-mx-surface border border-mx-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                        <CreditCard size={14} className="text-emerald-400" /> Record Installment / Payment
                      </h3>
                      <p className="text-[11px] text-mx-subtle">
                        Record verified cash receipt directly against contract balance ({fmt(remaining)} remaining).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPaymentForm(!showPaymentForm)}
                      className="px-3 py-1.5 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-xs font-mono font-bold text-white transition-colors flex items-center gap-1.5"
                      data-testid="btn-toggle-payment-drawer"
                    >
                      <PlusCircle size={14} />
                      {showPaymentForm ? 'Hide Payment Form' : 'Record Payment'}
                    </button>
                  </div>

                  {showPaymentForm && (
                    <form
                      onSubmit={handleRecordPayment}
                      className="pt-3 border-t border-mx-border space-y-3 animate-fadeIn"
                      data-testid="payment-drawer"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <label className="text-[11px] font-mono text-mx-subtle block mb-1">
                            Payment Amount (PKR) *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            max={remaining}
                            step="1000"
                            data-testid="input-payment-amount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-white font-mono focus:outline-none focus:border-mx-blue"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-mx-subtle block mb-1">
                            Payment Rail / Rail Method
                          </label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-white font-mono focus:outline-none focus:border-mx-blue"
                          >
                            {PAKISTAN_PAYMENT_METHODS.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-mx-subtle block mb-1">
                            Transaction Date
                          </label>
                          <DarkDatePicker
                            value={paymentDate}
                            onChange={(d) => setPaymentDate(d)}
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-mx-subtle block mb-1">
                            Reference / RRN / IBFT ID
                          </label>
                          <input
                            type="text"
                            data-testid="input-payment-ref"
                            placeholder="e.g. IBFT-84920"
                            value={referenceNote}
                            onChange={(e) => setReferenceNote(e.target.value)}
                            className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-mx-subtle block mb-1">
                          Payment Notes & Ledger Memo (Optional)
                        </label>
                        <input
                          type="text"
                          data-testid="input-payment-notes"
                          placeholder="e.g. 2nd Installment payment verified against HBL banking statement"
                          value={paymentNotes}
                          onChange={(e) => setPaymentNotes(e.target.value)}
                          className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-xs text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowPaymentForm(false)}
                          className="px-3 py-1.5 rounded-sm bg-mx-panel border border-mx-border text-xs text-mx-subtle hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingPayment}
                          data-testid="btn-submit-payment"
                          className="px-4 py-1.5 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-xs font-mono font-bold text-white transition-colors disabled:opacity-50"
                        >
                          {submittingPayment ? 'Recording...' : 'Confirm & Apply Payment'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <FileCheck size={16} /> Contract Payment Completed: All contracted revenues have been fully collected into company cash reserves.
                </div>
              )}

              {/* Grid: Client Information & Sales Attribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client Profile */}
                <div className="p-4 rounded-md bg-mx-surface border border-mx-border space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Building2 size={14} className="text-mx-subtle" /> Client Information
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-mx-border/50">
                      <span className="text-mx-subtle">Business Name</span>
                      <span className="text-white font-medium" data-testid="detail-client-business">
                        {saleData.customer?.businessName || saleData.customer?.name || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-mx-border/50">
                      <span className="text-mx-subtle">Contact Person</span>
                      <span className="text-white">
                        {saleData.customer?.contactPerson || saleData.customer?.name || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-mx-border/50">
                      <span className="text-mx-subtle">Phone</span>
                      <span className="text-white font-mono">
                        {saleData.customer?.phone || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-mx-border/50">
                      <span className="text-mx-subtle">Email</span>
                      <span className="text-white font-mono">
                        {saleData.customer?.email || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-mx-border/50">
                      <span className="text-mx-subtle">Category / Industry</span>
                      <span className="text-white font-mono">
                        {saleData.customer?.category || 'General'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-mx-subtle">Location / City</span>
                      <span className="text-white">
                        {saleData.customer?.city || saleData.customer?.area || 'Lahore'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deal Attribution & Team */}
                <div className="p-4 rounded-md bg-mx-surface border border-mx-border space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <User size={14} className="text-mx-subtle" /> Team Attribution & Schedule
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-mx-border/50">
                      <span className="text-mx-subtle">Sales Closer</span>
                      <span className="text-white font-medium">
                        {saleData.closedByName || saleData.closedBy?.name || 'Super Admin'} ({saleData.commissionRates?.closerPercent ?? 0}%)
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-mx-border/50">
                      <span className="text-mx-subtle">Lead Generator / Setter</span>
                      <span className="text-white">
                        {saleData.leadGeneratedByName || saleData.leadGeneratedBy?.name || 'Sales Desk'} ({saleData.commissionRates?.leadGenPercent ?? 0}%)
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-mx-border/50">
                      <span className="text-mx-subtle">Assigned Developers</span>
                      <span className="text-white">
                        {saleData.assignedDevelopers?.length > 0
                          ? saleData.assignedDevelopers.map((d) => d.name || d).join(', ')
                          : saleData.assignedDeveloperNames?.length > 0
                          ? saleData.assignedDeveloperNames.join(', ')
                          : 'Dev Lead'}{' '}
                        ({saleData.commissionRates?.developerPercent ?? 0}%)
                      </span>
                    </div>
                    {(saleData.referralPartner?.name || saleData.referralPartnerName) && (
                      <div className="flex justify-between py-1 border-b border-mx-border/50">
                        <span className="text-mx-subtle">Referral Partner</span>
                        <span className="text-white font-medium">
                          {saleData.referralPartner?.name || saleData.referralPartnerName} ({saleData.commissionRates?.referralPercent ?? 0}%)
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-mx-border/50">
                      <span className="text-mx-subtle">Deal Closed Date</span>
                      <span className="text-white font-mono">
                        {saleData.closedAt ? new Date(saleData.closedAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-mx-subtle">Initial Payment Method</span>
                      <span className="text-white font-mono">
                        {saleData.paymentMethod || 'Bank Transfer'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products / Services Included */}
              {saleData.products && saleData.products.length > 0 && (
                <div className="p-4 rounded-md bg-mx-surface border border-mx-border space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Layers size={14} className="text-mx-subtle" /> Deliverables & Scope
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-mx-border text-mx-subtle font-mono">
                          <th className="pb-2">Item / Service</th>
                          <th className="pb-2">Qty</th>
                          <th className="pb-2">Rate</th>
                          <th className="pb-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-mx-border/40">
                        {saleData.products.map((p, idx) => (
                          <tr key={idx} className="py-2">
                            <td className="py-2 text-white font-medium">{p.name || p.title || 'Product'}</td>
                            <td className="py-2 text-mx-subtle font-mono">{p.quantity || 1}</td>
                            <td className="py-2 text-mx-subtle font-mono">{fmt(p.unitPrice || p.price || p.rate || 0)}</td>
                            <td className="py-2 text-white font-mono text-right font-medium">
                              {fmt((p.unitPrice || p.price || p.rate || 0) * (p.quantity || 1))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Linked Cash Inflows & Installments */}
              <div className="p-4 rounded-md bg-mx-surface border border-mx-border space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <CreditCard size={14} className="text-mx-subtle" /> Linked Inflows & Installment Ledger ({inflows.length})
                </h3>
                {inflows.length === 0 ? (
                  <div className="py-4 text-center text-mx-subtle text-xs font-mono">
                    {saleData.advanceAmount > 0
                      ? `Initial advance of ${fmt(saleData.advanceAmount)} recorded on contract booking.`
                      : 'No payments realized yet against this contract.'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left" data-testid="table-linked-inflows">
                      <thead>
                        <tr className="border-b border-mx-border text-mx-subtle font-mono">
                          <th className="pb-2">TX Ref</th>
                          <th className="pb-2">Date</th>
                          <th className="pb-2">Type</th>
                          <th className="pb-2">Payment Rail</th>
                          <th className="pb-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-mx-border/40">
                        {inflows.map((inf) => (
                          <tr key={inf._id} className="py-2">
                            <td className="py-2 text-white font-mono">{inf.inflowNumber || String(inf._id).slice(-8)}</td>
                            <td className="py-2 text-mx-subtle font-mono">
                              {inf.date ? new Date(inf.date).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="py-2 text-white capitalize">{inf.type?.replace('_', ' ')}</td>
                            <td className="py-2 text-mx-subtle font-mono">{inf.paymentMethod || 'Bank Transfer'}</td>
                            <td className="py-2 text-emerald-400 font-mono text-right font-medium">
                              {fmt(inf.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-mx-border flex items-center justify-between bg-mx-surface">
          <span className="text-[11px] font-mono text-mx-subtle">
            Core Admin Financial Control Verified &bull; PKR Localized
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-sm bg-mx-panel border border-mx-border text-xs text-white hover:bg-mx-surface transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleDetailModal;
