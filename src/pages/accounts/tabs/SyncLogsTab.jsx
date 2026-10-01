import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  Globe,
  Clock,
  Layers,
  Server,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { accountsApi } from '../../../services/adminApi';

const SyncLogsTab = ({ onSyncSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncData, setSyncData] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await accountsApi.getSyncLogs();
      if (res.success) {
        setSyncData(res);
      }
    } catch (err) {
      console.error('[SyncLogsTab] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      const res = await accountsApi.triggerSync();
      if (res.success) {
        toast.success(`Synchronized in ${res.meta?.durationMs || 0}ms via ${res.meta?.mode}`);
        fetchLogs();
        if (onSyncSuccess) onSyncSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const logs = syncData?.logs || [];
  const lastStatus = syncData?.lastStatus || {};

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ─────────────────────────────────────────────────────────────
       * 1. LIVE SYNC ENGINE STATUS CARD
       * ───────────────────────────────────────────────────────────── */}
      <div className="p-5 rounded-md bg-mx-panel border border-mx-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-mx-surface border border-mx-border flex items-center justify-center text-emerald-400">
            <Server size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              LeadHunter Telemetry Engine
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase ${
                  lastStatus.status === 'success' || lastStatus.mode === 'api_gateway'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {lastStatus.mode === 'api_gateway' ? 'Primary API Gateway' : 'Atlas Direct Fallback'}
              </span>
            </h3>
            <p className="text-xs text-mx-subtle font-mono">
              Last Sync: {lastStatus.lastSync ? new Date(lastStatus.lastSync).toLocaleString() : 'N/A'} | Duration: {lastStatus.durationMs || 0}ms
            </p>
          </div>
        </div>

        <button
          onClick={handleManualSync}
          disabled={syncing}
          className="px-4 py-2 rounded-sm bg-mx-blue text-xs font-bold text-white hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 font-mono"
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Synchronizing CRM...' : 'Force Live Sync'}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 2. RECENT SYNCHRONIZATION AUDIT LOGS
       * ───────────────────────────────────────────────────────────── */}
      <div className="rounded-md bg-mx-panel border border-mx-border overflow-hidden">
        <div className="p-4 border-b border-mx-border bg-mx-surface">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            CRM Synchronization Audit Trail (Last 30 Sync Runs)
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-mx-border bg-mx-surface/60 text-mx-subtle font-mono">
                <th className="px-4 py-2.5">Sync ID</th>
                <th className="px-4 py-2.5">Completed At</th>
                <th className="px-4 py-2.5">Mode / Pipeline</th>
                <th className="px-4 py-2.5 text-center">Duration</th>
                <th className="px-4 py-2.5 text-right">Records Synced</th>
                <th className="px-4 py-2.5">Triggered By</th>
                <th className="px-4 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mx-border/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-mx-subtle font-mono">
                    Loading synchronization audit history...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-mx-subtle font-mono">
                    No sync logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-mx-surface/60 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-mx-subtle">
                      {log.syncId}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-mx-subtle whitespace-nowrap">
                      {log.completedAt ? new Date(log.completedAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase ${
                          log.mode === 'api_gateway'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}
                      >
                        {log.mode?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center font-mono text-white">
                      {log.durationMs}ms
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-white font-medium">
                      {log.recordsFetched?.total || 0} items
                      <span className="text-[10px] text-mx-subtle block">
                        (S: {log.recordsFetched?.sales || 0}, I: {log.recordsFetched?.inflows || 0}, E: {log.recordsFetched?.expenses || 0})
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-mx-subtle">
                      {log.triggeredBy?.name || 'Automated Engine'}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {log.status}
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

export default SyncLogsTab;
