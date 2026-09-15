import React, { useState, useEffect } from 'react';
import {
  FiShield,
  FiSearch,
  FiFilter,
  FiDownload,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiGlobe,
  FiEye,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import adminApi from '../services/adminApi';
import { toast } from 'react-toastify';

const ACTION_CONFIG = {
  LOGIN_SUCCESS: { label: 'Login Success', color: 'emerald', icon: FiCheckCircle },
  LOGIN_FAILED: { label: 'Login Failed', color: 'amber', icon: FiAlertCircle },
  USER_CREATE: { label: 'User Created', color: 'blue', icon: FiUser },
  USER_INVITE: { label: 'Invitation Dispatched', color: 'indigo', icon: FiUser },
  USER_UPDATE: { label: 'User Updated', color: 'cyan', icon: FiUser },
  USER_STATUS_CHANGE: { label: 'Status Changed', color: 'purple', icon: FiAlertCircle },
  USER_DELETE: { label: 'User Deleted', color: 'rose', icon: FiXCircle },
  ROLE_CREATE: { label: 'Role Created', color: 'teal', icon: FiShield },
  ROLE_UPDATE: { label: 'Role Policy Updated', color: 'teal', icon: FiShield },
  ROLE_DELETE: { label: 'Role Deleted', color: 'rose', icon: FiShield },
  UNAUTHORIZED_ATTEMPT: { label: 'Unauthorized Access Blocked', color: 'rose', icon: FiXCircle },
  INVITATION_ACCEPT: { label: 'Invitation Activated', color: 'emerald', icon: FiCheckCircle },
  SUPERADMIN_SEED: { label: 'Superadmin Provisioned', color: 'emerald', icon: FiShield },
};

const AuditLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [inspectLog, setInspectLog] = useState(null);

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
      };
      if (search.trim()) params.search = search.trim();
      if (actionFilter) params.action = actionFilter;
      if (platformFilter) params.platform = platformFilter;

      const res = await adminApi.getAuditLogs(params);
      if (res.success) {
        setLogs(res.logs || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to retrieve audit trail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [actionFilter, platformFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs(1);
  };

  const handleExport = async () => {
    try {
      const res = await adminApi.exportAuditLogs({
        action: actionFilter,
        platform: platformFilter,
      });

      if (res.success && res.logs) {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.logs, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `megatrix_audit_trail_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        toast.success(`Exported ${res.count} audit logs`);
      }
    } catch (err) {
      toast.error('Failed to export audit logs');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Security & Compliance Audit Trail
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Append-Only Ledger
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Immutable recording of authentication events, user lifecycle transitions, and permission changes
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/10 transition-all cursor-pointer"
        >
          <FiDownload className="w-4 h-4" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs" />
          <input
            type="text"
            placeholder="Search by actor, target, or action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500"
          />
        </form>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Action Filter */}
          <div className="flex items-center gap-1.5 text-xs text-white/60">
            <FiFilter className="w-3.5 h-3.5 text-white/40" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-black/60 border border-white/10 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Event Actions</option>
              {Object.keys(ACTION_CONFIG).map((key) => (
                <option key={key} value={key}>
                  {ACTION_CONFIG[key].label}
                </option>
              ))}
            </select>
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-1.5 text-xs text-white/60">
            <FiGlobe className="w-3.5 h-3.5 text-white/40" />
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-black/60 border border-white/10 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Platforms</option>
              <option value="global">Global Platform</option>
              <option value="bizmanager">Biz Manager</option>
              <option value="schoolmanager">School Manager</option>
              <option value="mailerx">MailerX</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead className="bg-white/[0.03] text-white/40 uppercase font-bold text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Timestamp (UTC)</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Target Subject</th>
                <th className="py-3.5 px-4">Platform Scope</th>
                <th className="py-3.5 px-4">Origin IP</th>
                <th className="py-3.5 px-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-white/40">
                    Loading immutable audit entries from MongoDB Atlas...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-white/40">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const actionMeta = ACTION_CONFIG[log.action] || {
                    label: log.action,
                    color: 'gray',
                    icon: FiAlertCircle,
                  };
                  const Icon = actionMeta.icon;

                  return (
                    <tr key={log._id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-white/50 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <FiClock className="w-3 h-3 text-white/30" />
                          <span>{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Action Event */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Icon
                            className={`w-3.5 h-3.5 text-${
                              actionMeta.color === 'emerald'
                                ? 'emerald-400'
                                : actionMeta.color === 'rose'
                                ? 'rose-400'
                                : actionMeta.color === 'blue'
                                ? 'blue-400'
                                : actionMeta.color === 'amber'
                                ? 'amber-400'
                                : 'white/60'
                            }`}
                          />
                          <span className="font-semibold text-white">
                            {actionMeta.label}
                          </span>
                        </div>
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-semibold text-white/90">{log.actor?.name || 'System'}</p>
                          <p className="text-[10px] text-white/40">{log.actor?.email}</p>
                        </div>
                      </td>

                      {/* Target */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="text-white/80">{log.target?.name || log.target?.type || '—'}</p>
                          {log.target?.email && (
                            <p className="text-[10px] text-white/40">{log.target?.email}</p>
                          )}
                        </div>
                      </td>

                      {/* Platform */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] uppercase font-semibold text-white/70">
                          {log.platform || 'global'}
                        </span>
                      </td>

                      {/* Origin IP */}
                      <td className="py-3.5 px-4 text-white/40 font-mono text-[10px]">
                        {log.ipAddress || '127.0.0.1'}
                      </td>

                      {/* Inspection Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setInspectLog(log)}
                          className="p-1.5 rounded-lg text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                          title="Inspect Details"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <span>
            Showing {logs.length} of {pagination.total} audit events
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => fetchLogs(pagination.page - 1)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-white">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchLogs(pagination.page + 1)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* INSPECT LOG MODAL */}
      {inspectLog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-mx-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FiShield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Audit Event Inspection
                  </h3>
                  <p className="text-xs text-white/50 font-mono">
                    ID: {inspectLog._id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectLog(null)}
                className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-1">
                  <span className="text-white/40 uppercase font-bold text-[10px]">Action Type</span>
                  <p className="text-white font-semibold font-mono">{inspectLog.action}</p>
                </div>

                <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-1">
                  <span className="text-white/40 uppercase font-bold text-[10px]">Timestamp</span>
                  <p className="text-white font-mono">{new Date(inspectLog.createdAt).toISOString()}</p>
                </div>

                <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-1">
                  <span className="text-white/40 uppercase font-bold text-[10px]">Actor</span>
                  <p className="text-white font-semibold">{inspectLog.actor?.name} ({inspectLog.actor?.role})</p>
                  <p className="text-white/40 font-mono text-[10px]">{inspectLog.actor?.email}</p>
                </div>

                <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-1">
                  <span className="text-white/40 uppercase font-bold text-[10px]">Target Subject</span>
                  <p className="text-white font-semibold">{inspectLog.target?.name || inspectLog.target?.type}</p>
                  <p className="text-white/40 font-mono text-[10px]">{inspectLog.target?.email || 'N/A'}</p>
                </div>

                <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-1">
                  <span className="text-white/40 uppercase font-bold text-[10px]">Origin IP</span>
                  <p className="text-white font-mono">{inspectLog.ipAddress}</p>
                </div>

                <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-1">
                  <span className="text-white/40 uppercase font-bold text-[10px]">Platform</span>
                  <p className="text-white font-mono uppercase">{inspectLog.platform}</p>
                </div>
              </div>

              {/* User Agent */}
              <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-1 text-xs">
                <span className="text-white/40 uppercase font-bold text-[10px]">User Agent</span>
                <p className="text-white/70 font-mono text-[11px] break-all">{inspectLog.userAgent}</p>
              </div>

              {/* Event Payload / Details */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
                  Raw Event Payload (JSON)
                </span>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto max-h-48">
                  {JSON.stringify(inspectLog.details || {}, null, 2)}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectLog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogViewer;
