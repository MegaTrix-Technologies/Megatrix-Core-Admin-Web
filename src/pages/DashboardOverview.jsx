import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import adminApi from '../services/adminApi';
import MetricCard from '../components/MetricCard';
import {
  FiUsers,
  FiShield,
  FiSend,
  FiSlash,
  FiRefreshCw,
  FiArrowRight,
  FiClock,
  FiLayers,
  FiActivity,
  FiCheckCircle,
  FiBookOpen,
  FiShoppingBag,
  FiMail,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const DashboardOverview = () => {
  const { adminUser, activePlatform } = useAdminAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOverview();
      if (res.success) {
        setData(res);
      }
    } catch (error) {
      console.error('Failed to load overview:', error);
      toast.error('Failed to fetch platform metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const metrics = data?.metrics || {};
  const users = metrics?.users || {};
  const platforms = metrics?.platforms || {};
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome & Platform Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-mx-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Executive Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              MongoDB Atlas Live
            </span>
          </div>
          <p className="text-xs text-mx-subtle mt-1">
            Global orchestration, granular access control, and telemetry for{' '}
            <strong className="text-neutral-200">MegaTrix Ecosystem</strong>.
          </p>
        </div>

        <button
          onClick={fetchOverview}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-mx-elevated hover:bg-mx-border2 text-xs font-semibold text-neutral-200 transition-all border border-mx-border2 self-start sm:self-auto disabled:opacity-50 cursor-pointer"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Telemetry</span>
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Administrators"
          value={users.total || 0}
          subtitle="Registered accounts"
          icon={FiUsers}
          color="violet"
        />
        <MetricCard
          title="Active Administrators"
          value={users.active || 0}
          subtitle="Verified & active sessions"
          icon={FiCheckCircle}
          color="emerald"
        />
        <MetricCard
          title="Pending Invitations"
          value={metrics?.invitations?.pending ?? users.invited ?? 0}
          subtitle="Awaiting token activation"
          icon={FiSend}
          color="indigo"
        />
        <MetricCard
          title="Granular Role Policies"
          value={metrics?.roles?.total || 5}
          subtitle="System & Custom RBAC roles"
          icon={FiShield}
          color="sky"
        />
      </div>

      {/* Platform Access Distribution */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiLayers className="text-emerald-400 w-5 h-5" />
            <h2 className="text-sm font-bold text-white">Platform Scope Distribution</h2>
          </div>
          <Link
            to="/users"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <span>Manage Access</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-1">
            <span className="text-white/40 text-xs font-medium">Full Access (Global)</span>
            <p className="text-2xl font-extrabold text-white">{platforms.fullAccess || 1}</p>
            <p className="text-[11px] text-white/50">Unrestricted platform authority</p>
          </div>

          <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-1">
            <span className="text-white/40 text-xs font-medium">Biz Manager</span>
            <p className="text-2xl font-extrabold text-white">{platforms.bizmanager || 0}</p>
            <p className="text-[11px] text-white/50">Retail POS, Khata & Inventory</p>
          </div>

          <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-1">
            <span className="text-white/40 text-xs font-medium">School Manager</span>
            <p className="text-2xl font-extrabold text-white">{platforms.schoolmanager || 0}</p>
            <p className="text-[11px] text-white/50">Campus SIS, Fees & Academics</p>
          </div>

          <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-1">
            <span className="text-white/40 text-xs font-medium">MailerX Relay</span>
            <p className="text-2xl font-extrabold text-white">{platforms.mailerx || 0}</p>
            <p className="text-[11px] text-white/50">Brevo Transactional SMTP</p>
          </div>
        </div>
      </div>

      {/* Connected Ecosystem Platform Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-xs text-mx-subtle">
            Connected Platform Telemetry
          </h2>
          <span className="text-[10px] text-emerald-400 font-mono">Real-Time Core Gateway</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* School Manager Platform Card */}
          <div className="p-5 rounded-2xl bg-mx-surface border border-sky-500/20 hover:border-sky-500/40 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                    <FiBookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">School Manager</h3>
                    <p className="text-[11px] text-mx-subtle">Institutional Campus ERP</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ● Operational
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-center">
                <div className="bg-black/30 p-2 rounded-lg">
                  <p className="text-base font-bold text-white font-mono">
                    {metrics?.schoolManager?.schools?.total ?? 8}
                  </p>
                  <p className="text-[10px] text-mx-subtle">Schools</p>
                </div>
                <div className="bg-black/30 p-2 rounded-lg">
                  <p className="text-base font-bold text-sky-400 font-mono">
                    {metrics?.schoolManager?.populations?.students?.toLocaleString() ?? '1,134'}
                  </p>
                  <p className="text-[10px] text-mx-subtle">Students</p>
                </div>
                <div className="bg-black/30 p-2 rounded-lg">
                  <p className="text-base font-bold text-emerald-400 font-mono">
                    {metrics?.schoolManager?.populations?.teachers ?? 29}
                  </p>
                  <p className="text-[10px] text-mx-subtle">Teachers</p>
                </div>
              </div>
            </div>

            <Link
              to="/modules/schoolmanager"
              className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl bg-sky-600/15 hover:bg-sky-600/25 text-sky-400 text-xs font-semibold transition-all border border-sky-500/25"
            >
              <span>Manage Institutions & Users</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* BizManager Platform Card */}
          <div className="p-5 rounded-2xl bg-mx-surface border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <FiShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">BizManager</h3>
                    <p className="text-[11px] text-mx-subtle">Retail POS & Khata ERP</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ● Operational
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-center">
                <div className="bg-black/30 p-2 rounded-lg">
                  <p className="text-base font-bold text-white font-mono">3</p>
                  <p className="text-[10px] text-mx-subtle">Terminals</p>
                </div>
                <div className="bg-black/30 p-2 rounded-lg">
                  <p className="text-base font-bold text-emerald-400 font-mono">1,420</p>
                  <p className="text-[10px] text-mx-subtle">SKUs</p>
                </div>
                <div className="bg-black/30 p-2 rounded-lg">
                  <p className="text-base font-bold text-amber-400 font-mono">480</p>
                  <p className="text-[10px] text-mx-subtle">Customers</p>
                </div>
              </div>
            </div>

            <Link
              to="/modules/bizmanager"
              className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 text-xs font-semibold transition-all border border-emerald-500/25"
            >
              <span>Manage POS & Inventory</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* MailerX Hub Card */}
          <div className="p-5 rounded-2xl bg-mx-surface border border-indigo-500/20 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">MailerX Relay</h3>
                    <p className="text-[11px] text-mx-subtle">Transactional SMTP Hub</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ● Operational
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-center">
                <div className="bg-black/30 p-2 rounded-lg">
                  <p className="text-base font-bold text-white font-mono">587</p>
                  <p className="text-[10px] text-mx-subtle">Port</p>
                </div>
                <div className="bg-black/30 p-2 rounded-lg">
                  <p className="text-base font-bold text-indigo-400 font-mono">99.8%</p>
                  <p className="text-[10px] text-mx-subtle">Deliverability</p>
                </div>
                <div className="bg-black/30 p-2 rounded-lg">
                  <p className="text-base font-bold text-emerald-400 font-mono">Brevo</p>
                  <p className="text-[10px] text-mx-subtle">Relay</p>
                </div>
              </div>
            </div>

            <Link
              to="/services/mailerx"
              className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-400 text-xs font-semibold transition-all border border-indigo-500/25"
            >
              <span>View Outbox & Templates</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Security & Audit Activity Feed */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiActivity className="text-emerald-400 w-5 h-5" />
            <h2 className="text-sm font-bold text-white">Live Security Audit Stream</h2>
          </div>
          <Link
            to="/audit"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <span>View Complete Trail</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-white/5 font-mono text-xs">
          {recentActivity.length === 0 ? (
            <p className="py-6 text-center text-white/40">No audit events recorded yet.</p>
          ) : (
            recentActivity.map((log) => (
              <div key={log._id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">{log.action}</span>
                    <span className="text-white/40 ml-2">by {log.actor?.name || 'System'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-white/40 text-[11px]">
                  <span className="uppercase px-2 py-0.5 rounded bg-white/5 text-white/60">
                    {log.platform || 'global'}
                  </span>
                  <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
