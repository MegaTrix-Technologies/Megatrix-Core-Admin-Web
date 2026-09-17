import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import MetricCard from '../components/MetricCard';
import {
  FolderKanban,
  GraduationCap,
  Store,
  Users,
  Shield,
  Activity,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Building2,
  Tag,
  Search,
  Lock,
  X,
  UserCheck,
} from 'lucide-react';
import { toast } from 'react-toastify';

const PlatformDashboard = () => {
  const { adminUser, canAccessPlatform } = useAdminAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [crossSearchQuery, setCrossSearchQuery] = useState('');
  const [activityPlatformFilter, setActivityPlatformFilter] = useState('all');

  const isSuperAdmin = Boolean(adminUser?.isSuperAdmin || adminUser?.role === 'superadmin');
  const displayName = adminUser?.name || 'Admin';

  // Cross-Platform Cached State from LocalStorage
  const bizUsers = useMemo(() => {
    try {
      const saved = localStorage.getItem('megatrix_bizmanager_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  const schoolUsers = useMemo(() => {
    try {
      const saved = localStorage.getItem('megatrix_schoolhub_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  const bizActivity = useMemo(() => {
    try {
      const saved = localStorage.getItem('megatrix_bizmanager_activity_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  const schoolActivity = useMemo(() => {
    try {
      const saved = localStorage.getItem('megatrix_schoolhub_activity_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  // Macro Platform Totals
  const totalCombinedUsers = useMemo(() => {
    // 1,104 enrolled students + 24 verified staff & faculty + 4 retail merchants
    return (1104 + 24 + 4).toLocaleString();
  }, []);

  const totalSubscriptions = useMemo(() => {
    // 5 schools on subscription + 3 Biz Manager paid merchants
    return '8';
  }, []);

  const totalTenants = useMemo(() => {
    // 7 registered schools + 4 merchant outlets
    return '11';
  }, []);

  // Unified Cross-Platform User Directory for Fast Search
  const unifiedUsers = useMemo(() => {
    const list = [
      ...schoolUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        platform: 'School Hub',
        platformPath: '/platforms/schoolhub',
        tenantId: u.schoolId || 'SCH-101',
        role: u.role,
        status: u.status,
        mustChangePassword: Boolean(u.mustChangePassword),
      })),
      ...bizUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        platform: 'Biz Manager',
        platformPath: '/platforms/bizmanager',
        tenantId: u.shopName || 'Retail Mart',
        role: u.role,
        status: u.status,
        mustChangePassword: Boolean(u.mustChangePassword),
      })),
    ];

    if (!crossSearchQuery.trim()) {
      return list.slice(0, 6);
    }

    const q = crossSearchQuery.toLowerCase().trim();
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.tenantId.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
    );
  }, [schoolUsers, bizUsers, crossSearchQuery]);

  // Combined Live Security Audit Logs
  const combinedAuditLogs = useMemo(() => {
    const combined = [
      ...schoolActivity.map((a) => ({
        ...a,
        platform: 'School Hub',
        sourceColor: 'text-mx-blue',
      })),
      ...bizActivity.map((a) => ({
        ...a,
        platform: 'Biz Manager',
        sourceColor: 'text-white',
      })),
    ];

    combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (activityPlatformFilter === 'all') return combined.slice(0, 8);
    return combined.filter((a) => a.platform.toLowerCase().replace(' ', '') === activityPlatformFilter).slice(0, 8);
  }, [schoolActivity, bizActivity, activityPlatformFilter]);

  const handleSyncTelemetry = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Platform telemetry synchronized across all projects.');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* ─── 1. GREETINGS & EXECUTIVE HERO ─── */}
      <div className="rounded-md bg-mx-surface border border-mx-border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[28px] font-bold text-white tracking-tight leading-tight">
                Welcome, {displayName}!
              </h1>
              {isSuperAdmin && (
                <span className="text-xs font-mono text-mx-subtle font-semibold">[Super Admin Console]</span>
              )}
            </div>
            <p className="text-xs text-mx-subtle max-w-2xl leading-relaxed">
              Global multi-tenant control plane across educational institutions and commercial retail networks.
              Unified governance, cross-platform accounts, and security audit telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSyncTelemetry}
              disabled={loading}
              aria-label="Sync all telemetry data"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-white transition-colors border border-mx-border cursor-pointer min-h-[36px]"
            >
              <RefreshCw size={16} strokeWidth={1.5} className={loading ? 'animate-spin' : ''} />
              <span>Sync Telemetry</span>
            </button>
            <button
              onClick={() => navigate('/platforms/schoolhub')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-white transition-colors border border-mx-border cursor-pointer min-h-[36px]"
            >
              <GraduationCap size={16} strokeWidth={1.5} />
              <span>School Hub</span>
            </button>
            <button
              onClick={() => navigate('/platforms/bizmanager')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors cursor-pointer min-h-[36px]"
            >
              <Store size={16} strokeWidth={1.5} />
              <span>Biz Manager</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. EXECUTIVE MACRO NUMBERS (4-COLUMN BALANCED GRID) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Projects"
          value={2}
          subtitle="School Hub & Biz Manager"
          icon={FolderKanban}
          trend="100% Operational"
          trendPositive={true}
        />
        <MetricCard
          title="Total Combined Users"
          value={totalCombinedUsers}
          subtitle="Merchants, faculty, students & staff"
          icon={Users}
          trend="+11.8% MoM"
          trendPositive={true}
        />
        <MetricCard
          title="Active Subscriptions"
          value={totalSubscriptions}
          subtitle="Paid institutional & commercial tiers"
          icon={Tag}
          trend="+8.6% MoM"
          trendPositive={true}
        />
        <MetricCard
          title="Total Verified Tenants"
          value={totalTenants}
          subtitle="Academic campuses & retail outlets"
          icon={Building2}
          trend="+18 this month"
          trendPositive={true}
        />
      </div>

      {/* ─── 3. STRATEGIC BREAKDOWN: ECOSYSTEM POPULATION MATRICES ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School Hub Macro Card */}
        <div className="rounded-md bg-mx-surface border border-mx-border p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-mx-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-mx-panel border border-mx-border flex items-center justify-center text-white">
                <GraduationCap size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">School Hub Ecosystem</h3>
                <p className="text-xs text-mx-subtle">Institutional Campus & Collegiate ERP</p>
              </div>
            </div>
            <span className="text-xs font-mono text-mx-subtle font-semibold">7 Campuses</span>
          </div>

          <p className="text-xs text-mx-subtle leading-relaxed">
            Centralized academic management across Pakistani schools, multi-campus student admissions, automated 3-copy fee challans, and biometric attendance.
          </p>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-sm bg-mx-panel border border-mx-border">
              <span className="text-base font-bold font-mono text-white block">1,128</span>
              <span className="text-xs text-mx-subtle font-mono block mt-1">Students & Faculty</span>
            </div>
            <div className="p-3 rounded-sm bg-mx-panel border border-mx-border">
              <span className="text-base font-bold font-mono text-white block">5</span>
              <span className="text-xs text-mx-subtle font-mono block mt-1">Paid Subscriptions</span>
            </div>
            <div className="p-3 rounded-sm bg-mx-panel border border-mx-border">
              <span className="text-base font-bold font-mono text-white block">2</span>
              <span className="text-xs text-mx-subtle font-mono block mt-1">Active Trials</span>
            </div>
          </div>

          <div className="pt-2 border-t border-mx-border flex items-center justify-between">
            <span className="text-xs text-mx-subtle font-mono">Platform Health: 99.98%</span>
            <Link
              to="/platforms/schoolhub"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-mx-blue transition-colors cursor-pointer"
            >
              <span>Manage School Hub</span>
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        {/* Biz Manager Macro Card */}
        <div className="rounded-md bg-mx-surface border border-mx-border p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-mx-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-mx-panel border border-mx-border flex items-center justify-center text-white">
                <Store size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Biz Manager Ecosystem</h3>
                <p className="text-xs text-mx-subtle">Retail Point of Sale & Ledger ERP</p>
              </div>
            </div>
            <span className="text-xs font-mono text-mx-subtle font-semibold">4 Outlets</span>
          </div>

          <p className="text-xs text-mx-subtle leading-relaxed">
            High-speed barcode checkout registers, customer credit khata ledgers, inventory SKU tracking, and real-time cash drawer reconciliation.
          </p>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-sm bg-mx-panel border border-mx-border">
              <span className="text-base font-bold font-mono text-white block">4</span>
              <span className="text-xs text-mx-subtle font-mono block mt-1">Store Merchants</span>
            </div>
            <div className="p-3 rounded-sm bg-mx-panel border border-mx-border">
              <span className="text-base font-bold font-mono text-white block">3</span>
              <span className="text-xs text-mx-subtle font-mono block mt-1">Paid Subscriptions</span>
            </div>
            <div className="p-3 rounded-sm bg-mx-panel border border-mx-border">
              <span className="text-base font-bold font-mono text-white block">1</span>
              <span className="text-xs text-mx-subtle font-mono block mt-1">Trial / Suspended</span>
            </div>
          </div>

          <div className="pt-2 border-t border-mx-border flex items-center justify-between">
            <span className="text-xs text-mx-subtle font-mono">Platform Health: 100.0%</span>
            <Link
              to="/platforms/bizmanager"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-mx-blue transition-colors cursor-pointer"
            >
              <span>Manage Biz Manager</span>
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 4. UNIVERSAL CROSS-PLATFORM USER SEARCH & GOVERNANCE ─── */}
      <div className="rounded-md bg-mx-surface border border-mx-border p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-mx-border">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users size={16} strokeWidth={1.5} />
              <span>Universal User Search Gateway</span>
            </h3>
            <p className="text-xs text-mx-subtle">
              Quickly locate any administrator, teacher, merchant, or student account across both platforms.
            </p>
          </div>

          <div className="relative min-w-[280px]">
            <Search size={14} strokeWidth={1.5} className="absolute left-3 top-3 text-mx-subtle" />
            <input
              type="text"
              aria-label="Search across all platforms"
              placeholder="Search user, email, phone or tenant..."
              value={crossSearchQuery}
              onChange={(e) => setCrossSearchQuery(e.target.value)}
              className="pl-8 pr-8 py-2 bg-mx-panel border border-mx-border rounded-sm text-xs text-white focus:outline-none focus:border-mx-blue w-full min-h-[36px]"
            />
            {crossSearchQuery && (
              <button
                onClick={() => setCrossSearchQuery('')}
                className="absolute right-3 top-3 text-mx-subtle hover:text-white"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-mx-border bg-mx-panel text-xs font-semibold text-mx-subtle">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Tenant / Institution</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Navigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mx-border">
              {unifiedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-mx-subtle font-mono">
                    No accounts found matching your cross-platform query.
                  </td>
                </tr>
              ) : (
                unifiedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-mx-panel transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="flex flex-col">
                        <span>{u.name}</span>
                        <span className="text-[11px] text-mx-subtle font-mono">{u.id}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-xs font-mono font-semibold text-white">{u.platform}</span>
                    </td>

                    <td className="py-3 px-4 text-white">
                      <span className="font-mono">{u.tenantId}</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-white">
                      <div className="flex flex-col">
                        <span>{u.phone}</span>
                        <span className="text-[11px] text-mx-subtle lowercase">{u.email}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-2 text-[11px] font-mono">
                        <span
                          className={"w-2 h-2 rounded-full " + (
                            u.status === 'blocked' ? 'bg-mx-muted' : 'bg-mx-positive'
                          )}
                        />
                        <span className="text-white">
                          {u.status === 'blocked' ? 'Restricted' : 'Active'}
                        </span>
                        {u.mustChangePassword && (
                          <span className="text-[11px] font-mono text-mx-subtle">(Reset Required)</span>
                        )}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(u.platformPath)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-white border border-mx-border transition-colors cursor-pointer min-h-[32px]"
                      >
                        <span>Open in {u.platform}</span>
                        <ArrowRight size={14} strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 5. UNIFIED CROSS-PLATFORM SECURITY & AUDIT STREAM ─── */}
      <div className="rounded-md bg-mx-surface border border-mx-border p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-mx-border">
          <div className="flex items-center gap-2">
            <Activity size={16} strokeWidth={1.5} className="text-mx-blue" />
            <h3 className="text-sm font-bold text-white">
              Live Platform Security & Audit Trail
            </h3>
          </div>

          <div className="inline-flex rounded-sm bg-mx-panel p-1 border border-mx-border text-xs">
            <button
              type="button"
              onClick={() => setActivityPlatformFilter('all')}
              className={"px-3 py-1 rounded-sm font-semibold cursor-pointer transition-colors " + (
                activityPlatformFilter === 'all'
                  ? 'bg-white text-black font-bold'
                  : 'text-mx-subtle hover:text-white'
              )}
            >
              All Platforms
            </button>
            <button
              type="button"
              onClick={() => setActivityPlatformFilter('schoolhub')}
              className={"px-3 py-1 rounded-sm font-semibold cursor-pointer transition-colors " + (
                activityPlatformFilter === 'schoolhub'
                  ? 'bg-mx-surface text-white font-bold border border-mx-border'
                  : 'text-mx-subtle hover:text-white'
              )}
            >
              School Hub
            </button>
            <button
              type="button"
              onClick={() => setActivityPlatformFilter('bizmanager')}
              className={"px-3 py-1 rounded-sm font-semibold cursor-pointer transition-colors " + (
                activityPlatformFilter === 'bizmanager'
                  ? 'bg-mx-surface text-white font-bold border border-mx-border'
                  : 'text-mx-subtle hover:text-white'
              )}
            >
              Biz Manager
            </button>
          </div>
        </div>

        <div className="divide-y divide-mx-border text-xs">
          {combinedAuditLogs.length === 0 ? (
            <p className="py-8 text-center text-mx-subtle font-mono">No recent security events recorded.</p>
          ) : (
            combinedAuditLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-mx-panel px-2 rounded-sm transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-mx-blue shrink-0 mt-1" />
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-mx-subtle">[{log.platform}]</span>
                      <span className="text-xs font-bold text-white">{log.action}</span>
                      <span className="text-xs text-mx-subtle font-mono">by {log.userName}</span>
                    </div>
                    <p className="text-xs text-mx-subtle leading-relaxed truncate max-w-2xl">
                      {log.detail}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right font-mono text-[11px] text-mx-subtle">
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformDashboard;
