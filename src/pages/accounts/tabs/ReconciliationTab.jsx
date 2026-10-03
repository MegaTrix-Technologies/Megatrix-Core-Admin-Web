import React, { useState, useEffect } from 'react';
import {
  Scale,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Plus,
  RefreshCw,
  DollarSign,
  ArrowRight,
  Calendar,
  Layers,
} from 'lucide-react';
import { accountsApi } from '../../../services/adminApi';
import { fmtPKR } from '../../../config/currency';

const ReconciliationTab = ({ onOpenAdjustment, onOpenSaleDetail, refreshKey }) => {
  const [loading, setLoading] = useState(true);
  const [auditData, setAuditData] = useState(null);

  const fetchReconciliation = async () => {
    setLoading(true);
    try {
      const res = await accountsApi.getReconciliation();
      if (res.success) {
        setAuditData(res);
      }
    } catch (err) {
      console.error('[ReconciliationTab] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReconciliation();
  }, [refreshKey]);

  const fmt = fmtPKR;

  const discrepancies = auditData?.discrepancies || [];
  const adjustments = auditData?.adjustments || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ─────────────────────────────────────────────────────────────
       * 1. RECONCILIATION SUMMARY SCORECARD
       * ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Total Ledger Anomalies
          </span>
          <span
            className={`text-2xl font-bold font-mono mt-1 block ${
              auditData?.totalDiscrepancies > 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {auditData?.totalDiscrepancies || 0}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">
            Integrity check across CRM sales & inflows
          </span>
        </div>

        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Critical Mismatches
          </span>
          <span
            className={`text-2xl font-bold font-mono mt-1 block ${
              auditData?.criticalCount > 0 ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {auditData?.criticalCount || 0}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">
            Negative balance or overpaid advances
          </span>
        </div>

        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Warnings & Unlinked Items
          </span>
          <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
            {auditData?.warningCount || 0}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">
            Status or transaction linkage checks
          </span>
        </div>

        <div className="p-4 rounded-md bg-mx-panel border border-mx-border">
          <span className="text-[10px] font-mono text-mx-subtle uppercase block">
            Applied Adjustments
          </span>
          <span className="text-2xl font-bold font-mono text-mx-blue mt-1 block">
            {adjustments.length}
          </span>
          <span className="text-[10px] font-mono text-mx-subtle">
            Controlled General Ledger adjustments
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 2. CONTROLS BAR
       * ───────────────────────────────────────────────────────────── */}
      <div className="p-4 rounded-md bg-mx-panel border border-mx-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale size={16} className="text-amber-400" />
          <span className="text-xs font-bold text-white uppercase font-mono">
            Automated Financial Integrity Scanner
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReconciliation}
            disabled={loading}
            className="px-3 py-1.5 rounded-sm bg-mx-surface border border-mx-border text-xs text-mx-subtle hover:text-white transition-colors flex items-center gap-1.5"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Rescan
          </button>
          <button
            onClick={() => onOpenAdjustment()}
            className="px-3 py-1.5 rounded-sm bg-amber-500 text-xs font-bold text-black hover:bg-amber-400 transition-colors flex items-center gap-1.5"
          >
            <Plus size={14} /> Record Adjustment
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 3. DISCREPANCY CARDS LIST
       * ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          Detected Discrepancies & Ledger Anomalies ({discrepancies.length})
        </h4>

        {loading ? (
          <div className="py-12 text-center text-mx-subtle text-xs font-mono">
            Running automated financial discrepancy audits...
          </div>
        ) : discrepancies.length === 0 ? (
          <div className="p-8 rounded-md bg-emerald-500/5 border border-emerald-500/20 text-center space-y-2">
            <ShieldCheck size={32} className="text-emerald-400 mx-auto" />
            <h5 className="text-sm font-bold text-emerald-400 font-mono">
              All Ledgers in Perfect Balance
            </h5>
            <p className="text-xs text-mx-subtle max-w-md mx-auto">
              No negative balances, unlinked transactions, or calculation mismatches were detected across MegaTrix Core ledgers.
            </p>
          </div>
        ) : (
          discrepancies.map((disc, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-md border space-y-3 ${
                disc.severity === 'HIGH'
                  ? 'bg-red-500/5 border-red-500/30'
                  : disc.severity === 'MEDIUM'
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : 'bg-mx-panel border-mx-border'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase font-bold ${
                      disc.severity === 'HIGH'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : disc.severity === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {disc.severity}
                  </span>
                  <h5 className="text-xs font-bold text-white font-mono">{disc.title}</h5>
                </div>

                {disc.difference !== 0 && (
                  <span className="text-xs font-mono font-bold text-red-400">
                    Delta: {fmt(disc.difference)}
                  </span>
                )}
              </div>

              <p className="text-xs text-mx-subtle">{disc.description}</p>

              <div className="p-3 rounded-sm bg-mx-surface/80 border border-mx-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-mx-subtle uppercase block">
                    Recommended Resolution Pathway
                  </span>
                  <span className="text-white font-medium">{disc.resolution}</span>
                </div>

                <div className="flex items-center gap-2">
                  {disc.entityType === 'sale' && disc.entityId && (
                    <button
                      onClick={() => onOpenSaleDetail(disc.entityId)}
                      className="px-2.5 py-1 rounded-sm bg-mx-panel border border-mx-border text-[11px] font-mono text-mx-blue hover:text-white"
                    >
                      Inspect Sale
                    </button>
                  )}
                  <button
                    onClick={() =>
                      onOpenAdjustment({
                        title: `Resolution for ${disc.title}`,
                        difference: disc.difference,
                        entityType: disc.entityType,
                        entityId: disc.entityId,
                        reason: `Correction applied for discrepancy [${disc.type}]: ${disc.description}`,
                      })
                    }
                    className="px-2.5 py-1 rounded-sm bg-amber-500 text-[11px] font-mono font-bold text-black hover:bg-amber-400"
                  >
                    Apply Fix
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 4. ADMINISTRATIVE ADJUSTMENTS LEDGER
       * ───────────────────────────────────────────────────────────── */}
      <div className="rounded-md bg-mx-panel border border-mx-border overflow-hidden space-y-3 p-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          Controlled Administrative Adjustments Log ({adjustments.length})
        </h4>

        {adjustments.length === 0 ? (
          <div className="py-6 text-center text-mx-subtle text-xs font-mono">
            No administrative adjustments have been recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-mx-border text-mx-subtle font-mono">
                  <th className="pb-2">Adjustment Memo</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Reason</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-right">Amount</th>
                  <th className="pb-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mx-border/40">
                {adjustments.map((adj) => (
                  <tr key={adj._id} className="py-2">
                    <td className="py-2.5 text-white font-medium">{adj.title}</td>
                    <td className="py-2.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase bg-mx-surface text-mx-subtle border border-mx-border">
                        {adj.adjustmentType?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 text-mx-subtle max-w-xs truncate">{adj.reason}</td>
                    <td className="py-2.5 font-mono text-mx-subtle whitespace-nowrap">
                      {adj.effectiveDate ? new Date(adj.effectiveDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-amber-400">
                      {fmt(adj.amount)}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {adj.status || 'applied'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReconciliationTab;
