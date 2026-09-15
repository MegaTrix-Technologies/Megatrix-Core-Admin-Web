import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import adminApi from '../services/adminApi';
import MetricCard from '../components/MetricCard';
import StatusPill from '../components/StatusPill';
import SubscriptionModal from '../components/SubscriptionModal';
import {
  FiAward,
  FiClock,
  FiAlertTriangle,
  FiTrendingUp,
  FiSlash,
  FiRefreshCw,
  FiPlusCircle,
  FiCheckCircle,
  FiCalendar,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const SubscriptionManagement = () => {
  const { activePlatform } = useAdminAuth();

  const [metrics, setMetrics] = useState(null);
  const [overviewStats, setOverviewStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Subscription modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [subModalOpen, setSubModalOpen] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, [activePlatform]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const [metricsRes, overviewRes] = await Promise.all([
        adminApi.get('/api/admin/subscriptions/metrics'),
        adminApi.get('/api/admin/overview'),
      ]);

      if (metricsRes.data && metricsRes.data.success) {
        setMetrics(metricsRes.data.metrics);
      }
      if (overviewRes.data && overviewRes.data.success) {
        setOverviewStats(overviewRes.data.stats || {});
      }
    } catch (error) {
      console.error('Failed to load subscription metrics:', error);
      toast.error('Failed to load subscription metrics.');
    } finally {
      setLoading(false);
    }
  };

  const expiringList = metrics?.expiringIn7Days || [];
  const recentRenewals = metrics?.recentRenewals || [];
  const planDistribution = metrics?.planDistribution || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-mx-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Subscription & License Control
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Service 2
            </span>
          </div>
          <p className="text-xs text-mx-subtle mt-1">
            Real-time licensing metrics, manual plan overrides, trial extensions, and audit logs on{' '}
            {activePlatform.name}.
          </p>
        </div>

        <button
          onClick={fetchSubscriptionData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mx-elevated hover:bg-mx-border2 text-xs font-semibold text-neutral-200 transition-all border border-mx-border2 self-start sm:self-auto"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Primary Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Paid Licenses"
          value={overviewStats.activePaidSubs || 0}
          subtitle="Paying retail businesses"
          icon={FiAward}
          color="emerald"
        />
        <MetricCard
          title="Active Free Trials"
          value={overviewStats.activeTrials || 0}
          subtitle="14-day trial period"
          icon={FiClock}
          color="sky"
        />
        <MetricCard
          title="Expiring Next 7 Days"
          value={overviewStats.expiringSoon || 0}
          subtitle="Imminent renewal targets"
          icon={FiAlertTriangle}
          color="amber"
        />
        <MetricCard
          title="Expired / Churned"
          value={overviewStats.expiredSubs || 0}
          subtitle="Access currently locked"
          icon={FiSlash}
          color="rose"
        />
      </div>

      {/* Plan Distribution Breakdown */}
      <div className="bg-mx-surface border border-mx-border rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Plan Distribution Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {planDistribution.map((item) => (
            <div
              key={item._id || 'trial'}
              className="bg-mx-elevated p-4 rounded-2xl border border-mx-border2/60"
            >
              <span className="text-mx-subtle text-xs capitalize font-semibold block">
                {item._id || 'Trial'}
              </span>
              <strong className="text-xl font-extrabold text-white mt-1 block">
                {item.count} users
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Section: Expiring Subscriptions & License Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Expiring in Next 7 Days */}
        <div className="bg-mx-surface border border-mx-border rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-mx-border">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FiAlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Expiring Within 7 Days</span>
              </h3>
              <p className="text-xs text-mx-subtle">Users who require immediate renewal outreach</p>
            </div>
          </div>

          {expiringList.length === 0 ? (
            <div className="text-center py-10 text-xs text-mx-muted">
              No subscriptions expiring in the next 7 days.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-mx-muted border-b border-mx-border uppercase font-bold text-[10px]">
                    <th className="pb-2">User / Shop</th>
                    <th className="pb-2">Plan</th>
                    <th className="pb-2">Expires</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mx-border">
                  {expiringList.map((u) => {
                    const expiresAt = u.subscription?.expiresAt
                      ? new Date(u.subscription.expiresAt)
                      : new Date();
                    const daysRemaining = Math.max(
                      0,
                      Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    );

                    return (
                      <tr key={u._id} className="hover:bg-mx-elevated/60 transition-colors">
                        <td className="py-2.5">
                          <span className="font-bold text-white block">{u.name}</span>
                          <span className="text-[11px] text-mx-subtle">{u.shopName || u.email}</span>
                        </td>
                        <td className="py-2.5">
                          <span className="capitalize font-semibold text-neutral-300">
                            {u.subscription?.plan || 'trial'}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className="text-amber-400 font-bold">{daysRemaining}d left</span>
                          <span className="text-[10px] text-mx-muted block">
                            {expiresAt.toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setSubModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white text-black hover:bg-white/90 text-white font-bold text-[11px] shadow-sm transition-all"
                          >
                            Extend / Upgrade
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Recent Overrides / Audit Log */}
        <div className="bg-mx-surface border border-mx-border rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-mx-border">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FiCalendar className="w-4 h-4 text-emerald-400" />
                <span>Recent License Overrides & Audit</span>
              </h3>
              <p className="text-xs text-mx-subtle">Log of recent plan assignments and extensions</p>
            </div>
          </div>

          {recentRenewals.length === 0 ? (
            <div className="text-center py-10 text-xs text-mx-muted">
              No recent license changes logged.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {recentRenewals.map((u) => {
                const history = u.subscription?.history || [];
                const latest = history[history.length - 1] || {};

                return (
                  <div
                    key={u._id}
                    className="bg-mx-elevated border border-mx-border p-3 rounded-2xl text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-white">{u.name}</strong>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        {latest.plan || 'Active'}
                      </span>
                    </div>
                    <p className="text-mx-subtle text-[11px]">{latest.note || 'Plan granted by SuperAdmin'}</p>
                    <div className="flex items-center justify-between text-[10px] text-mx-muted pt-1 border-t border-mx-border/60">
                      <span>By: {latest.changedBy || 'SuperAdmin'}</span>
                      <span>
                        {latest.changedAt ? new Date(latest.changedAt).toLocaleString() : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={subModalOpen}
        onClose={() => setSubModalOpen(false)}
        user={selectedUser}
        onSuccess={fetchSubscriptionData}
      />
    </div>
  );
};

export default SubscriptionManagement;
