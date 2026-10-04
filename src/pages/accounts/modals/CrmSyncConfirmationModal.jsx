import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Users,
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  Square,
  Check,
} from 'lucide-react';
import { fmtPKR } from '../../../config/currency';
import { toast } from 'react-toastify';
import { accountsApi } from '../../../services/adminApi';

const CrmSyncConfirmationModal = ({ previewData, onClose, onSyncSuccess }) => {
  const [activeSubTab, setActiveSubTab] = useState('sales'); // 'sales', 'agents'
  const [syncing, setSyncing] = useState(false);

  // Filter pending new or updated deals
  const pendingSales = (previewData?.salesDiff || []).filter(
    (s) => s.diffStatus === 'NEW' || s.diffStatus === 'UPDATE'
  );
  const hasPendingDeals = pendingSales.length > 0;

  // Maintain selected sale IDs (default to only new/updated deals if any exist)
  const [selectedSaleIds, setSelectedSaleIds] = useState(() => {
    return pendingSales.map((s) => s.legacyId);
  });

  if (!previewData) return null;

  const { stats = {}, salesDiff = [], agentsSummary = [] } = previewData;

  const toggleSelectAll = () => {
    if (selectedSaleIds.length === pendingSales.length) {
      setSelectedSaleIds([]);
    } else {
      setSelectedSaleIds(pendingSales.map((s) => s.legacyId));
    }
  };

  const toggleSaleSelection = (id) => {
    setSelectedSaleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmSync = async () => {
    if (selectedSaleIds.length === 0) {
      toast.info('No pending deals selected for sync.');
      return;
    }

    setSyncing(true);
    try {
      const res = await accountsApi.executeCrmSync({
        selectedSaleIds,
      });

      if (res.success) {
        toast.success(
          `Sync Successful! ${res.summary?.createdSales || 0} created, ${res.summary?.updatedSales || 0} updated.`
        );
        onSyncSuccess?.(res);
        onClose();
      } else {
        toast.error(res.message || 'Failed to complete CRM synchronization.');
      }
    } catch (err) {
      console.error('[CrmSyncConfirmationModal] Sync error:', err);
      toast.error(err.response?.data?.message || err.message || 'Synchronization failed.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-mx-bg border border-mx-border rounded-xl shadow-2xl overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-mx-border bg-mx-panel/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <RefreshCw size={20} className={syncing ? 'animate-spin' : ''} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  CRM Live Synchronization Preview
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LeadHunter ➔ Core Master
                </span>
              </div>
              <p className="text-xs text-mx-subtle font-mono">
                Review verified sales contracts, advances, and rep commission structures
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={syncing}
            className="p-1.5 rounded-lg text-mx-subtle hover:text-white hover:bg-mx-surface transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* KPI Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-mx-surface/40 border-b border-mx-border text-xs font-mono">
          <div className="p-3 rounded-lg bg-mx-panel border border-mx-border">
            <div className="text-mx-subtle text-[11px] mb-1 flex items-center gap-1.5">
              <DollarSign size={13} className="text-blue-400" /> Booked Contracts
            </div>
            <div className="text-base font-bold text-white">{fmtPKR(stats.totalSalesValue || 0)}</div>
            <div className="text-[10px] mt-0.5 font-bold">
              {stats.newSalesCount > 0 ? (
                <span className="text-emerald-400">+{stats.newSalesCount} new deal{stats.newSalesCount === 1 ? '' : 's'} detected</span>
              ) : stats.updatedSalesCount > 0 ? (
                <span className="text-blue-400">{stats.updatedSalesCount} updated deal{stats.updatedSalesCount === 1 ? '' : 's'}</span>
              ) : (
                <span className="text-emerald-400">All {stats.totalCrmSales || 0} deals up to date</span>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-mx-panel border border-mx-border">
            <div className="text-mx-subtle text-[11px] mb-1 flex items-center gap-1.5">
              <TrendingUp size={13} className="text-emerald-400" /> Realized Advance Cash
            </div>
            <div className="text-base font-bold text-emerald-400">{fmtPKR(stats.totalAdvanceCash || 0)}</div>
            <div className="text-[10px] text-mx-subtle mt-0.5">Auto-generates Inflow Ledger records</div>
          </div>

          <div className="p-3 rounded-lg bg-mx-panel border border-mx-border">
            <div className="text-mx-subtle text-[11px] mb-1 flex items-center gap-1.5">
              <Percent size={13} className="text-purple-400" /> Commission Accrual
            </div>
            <div className="text-base font-bold text-purple-300">{fmtPKR(stats.totalCommissionLiabilities || 0)}</div>
            <div className="text-[10px] text-mx-subtle mt-0.5">Exact active rep rate cards</div>
          </div>

          <div className="p-3 rounded-lg bg-mx-panel border border-mx-border">
            <div className="text-mx-subtle text-[11px] mb-1 flex items-center gap-1.5">
              <Users size={13} className="text-amber-400" /> Sales Team Profiles
            </div>
            <div className="text-base font-bold text-white">{stats.totalAgents || 0} Agents</div>
            <div className="text-[10px] text-amber-400 mt-0.5">Synced with custom rate cards</div>
          </div>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-mx-border bg-mx-panel/20">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('sales')}
              className={`px-4 py-2 text-xs font-mono font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'sales'
                  ? 'text-mx-blue border-mx-blue bg-mx-blue/5'
                  : 'text-mx-subtle border-transparent hover:text-white'
              }`}
            >
              <Layers size={14} />
              Sales Contracts ({hasPendingDeals ? pendingSales.length : salesDiff.length})
            </button>
            <button
              onClick={() => setActiveSubTab('agents')}
              className={`px-4 py-2 text-xs font-mono font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'agents'
                  ? 'text-mx-blue border-mx-blue bg-mx-blue/5'
                  : 'text-mx-subtle border-transparent hover:text-white'
              }`}
            >
              <Users size={14} />
              Sales Team & Rate Cards ({agentsSummary.length})
            </button>
          </div>

          {activeSubTab === 'sales' && hasPendingDeals && (
            <button
              onClick={toggleSelectAll}
              className="text-[11px] font-mono text-mx-subtle hover:text-white flex items-center gap-1.5 cursor-pointer pb-2"
            >
              {selectedSaleIds.length === pendingSales.length ? (
                <>
                  <CheckSquare size={13} className="text-emerald-400" /> Deselect All
                </>
              ) : (
                <>
                  <Square size={13} /> Select All ({pendingSales.length})
                </>
              )}
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[50vh]">
          {activeSubTab === 'sales' ? (
            salesDiff.length === 0 ? (
              <div className="py-12 text-center text-mx-subtle text-xs font-mono">
                No sales records found in LeadHunter CRM.
              </div>
            ) : !hasPendingDeals ? (
              /* CLEAN, ZERO-CLUTTER UP-TO-DATE STATE */
              <div className="p-8 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-4 my-2">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <ShieldCheck size={28} />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-base font-bold text-white tracking-wide">
                    All CRM Records are Up to Date
                  </h3>
                  <p className="text-xs text-mx-subtle font-mono leading-relaxed">
                    All {salesDiff.length} contract{salesDiff.length === 1 ? '' : 's'} from LeadHunter CRM are already synchronized in the master ledger with matching values, advance cash, and commission rate cards.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-mono">
                  <span className="px-3 py-1 rounded bg-mx-surface border border-mx-border text-white">
                    Booked Value: <strong>{fmtPKR(stats.totalSalesValue || 0)}</strong>
                  </span>
                  <span className="px-3 py-1 rounded bg-mx-surface border border-mx-border text-emerald-400">
                    Realized Advance: <strong>{fmtPKR(stats.totalAdvanceCash || 0)}</strong>
                  </span>
                  <span className="px-3 py-1 rounded bg-mx-surface border border-mx-border text-purple-300">
                    Commission: <strong>{fmtPKR(stats.totalCommissionLiabilities || 0)}</strong>
                  </span>
                </div>
              </div>
            ) : (
              /* PENDING DEALS (NEW OR UPDATED ONLY) */
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-300 flex items-center justify-between">
                  <span>{pendingSales.length} new or updated deal{pendingSales.length === 1 ? '' : 's'} detected from LeadHunter CRM.</span>
                  <span className="text-[10px] text-mx-subtle">Select deals to import</span>
                </div>

                {pendingSales.map((sale) => {
                  const isSelected = selectedSaleIds.includes(sale.legacyId);

                  return (
                    <div
                      key={sale.legacyId}
                      onClick={() => toggleSaleSelection(sale.legacyId)}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-mx-panel border-emerald-500/40 shadow-sm'
                          : 'bg-mx-surface/30 border-mx-border/40 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-emerald-400">
                            {isSelected ? (
                              <CheckSquare size={16} />
                            ) : (
                              <Square size={16} className="text-mx-subtle" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">
                                {sale.customer?.businessName}
                              </span>
                              {sale.diffStatus === 'NEW' ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  + NEW DEAL
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  UPDATED DEAL
                                </span>
                              )}
                              <span className="text-[11px] font-mono text-mx-subtle">
                                {sale.saleNumber}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-mx-subtle font-mono">
                              <span>
                                <strong className="text-white">Closer:</strong> {sale.closedByName}
                                {sale.closerPercent > 0 ? ` (${sale.closerPercent}%)` : ''}
                              </span>
                              <span>
                                <strong className="text-white">Lead Gen:</strong> {sale.leadGeneratedByName}
                                {sale.leadGenPercent > 0 ? ` (${sale.leadGenPercent}%)` : ' (0%)'}
                              </span>
                              {sale.assignedDeveloperNames?.length > 0 && (
                                <span>
                                  <strong className="text-white">Dev:</strong> {sale.assignedDeveloperNames.join(', ')}
                                  {sale.devPercent > 0 ? ` (${sale.devPercent}%)` : ''}
                                </span>
                              )}
                            </div>

                            {sale.notes && (
                              <p className="text-[11px] text-mx-subtle italic mt-2 line-clamp-1 bg-mx-surface/60 px-2.5 py-1 rounded border border-mx-border/50">
                                💬 "{sale.notes}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Financial figures on the right */}
                        <div className="text-right shrink-0 font-mono">
                          <div className="text-sm font-bold text-white">
                            {fmtPKR(sale.totalAmount)}
                          </div>
                          <div className="text-[11px] text-emerald-400">
                            Advance: {fmtPKR(sale.advanceAmount)}
                          </div>
                          <div className="text-[11px] text-amber-400">
                            Due: {fmtPKR(sale.remainingAmount)}
                          </div>
                          <div className="text-[10px] text-purple-300 mt-0.5">
                            Est. Comm: {fmtPKR(sale.totalEstimatedCommission)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Agents & Rate Cards SubTab */
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-mx-surface/80 border border-mx-border text-xs text-mx-subtle font-mono flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-400 shrink-0" />
                These pre-configured rate cards automatically apply when selecting outreach reps in Core Admin deals.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agentsSummary.map((agent) => (
                  <div
                    key={agent.id}
                    className="p-3.5 rounded-lg bg-mx-panel border border-mx-border text-xs font-mono space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-sm">{agent.name}</div>
                        <div className="text-[11px] text-mx-subtle">{agent.email || 'No email registered'}</div>
                      </div>
                      <div className="flex gap-1">
                        {(agent.roles || []).map((r) => (
                          <span
                            key={r}
                            className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-mx-surface border border-mx-border text-blue-300"
                          >
                            {r.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-mx-border text-center text-[11px]">
                      <div className="p-1.5 rounded bg-mx-surface border border-mx-border/50">
                        <div className="text-mx-subtle text-[10px]">Lead Gen</div>
                        <div className="font-bold text-emerald-400">{agent.commissionRates.leadGenPercent}%</div>
                      </div>
                      <div className="p-1.5 rounded bg-mx-surface border border-mx-border/50">
                        <div className="text-mx-subtle text-[10px]">Closer</div>
                        <div className="font-bold text-blue-400">{agent.commissionRates.closerPercent}%</div>
                      </div>
                      <div className="p-1.5 rounded bg-mx-surface border border-mx-border/50">
                        <div className="text-mx-subtle text-[10px]">Referral</div>
                        <div className="font-bold text-purple-400">{agent.commissionRates.referralPercent}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-mx-border bg-mx-panel/60">
          <div className="text-xs font-mono text-mx-subtle flex items-center gap-1.5">
            {hasPendingDeals && selectedSaleIds.length > 0 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {selectedSaleIds.length} pending deal{selectedSaleIds.length === 1 ? '' : 's'} selected for sync
              </>
            ) : (
              <>
                <Check size={14} className="text-emerald-400" />
                All CRM data synchronized
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!hasPendingDeals ? (
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 size={14} />
                Done (All Up to Date)
              </button>
            ) : (
              <>
                <button
                  onClick={onClose}
                  disabled={syncing}
                  className="px-4 py-2 rounded-sm border border-mx-border bg-mx-surface hover:bg-mx-panel text-white text-xs font-mono transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSync}
                  disabled={syncing || selectedSaleIds.length === 0}
                  className="px-5 py-2 rounded-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {syncing ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Synchronizing ({selectedSaleIds.length})...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      Sync Selected ({selectedSaleIds.length}) to Master
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrmSyncConfirmationModal;
