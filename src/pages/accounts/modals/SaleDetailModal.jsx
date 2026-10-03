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
} from 'lucide-react';
import { accountsApi } from '../../../services/adminApi';
import { fmtPKR } from '../../../config/currency';

const SaleDetailModal = ({ saleId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [saleData, setSaleData] = useState(null);
  const [inflows, setInflows] = useState([]);
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!saleId) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await accountsApi.getSaleDetail(saleId);
        if (res.success) {
          setSaleData(res.sale);
          setInflows(res.inflows || []);
          setProject(res.project || null);
        } else {
          setError(res.message || 'Failed to load sale details');
        }
      } catch (err) {
        setError(err.message || 'Network error fetching sale details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [saleId]);

  if (!saleId) return null;

  const fmt = fmtPKR;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-mx-panel border border-mx-border rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 border-b border-mx-border flex items-center justify-between bg-mx-surface">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-mx-panel border border-mx-border flex items-center justify-center text-mx-blue">
              <DollarSign size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Sale Dossier: #{saleId}
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
                Core Sales Contract Reference & Realized Telemetry
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
                  <span className="text-lg font-bold font-mono text-white mt-1 block">
                    {fmt(saleData.totalAmount)}
                  </span>
                </div>
                <div className="p-3 rounded-md bg-mx-surface border border-mx-border">
                  <span className="text-[10px] font-mono text-mx-subtle uppercase block">
                    Advance Collected
                  </span>
                  <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
                    {fmt(saleData.advanceAmount)}
                  </span>
                </div>
                <div className="p-3 rounded-md bg-mx-surface border border-mx-border">
                  <span className="text-[10px] font-mono text-mx-subtle uppercase block">
                    Remaining Receivable
                  </span>
                  <span className="text-lg font-bold font-mono text-amber-400 mt-1 block">
                    {fmt(
                      saleData.remainingAmount !== undefined
                        ? saleData.remainingAmount
                        : Math.max(0, saleData.totalAmount - saleData.advanceAmount)
                    )}
                  </span>
                </div>
                <div className="p-3 rounded-md bg-mx-surface border border-mx-border">
                  <span className="text-[10px] font-mono text-mx-subtle uppercase block">
                    Estimated Commission
                  </span>
                  <span className="text-lg font-bold font-mono text-purple-400 mt-1 block">
                    {fmt(saleData.estimatedCommission)}
                  </span>
                </div>
              </div>

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
                      <span className="text-white font-medium">
                        {saleData.customer?.businessName || saleData.customer?.name || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-mx-border/50">
                      <span className="text-mx-subtle">Contact Person</span>
                      <span className="text-white">
                        {saleData.customer?.name || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-mx-border/50">
                      <span className="text-mx-subtle">Phone</span>
                      <span className="text-white font-mono">
                        {saleData.customer?.phone || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-mx-border/50">
                      <span className="text-mx-subtle">Category / Industry</span>
                      <span className="text-white font-mono">
                        {saleData.customer?.category || 'General'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-mx-subtle">Location / Area</span>
                      <span className="text-white">
                        {saleData.customer?.area || 'N/A'}
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
                        {saleData.closedByName || saleData.closedBy?.name || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-mx-border/50">
                      <span className="text-mx-subtle">Lead Generator / Setter</span>
                      <span className="text-white">
                        {saleData.leadGeneratedByName || saleData.leadGeneratedBy?.name || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-mx-border/50">
                      <span className="text-mx-subtle">Assigned Developers</span>
                      <span className="text-white">
                        {saleData.assignedDeveloperNames?.length > 0
                          ? saleData.assignedDeveloperNames.join(', ')
                          : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-mx-border/50">
                      <span className="text-mx-subtle">Deal Closed Date</span>
                      <span className="text-white font-mono">
                        {saleData.closedAt ? new Date(saleData.closedAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-mx-subtle">Payment Method</span>
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
                            <td className="py-2 text-mx-subtle font-mono">{fmt(p.price || p.rate || 0)}</td>
                            <td className="py-2 text-white font-mono text-right font-medium">
                              {fmt((p.price || p.rate || 0) * (p.quantity || 1))}
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
                  <CreditCard size={14} className="text-mx-subtle" /> Cash Inflow Transactions ({inflows.length})
                </h3>
                {inflows.length === 0 ? (
                  <div className="py-4 text-center text-mx-subtle text-xs font-mono">
                    Initial advance of {fmt(saleData.advanceAmount)} recorded directly on contract booking. No secondary installment transactions.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-mx-border text-mx-subtle font-mono">
                          <th className="pb-2">TX Ref</th>
                          <th className="pb-2">Date</th>
                          <th className="pb-2">Type</th>
                          <th className="pb-2">Method</th>
                          <th className="pb-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-mx-border/40">
                        {inflows.map((inf) => (
                          <tr key={inf._id} className="py-2">
                            <td className="py-2 text-white font-mono">{inf._id}</td>
                            <td className="py-2 text-mx-subtle font-mono">
                              {inf.date ? new Date(inf.date).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="py-2 text-white capitalize">{inf.type?.replace('_', ' ')}</td>
                            <td className="py-2 text-mx-subtle font-mono">{inf.paymentMethod || 'Bank'}</td>
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
            Core Admin Ledger Verified
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
