import React, { useState, useEffect, useCallback } from 'react';
import adminApi from '../../services/adminApi';
import MetricCard from '../../components/MetricCard';
import StatusPill from '../../components/StatusPill';
import ConfirmationModal from '../../components/ConfirmationModal';
import {
  FiBookOpen,
  FiUsers,
  FiAward,
  FiFileText,
  FiDollarSign,
  FiShield,
  FiExternalLink,
  FiRefreshCw,
  FiCheckCircle,
  FiHome,
  FiLayers,
  FiPlusCircle,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiSearch,
  FiSlash,
  FiKey,
  FiTrash2,
  FiActivity,
  FiInfo,
  FiCopy,
  FiLock,
  FiClock,
  FiUserCheck,
  FiUserX,
  FiMapPin,
  FiMail,
  FiPhone,
  FiCalendar,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const SchoolManagerModule = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState('overview');

  // Service Health & Global Loading
  const [health, setHealth] = useState({ online: true, service: 'School Manager', status: 'operational' });
  const [loadingHealth, setLoadingHealth] = useState(false);

  // Overview Data
  const [overview, setOverview] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(false);

  // Schools Directory State
  const [schools, setSchools] = useState([]);
  const [schoolsTotal, setSchoolsTotal] = useState(0);
  const [schoolsPage, setSchoolsPage] = useState(1);
  const [schoolsSearch, setSchoolsSearch] = useState('');
  const [schoolsStatusFilter, setSchoolsStatusFilter] = useState('all');
  const [loadingSchools, setLoadingSchools] = useState(false);

  // Users Directory State
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersRoleFilter, setUsersRoleFilter] = useState('all');
  const [usersStatusFilter, setUsersStatusFilter] = useState('all');
  const [usersSchoolFilter, setUsersSchoolFilter] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Activity Stream State
  const [activities, setActivities] = useState([]);
  const [activitiesTotal, setActivitiesTotal] = useState(0);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [activityActionFilter, setActivityActionFilter] = useState('');
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Modal Inspection & Action States
  const [inspectorSchool, setInspectorSchool] = useState(null);
  const [loadingInspectorSchool, setLoadingInspectorSchool] = useState(false);

  const [inspectorUser, setInspectorUser] = useState(null);
  const [loadingInspectorUser, setLoadingInspectorUser] = useState(false);

  // Block / Reactivate School Modals
  const [blockSchoolModal, setBlockSchoolModal] = useState({ isOpen: false, school: null, reason: '' });
  const [blockingSchoolLoading, setBlockingSchoolLoading] = useState(false);

  // Delete School Modal (Protected Confirmation)
  const [deleteSchoolModal, setDeleteSchoolModal] = useState({ isOpen: false, school: null, confirmationInput: '' });
  const [deletingSchoolLoading, setDeletingSchoolLoading] = useState(false);

  // Block / Reactivate User Modals
  const [blockUserModal, setBlockUserModal] = useState({ isOpen: false, user: null, reason: '' });
  const [blockingUserLoading, setBlockingUserLoading] = useState(false);

  // Admin Assisted Password Reset Modal
  const [resetPasswordModal, setResetPasswordModal] = useState({
    isOpen: false,
    user: null,
    reason: 'User cannot access registered email / assisted recovery',
    generatedCred: null,
  });
  const [resettingPasswordLoading, setResettingPasswordLoading] = useState(false);

  const schoolAppUrl = import.meta.env.VITE_SCHOOLMANAGER_APP_URL || 'http://localhost:5174';
  const schoolApiUrl = import.meta.env.VITE_SCHOOLMANAGER_API_URL || 'http://localhost:5001/api';

  // 1. Initial Telemetry & Health Fetch
  const checkHealth = useCallback(async () => {
    try {
      setLoadingHealth(true);
      const res = await adminApi.getSchoolManagerHealth();
      if (res && res.success && res.status === 'operational') {
        setHealth({ online: true, ...res });
      } else {
        setHealth({ online: false, message: res.message || 'Service down' });
      }
    } catch {
      setHealth({ online: false, message: 'School Manager service unreachable' });
    } finally {
      setLoadingHealth(false);
    }
  }, []);

  const fetchOverview = useCallback(async () => {
    try {
      setLoadingOverview(true);
      const res = await adminApi.getSchoolManagerOverview();
      if (res && res.success) {
        setOverview(res);
      }
    } catch (err) {
      console.error('Failed to load School Manager overview:', err);
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  const fetchSchools = useCallback(async () => {
    try {
      setLoadingSchools(true);
      const res = await adminApi.getSchoolManagerSchools({
        page: schoolsPage,
        limit: 10,
        search: schoolsSearch,
        status: schoolsStatusFilter,
      });
      if (res && res.success) {
        setSchools(res.schools || []);
        setSchoolsTotal(res.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch schools list:', err);
      toast.error('Failed to load schools directory.');
    } finally {
      setLoadingSchools(false);
    }
  }, [schoolsPage, schoolsSearch, schoolsStatusFilter]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await adminApi.getSchoolManagerUsers({
        page: usersPage,
        limit: 10,
        search: usersSearch,
        role: usersRoleFilter,
        status: usersStatusFilter,
        schoolId: usersSchoolFilter || undefined,
      });
      if (res && res.success) {
        setUsers(res.users || []);
        setUsersTotal(res.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch users list:', err);
      toast.error('Failed to load users directory.');
    } finally {
      setLoadingUsers(false);
    }
  }, [usersPage, usersSearch, usersRoleFilter, usersStatusFilter, usersSchoolFilter]);

  const fetchActivities = useCallback(async () => {
    try {
      setLoadingActivities(true);
      const res = await adminApi.getSchoolManagerActivity({
        page: activitiesPage,
        limit: 15,
        action: activityActionFilter || undefined,
      });
      if (res && res.success) {
        setActivities(res.activities || []);
        setActivitiesTotal(res.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    } finally {
      setLoadingActivities(false);
    }
  }, [activitiesPage, activityActionFilter]);

  useEffect(() => {
    checkHealth();
    fetchOverview();
  }, [checkHealth, fetchOverview]);

  useEffect(() => {
    if (activeTab === 'schools') fetchSchools();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'activity') fetchActivities();
  }, [activeTab, fetchSchools, fetchUsers, fetchActivities]);

  const refreshAll = () => {
    checkHealth();
    fetchOverview();
    if (activeTab === 'schools') fetchSchools();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'activity') fetchActivities();
    toast.success('Telemetry synchronized with School Manager gateway.');
  };

  // 2. School Actions
  const handleInspectSchool = async (school) => {
    try {
      setLoadingInspectorSchool(true);
      setInspectorSchool(school);
      const res = await adminApi.getSchoolManagerSchool(school._id);
      if (res && res.success) {
        setInspectorSchool(res.school);
      }
    } catch (err) {
      console.error('Failed to load full school details:', err);
    } finally {
      setLoadingInspectorSchool(false);
    }
  };

  const handleBlockSchoolConfirm = async () => {
    if (!blockSchoolModal.reason.trim()) {
      toast.error('Please enter a specific reason for blocking this school.');
      return;
    }
    try {
      setBlockingSchoolLoading(true);
      const res = await adminApi.blockSchool(blockSchoolModal.school._id, blockSchoolModal.reason);
      if (res && res.success) {
        toast.success(res.message);
        setBlockSchoolModal({ isOpen: false, school: null, reason: '' });
        fetchSchools();
        fetchOverview();
      } else {
        toast.error(res.message || 'Failed to block school');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error executing school block');
    } finally {
      setBlockingSchoolLoading(false);
    }
  };

  const handleReactivateSchool = async (school) => {
    try {
      const res = await adminApi.reactivateSchool(school._id);
      if (res && res.success) {
        toast.success(res.message);
        fetchSchools();
        fetchOverview();
      } else {
        toast.error(res.message || 'Failed to reactivate school');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error reactivating school');
    }
  };

  const handleDeleteSchoolConfirm = async () => {
    const school = deleteSchoolModal.school;
    if (!school) return;

    if (deleteSchoolModal.confirmationInput.trim() !== school.name.trim()) {
      toast.error(`Please type "${school.name}" exactly to confirm permanent deletion.`);
      return;
    }

    try {
      setDeletingSchoolLoading(true);
      const res = await adminApi.deleteSchool(school._id, deleteSchoolModal.confirmationInput.trim());
      if (res && res.success) {
        toast.success(res.message);
        setDeleteSchoolModal({ isOpen: false, school: null, confirmationInput: '' });
        fetchSchools();
        fetchOverview();
      } else {
        toast.error(res.message || 'Failed to delete school');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error executing permanent school deletion');
    } finally {
      setDeletingSchoolLoading(false);
    }
  };

  // 3. User Actions
  const handleInspectUser = async (user) => {
    try {
      setLoadingInspectorUser(true);
      setInspectorUser(user);
      const res = await adminApi.getSchoolManagerUser(user._id, { role: user.role });
      if (res && res.success) {
        setInspectorUser(res.user);
      }
    } catch (err) {
      console.error('Failed to load user details:', err);
    } finally {
      setLoadingInspectorUser(false);
    }
  };

  const handleBlockUserConfirm = async () => {
    try {
      setBlockingUserLoading(true);
      const user = blockUserModal.user;
      const res = await adminApi.blockSchoolUser(user._id, user.role, blockUserModal.reason);
      if (res && res.success) {
        toast.success(res.message);
        setBlockUserModal({ isOpen: false, user: null, reason: '' });
        fetchUsers();
      } else {
        toast.error(res.message || 'Failed to block user');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error blocking user');
    } finally {
      setBlockingUserLoading(false);
    }
  };

  const handleReactivateUser = async (user) => {
    try {
      const res = await adminApi.reactivateSchoolUser(user._id, user.role);
      if (res && res.success) {
        toast.success(res.message);
        fetchUsers();
      } else {
        toast.error(res.message || 'Failed to reactivate user');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error reactivating user');
    }
  };

  const handleAdminResetPassword = async () => {
    const user = resetPasswordModal.user;
    if (!user) return;

    if (!resetPasswordModal.reason.trim()) {
      toast.error('A reason is required for administrative password reset.');
      return;
    }

    try {
      setResettingPasswordLoading(true);
      const res = await adminApi.adminResetPassword(user._id, user.role, resetPasswordModal.reason);
      if (res && res.success) {
        toast.success('Temporary password generated successfully!');
        setResetPasswordModal((prev) => ({
          ...prev,
          generatedCred: res.temporaryPassword,
        }));
        fetchUsers();
      } else {
        toast.error(res.message || 'Failed to reset password');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error executing password reset');
    } finally {
      setResettingPasswordLoading(false);
    }
  };

  const handleLaunchSchoolPortal = async (schoolId) => {
    try {
      const res = await adminApi.generateSchoolSSO(schoolId);
      if (res && res.success && res.portalUrl) {
        window.open(res.portalUrl, '_blank');
      } else {
        window.open(`${schoolAppUrl}/admin`, '_blank');
      }
    } catch {
      window.open(`${schoolAppUrl}/admin`, '_blank');
    }
  };

  // Metrics extraction
  const m = overview?.metrics || {};
  const schoolsMetrics = m.schools || { total: '—', active: '—', blocked: '—' };
  const pops = m.populations || { students: '—', teachers: '—', staff: '—', parents: '—', totalUsers: '—' };
  const eng = m.engagement || { recentSignIns24h: '—', totalLoggedActivities: '—' };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ─── Hero & Gateway Banner ────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-950/40 via-mx-surface to-mx-surface border border-sky-500/20 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <span className={`w-2 h-2 rounded-full ${health.online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              First-Class SaaS Platform • School Manager Multi-Tenant ERP
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Institutional Governance & Operations Desk
            </h1>
            <p className="text-xs sm:text-sm text-mx-subtle max-w-2xl leading-relaxed">
              Global administration across Pakistani educational institutions: Cross-school directory, tenant lifecycle management,
              security event monitoring, and administrator-assisted password recovery.
            </p>
          </div>

          {/* Actions & Health Indicator */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={refreshAll}
              disabled={loadingHealth || loadingOverview}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-mx-elevated hover:bg-mx-border2 text-xs font-semibold text-neutral-200 transition-all border border-mx-border2 cursor-pointer"
            >
              <FiRefreshCw className={`w-3.5 h-3.5 ${loadingHealth || loadingOverview ? 'animate-spin' : ''}`} />
              <span>Sync Telemetry</span>
            </button>
            <a
              href={`${schoolAppUrl}/login`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-600/25 cursor-pointer"
            >
              <FiBookOpen className="w-4 h-4" />
              <span>Launch School Hub (Port 5174)</span>
              <FiExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* Port Status Sub-banner */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-mx-subtle">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${health.online ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              Backend: <strong className="text-white font-mono">{schoolApiUrl}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Frontend: <strong className="text-white font-mono">{schoolAppUrl}</strong>
            </span>
            <span className="text-neutral-400">Currency: <strong>PKR (₨)</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                health.online
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {health.online ? '● Live Gateway Operational' : '○ Gateway Offline / Unreachable'}
            </span>
          </div>
        </div>
      </div>

      {/* Service Failure Alert Banner (Section 30, 37) */}
      {!health.online && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-200">
          <FiAlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-rose-300">School Manager Service Unavailable</p>
            <p className="text-rose-200/80 leading-relaxed">
              Live administrative gateway on port 5001 could not be reached. Ensure the School Manager backend server is running.
              Live administrative actions (block, delete, password resets) are temporarily restricted until the connection is restored.
            </p>
          </div>
        </div>
      )}

      {/* Strict Tenant Isolation Disclaimer Banner (Section 24) */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
        <FiShield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-amber-300">Strict Multi-Tenant Isolation & Cross-Platform Governance</p>
          <p className="text-amber-200/80 leading-relaxed">
            School Manager institutions and users are strictly segregated by <code>schoolId</code> discriminators.
            MegaTrix Admin controls platform-wide governance without exposing or weakening tenant data boundaries.
          </p>
        </div>
      </div>

      {/* ─── Navigation Tabs ──────────────────────────────────────────────── */}
      <div className="flex border-b border-mx-border gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'border-sky-500 text-white'
              : 'border-transparent text-mx-subtle hover:text-neutral-200'
          }`}
        >
          <FiLayers className="w-4 h-4" />
          <span>Ecosystem Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('schools')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'schools'
              ? 'border-sky-500 text-white'
              : 'border-transparent text-mx-subtle hover:text-neutral-200'
          }`}
        >
          <FiHome className="w-4 h-4" />
          <span>Schools Directory ({schoolsTotal || schoolsMetrics.total || '…'})</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'border-sky-500 text-white'
              : 'border-transparent text-mx-subtle hover:text-neutral-200'
          }`}
        >
          <FiUsers className="w-4 h-4" />
          <span>Global User Directory ({usersTotal || pops.totalUsers || '…'})</span>
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'activity'
              ? 'border-sky-500 text-white'
              : 'border-transparent text-mx-subtle hover:text-neutral-200'
          }`}
        >
          <FiActivity className="w-4 h-4" />
          <span>Activity & Audit Trail</span>
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'plans'
              ? 'border-sky-500 text-white'
              : 'border-transparent text-mx-subtle hover:text-neutral-200'
          }`}
        >
          <FiFileText className="w-4 h-4" />
          <span>Subscriptions & Quotas</span>
        </button>
      </div>

      {/* ─── TAB 1: OVERVIEW ──────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Real Cross-School KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <MetricCard
              title="Total Schools"
              value={schoolsMetrics.total}
              subtitle={`${schoolsMetrics.active || 0} active • ${schoolsMetrics.blocked || 0} blocked`}
              icon={FiHome}
              color="sky"
            />
            <MetricCard
              title="Enrolled Students"
              value={pops.students !== '—' ? pops.students.toLocaleString() : '—'}
              subtitle="All Grades & Wings"
              icon={FiUsers}
              color="emerald"
            />
            <MetricCard
              title="Total Faculty"
              value={pops.teachers}
              subtitle="Registered Teachers"
              icon={FiAward}
              color="purple"
            />
            <MetricCard
              title="Administrative Staff"
              value={pops.staff}
              subtitle="Accounts, HR & Ops"
              icon={FiShield}
              color="indigo"
            />
            <MetricCard
              title="Parents / Guardians"
              value={pops.parents}
              subtitle="Active Guardian Portals"
              icon={FiUsers}
              color="amber"
            />
            <MetricCard
              title="Active Sign-ins (24h)"
              value={eng.recentSignIns24h}
              subtitle="Verified Logins"
              icon={FiCheckCircle}
              color="emerald"
            />
          </div>

          {/* 4 Approved Role Portals Showcase (Section 4.1 in School-Manager docs) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-mx-subtle uppercase tracking-wider">
              School Manager Role Portals (Port 5174)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href={`${schoolAppUrl}/admin/login`}
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-mx-surface border border-mx-border hover:border-sky-500/50 transition-all group shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold">
                    <FiHome className="w-5 h-5" />
                  </div>
                  <FiExternalLink className="w-4 h-4 text-mx-subtle group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
                  Campus Admin Desk
                </h4>
                <p className="text-xs text-mx-subtle mt-1">Principal & Executive Director Command Hub</p>
                <span className="inline-block mt-3 text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  Role: Campus Admin
                </span>
              </a>

              <a
                href={`${schoolAppUrl}/teacher/login`}
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-mx-surface border border-mx-border hover:border-emerald-500/50 transition-all group shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                    <FiAward className="w-5 h-5" />
                  </div>
                  <FiExternalLink className="w-4 h-4 text-mx-subtle group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Teacher & Faculty Desk
                </h4>
                <p className="text-xs text-mx-subtle mt-1">Attendance marking, exam grading, classroom assessments</p>
                <span className="inline-block mt-3 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Role: Faculty
                </span>
              </a>

              <a
                href={`${schoolAppUrl}/staff/login`}
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-mx-surface border border-mx-border hover:border-purple-500/50 transition-all group shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
                    <FiDollarSign className="w-5 h-5" />
                  </div>
                  <FiExternalLink className="w-4 h-4 text-mx-subtle group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                  Staff HR & Accounts Desk
                </h4>
                <p className="text-xs text-mx-subtle mt-1">3-Copy fee challans, monthly payroll, cash & bank ledger</p>
                <span className="inline-block mt-3 text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Role: Staff / Accountant
                </span>
              </a>

              <a
                href={`${schoolAppUrl}/parent/login`}
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-mx-surface border border-mx-border hover:border-amber-500/50 transition-all group shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
                    <FiUsers className="w-5 h-5" />
                  </div>
                  <FiExternalLink className="w-4 h-4 text-mx-subtle group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  Parent Multi-Child Portal
                </h4>
                <p className="text-xs text-mx-subtle mt-1">Report cards, 3-copy challan downloads, class diary feeds</p>
                <span className="inline-block mt-3 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Role: Guardian
                </span>
              </a>
            </div>
          </div>

          {/* Quick Snapshot: Recent Activity in School Manager */}
          <div className="bg-mx-surface border border-mx-border rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiActivity className="text-sky-400 w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Recent Cross-School Activity Stream</h3>
              </div>
              <button
                onClick={() => setActiveTab('activity')}
                className="text-xs text-sky-400 hover:underline font-semibold"
              >
                View Full Log Stream →
              </button>
            </div>

            <div className="divide-y divide-white/5 text-xs font-mono">
              {(overview?.recentActivity || []).length === 0 ? (
                <p className="py-6 text-center text-white/40">No cross-school activity recorded yet.</p>
              ) : (
                overview.recentActivity.slice(0, 5).map((act) => (
                  <div key={act._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-white">{act.action}</span>
                        <span className="text-white/40 ml-2">
                          {act.actor?.name} ({act.schoolName || act.schoolCode || 'Ecosystem'})
                        </span>
                      </div>
                    </div>
                    <span className="text-white/40 text-[11px]">
                      {new Date(act.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: SCHOOLS DIRECTORY ─────────────────────────────────────── */}
      {activeTab === 'schools' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Filter Bar */}
          <div className="bg-mx-surface border border-mx-border p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mx-subtle w-4 h-4" />
              <input
                type="text"
                placeholder="Search school name, campus code, city..."
                value={schoolsSearch}
                onChange={(e) => {
                  setSchoolsSearch(e.target.value);
                  setSchoolsPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-mx-elevated border border-mx-border text-white text-xs placeholder:text-mx-subtle focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <label className="text-xs text-mx-subtle">Status:</label>
              <select
                value={schoolsStatusFilter}
                onChange={(e) => {
                  setSchoolsStatusFilter(e.target.value);
                  setSchoolsPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-mx-elevated border border-mx-border text-white text-xs focus:border-sky-500 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="blocked">Blocked Only</option>
              </select>

              <button
                onClick={fetchSchools}
                disabled={loadingSchools}
                className="p-2 rounded-xl bg-mx-elevated border border-mx-border text-neutral-300 hover:text-white cursor-pointer"
                title="Refresh Schools"
              >
                <FiRefreshCw className={`w-4 h-4 ${loadingSchools ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Schools Table */}
          <div className="bg-mx-surface border border-mx-border rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-mx-border bg-mx-elevated/40 text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                    <th className="py-3.5 px-4">Campus Code</th>
                    <th className="py-3.5 px-4">School Institution</th>
                    <th className="py-3.5 px-4">City / Province</th>
                    <th className="py-3.5 px-4">Principal</th>
                    <th className="py-3.5 px-4 text-center">Students</th>
                    <th className="py-3.5 px-4 text-center">Faculty</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Last Activity</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mx-border text-xs">
                  {loadingSchools ? (
                    <tr>
                      <td colSpan="9" className="py-12 text-center text-mx-subtle">
                        <FiRefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-400" />
                        <span>Loading school institutions...</span>
                      </td>
                    </tr>
                  ) : schools.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="py-12 text-center text-mx-subtle">
                        <FiInfo className="w-6 h-6 mx-auto mb-2 text-sky-400/50" />
                        <span>No schools found matching search criteria.</span>
                      </td>
                    </tr>
                  ) : (
                    schools.map((s) => (
                      <tr key={s._id} className="hover:bg-mx-elevated/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-sky-400">{s.code}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div>{s.name}</div>
                          <div className="text-[10px] text-mx-subtle font-mono">{s.email}</div>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-300">
                          {s.address?.city || 'Lahore'}, {s.address?.state || 'Punjab'}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-300">{s.principalName || '—'}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-sky-400">
                          {s.studentCount?.toLocaleString() ?? 0}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-mx-subtle">
                          {(s.teacherCount || 0) + (s.staffCount || 0)}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusPill status={s.status || (s.isActive ? 'active' : 'suspended')} />
                        </td>
                        <td className="py-3.5 px-4 text-mx-subtle text-[11px]">
                          {s.lastActivity ? new Date(s.lastActivity).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleInspectSchool(s)}
                              className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-[11px] font-semibold border border-sky-500/20 cursor-pointer"
                              title="View full tenant details"
                            >
                              Inspect
                            </button>

                            {s.status === 'blocked' ? (
                              <button
                                onClick={() => handleReactivateSchool(s)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20 cursor-pointer"
                              >
                                Reactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => setBlockSchoolModal({ isOpen: true, school: s, reason: '' })}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-semibold border border-amber-500/20 cursor-pointer"
                                title="Block school access"
                              >
                                Block
                              </button>
                            )}

                            <button
                              onClick={() => setDeleteSchoolModal({ isOpen: true, school: s, confirmationInput: '' })}
                              className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 cursor-pointer"
                              title="Permanently Delete School Tenant"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleLaunchSchoolPortal(s._id)}
                              className="p-1 rounded-lg bg-mx-elevated hover:bg-mx-border2 text-neutral-300 cursor-pointer"
                              title="Open in School Manager ERP"
                            >
                              <FiExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-mx-border flex items-center justify-between text-xs text-mx-subtle">
              <span>
                Showing {schools.length} of {schoolsTotal} schools
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={schoolsPage <= 1}
                  onClick={() => setSchoolsPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-lg bg-mx-elevated disabled:opacity-40 cursor-pointer text-white"
                >
                  Previous
                </button>
                <span className="font-mono px-2 text-white">Page {schoolsPage}</span>
                <button
                  disabled={schools.length < 10 || schoolsPage * 10 >= schoolsTotal}
                  onClick={() => setSchoolsPage((p) => p + 1)}
                  className="px-3 py-1 rounded-lg bg-mx-elevated disabled:opacity-40 cursor-pointer text-white"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: USERS DIRECTORY ───────────────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Filter Bar */}
          <div className="bg-mx-surface border border-mx-border p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mx-subtle w-4 h-4" />
              <input
                type="text"
                placeholder="Search user name, email, phone..."
                value={usersSearch}
                onChange={(e) => {
                  setUsersSearch(e.target.value);
                  setUsersPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-mx-elevated border border-mx-border text-white text-xs placeholder:text-mx-subtle focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <label className="text-xs text-mx-subtle">Role:</label>
                <select
                  value={usersRoleFilter}
                  onChange={(e) => {
                    setUsersRoleFilter(e.target.value);
                    setUsersPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-mx-elevated border border-mx-border text-white text-xs focus:border-sky-500 focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Campus Admin</option>
                  <option value="teacher">Teacher / Faculty</option>
                  <option value="staff">Staff / Accounts</option>
                  <option value="parent">Parent / Guardian</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-mx-subtle">Status:</label>
                <select
                  value={usersStatusFilter}
                  onChange={(e) => {
                    setUsersStatusFilter(e.target.value);
                    setUsersPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-mx-elevated border border-mx-border text-white text-xs focus:border-sky-500 focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <button
                onClick={fetchUsers}
                disabled={loadingUsers}
                className="p-2 rounded-xl bg-mx-elevated border border-mx-border text-neutral-300 hover:text-white cursor-pointer"
                title="Refresh Users"
              >
                <FiRefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-mx-surface border border-mx-border rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-mx-border bg-mx-elevated/40 text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Contact / Identifier</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Assigned Institution</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Last Sign-in</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mx-border text-xs">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-mx-subtle">
                        <FiRefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-400" />
                        <span>Loading cross-school users...</span>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-mx-subtle">
                        <FiInfo className="w-6 h-6 mx-auto mb-2 text-sky-400/50" />
                        <span>No users found matching filter criteria.</span>
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="hover:bg-mx-elevated/30 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <span>{u.name}</span>
                            {u.mustChangePassword && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 text-[10px] border border-amber-500/20">
                                Pwd Reset Req
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-neutral-300">
                          <div>{u.email}</div>
                          {u.phone && u.phone !== '—' && (
                            <div className="text-[10px] text-mx-subtle">{u.phone}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                              u.role === 'admin'
                                ? 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                                : u.role === 'teacher'
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                : u.role === 'parent'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                                : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-300">
                          <div>{u.schoolName}</div>
                          <div className="text-[10px] font-mono text-mx-subtle">{u.schoolCode}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusPill status={u.status} />
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-mx-subtle">
                          {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleInspectUser(u)}
                              className="px-2.5 py-1 rounded-lg bg-mx-elevated hover:bg-mx-border2 text-neutral-300 text-[11px] font-semibold cursor-pointer"
                            >
                              Inspect
                            </button>

                            {/* Assisted Password Reset (Section 12) */}
                            <button
                              onClick={() =>
                                setResetPasswordModal({
                                  isOpen: true,
                                  user: u,
                                  reason: 'User cannot access registered email / assisted recovery',
                                  generatedCred: null,
                                })
                              }
                              className="px-2 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-[11px] font-semibold border border-sky-500/20 flex items-center gap-1 cursor-pointer"
                              title="Assist with email-less password recovery"
                            >
                              <FiKey className="w-3 h-3" />
                              <span>Reset</span>
                            </button>

                            {/* Block / Reactivate */}
                            {u.status === 'blocked' ? (
                              <button
                                onClick={() => handleReactivateUser(u)}
                                className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20 cursor-pointer"
                              >
                                Reactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => setBlockUserModal({ isOpen: true, user: u, reason: '' })}
                                className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-semibold border border-amber-500/20 cursor-pointer"
                              >
                                Block
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-mx-border flex items-center justify-between text-xs text-mx-subtle">
              <span>
                Showing {users.length} of {usersTotal} users
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={usersPage <= 1}
                  onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-lg bg-mx-elevated disabled:opacity-40 cursor-pointer text-white"
                >
                  Previous
                </button>
                <span className="font-mono px-2 text-white">Page {usersPage}</span>
                <button
                  disabled={users.length < 10 || usersPage * 10 >= usersTotal}
                  onClick={() => setUsersPage((p) => p + 1)}
                  className="px-3 py-1 rounded-lg bg-mx-elevated disabled:opacity-40 cursor-pointer text-white"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: ACTIVITY & AUDIT MONITORING ──────────────────────────── */}
      {activeTab === 'activity' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-mx-surface border border-mx-border p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs text-mx-subtle">Filter Action:</label>
              <select
                value={activityActionFilter}
                onChange={(e) => {
                  setActivityActionFilter(e.target.value);
                  setActivitiesPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-mx-elevated border border-mx-border text-white text-xs focus:border-sky-500 focus:outline-none"
              >
                <option value="">All Security Events</option>
                <option value="USER_LOGIN">User Sign-ins</option>
                <option value="USER_BLOCKED">User Blocked</option>
                <option value="USER_REACTIVATED">User Reactivated</option>
                <option value="USER_ADMIN_PASSWORD_RESET">Admin Password Resets</option>
                <option value="SCHOOL_BLOCKED">School Blocked</option>
                <option value="SCHOOL_REACTIVATED">School Reactivated</option>
                <option value="SCHOOL_DELETED">School Deleted</option>
              </select>
            </div>

            <button
              onClick={fetchActivities}
              disabled={loadingActivities}
              className="p-2 rounded-xl bg-mx-elevated border border-mx-border text-neutral-300 hover:text-white cursor-pointer"
            >
              <FiRefreshCw className={`w-4 h-4 ${loadingActivities ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="bg-mx-surface border border-mx-border rounded-2xl overflow-hidden shadow-xl">
            <div className="divide-y divide-mx-border">
              {loadingActivities ? (
                <div className="p-12 text-center text-mx-subtle">Loading activity logs...</div>
              ) : activities.length === 0 ? (
                <div className="p-12 text-center text-mx-subtle">No activities logged yet.</div>
              ) : (
                activities.map((act) => (
                  <div key={act._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-mx-elevated/20 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            act.action.includes('BLOCKED')
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                              : act.action.includes('REACTIVATED')
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                              : act.action.includes('RESET')
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                              : 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                          }`}
                        >
                          {act.action}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          Target: {act.target?.name || act.target?.id || 'Platform'}
                        </span>
                      </div>
                      <p className="text-[11px] text-mx-subtle">
                        Actor: <strong className="text-neutral-300">{act.actor?.name || 'System'}</strong> • School:{' '}
                        <strong className="text-neutral-300">{act.schoolName || act.schoolCode || 'Ecosystem Core'}</strong>
                        {act.details?.reason && ` • Reason: "${act.details.reason}"`}
                      </p>
                    </div>

                    <div className="text-right text-[11px] font-mono text-mx-subtle flex-shrink-0">
                      <div>{new Date(act.createdAt).toLocaleDateString()}</div>
                      <div>{new Date(act.createdAt).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-mx-border flex items-center justify-between text-xs text-mx-subtle">
              <span>Total Logged Events: {activitiesTotal}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={activitiesPage <= 1}
                  onClick={() => setActivitiesPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-lg bg-mx-elevated disabled:opacity-40 cursor-pointer text-white"
                >
                  Previous
                </button>
                <span className="font-mono text-white">Page {activitiesPage}</span>
                <button
                  disabled={activities.length < 15 || activitiesPage * 15 >= activitiesTotal}
                  onClick={() => setActivitiesPage((p) => p + 1)}
                  className="px-3 py-1 rounded-lg bg-mx-elevated disabled:opacity-40 cursor-pointer text-white"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5: SUBSCRIPTIONS & QUOTAS ────────────────────────────────── */}
      {activeTab === 'plans' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-3xl bg-mx-surface border border-mx-border space-y-4">
            <h3 className="text-base font-bold text-white">Pakistani Institutional Subscription Tiers</h3>
            <p className="text-xs text-mx-subtle max-w-2xl">
              Capacity thresholds and feature packages enforced per school tenant. Managed globally by MegaTrix Admin Core.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400">Single Campus Tier</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white">Standard</span>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-white">PKR 12,000</h4>
                  <p className="text-xs text-mx-subtle">per month / single campus</p>
                </div>
                <ul className="text-xs text-neutral-300 space-y-2 border-t border-white/5 pt-4">
                  <li>✓ Up to 500 Students</li>
                  <li>✓ 3-Copy Bank Fee Challans</li>
                  <li>✓ Admin & Teacher Portals</li>
                  <li>✓ CR80 PVC Student ID Cards</li>
                  <li>✓ Daily Attendance & Class Diary</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-b from-sky-950/30 to-black/60 border border-sky-500/40 space-y-4 relative shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Multi-Branch Pro</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    MOST POPULAR
                  </span>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-white">PKR 25,000</h4>
                  <p className="text-xs text-mx-subtle">per month / up to 3 branches</p>
                </div>
                <ul className="text-xs text-neutral-300 space-y-2 border-t border-white/5 pt-4">
                  <li>✓ Up to 2,500 Students</li>
                  <li>✓ Parent Multi-Child Portal</li>
                  <li>✓ Staff HR & Monthly Payroll</li>
                  <li>✓ Constraint-Based Timetable Generator</li>
                  <li>✓ Transactional SMS & Notifications</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400">Group of Schools Enterprise</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white">Custom</span>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-white">PKR 55,000+</h4>
                  <p className="text-xs text-mx-subtle">per month / unlimited campuses</p>
                </div>
                <ul className="text-xs text-neutral-300 space-y-2 border-t border-white/5 pt-4">
                  <li>✓ Unlimited Students & Faculty</li>
                  <li>✓ Centralized Group Accounting & Audit</li>
                  <li>✓ Dedicated Database Tenancy</li>
                  <li>✓ Custom Subdomain & Tenant Crest Branding</li>
                  <li>✓ Priority 24/7 SLA Engineering Support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 1: SCHOOL DETAIL INSPECTOR (Section 5) ─────────────────── */}
      {inspectorSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-mx-surface border border-mx-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setInspectorSchool(null)}
              className="absolute top-5 right-5 text-mx-subtle hover:text-white p-1 cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-sky-500/15 text-sky-400 flex-shrink-0">
                <FiHome className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{inspectorSchool.name}</h3>
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                    {inspectorSchool.code}
                  </span>
                </div>
                <p className="text-xs text-mx-subtle flex items-center gap-1.5">
                  <FiMapPin className="w-3.5 h-3.5" />
                  <span>
                    {inspectorSchool.address?.street ? `${inspectorSchool.address.street}, ` : ''}
                    {inspectorSchool.address?.city || 'Lahore'}, {inspectorSchool.address?.state || 'Punjab'}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
              <div>
                <p className="text-xl font-bold font-mono text-sky-400">
                  {inspectorSchool.stats?.studentCount ?? inspectorSchool.studentCount ?? 0}
                </p>
                <p className="text-[11px] text-mx-subtle">Students</p>
              </div>
              <div>
                <p className="text-xl font-bold font-mono text-emerald-400">
                  {inspectorSchool.stats?.teacherCount ?? inspectorSchool.teacherCount ?? 0}
                </p>
                <p className="text-[11px] text-mx-subtle">Teachers</p>
              </div>
              <div>
                <p className="text-xl font-bold font-mono text-purple-400">
                  {inspectorSchool.stats?.staffCount ?? inspectorSchool.staffCount ?? 0}
                </p>
                <p className="text-[11px] text-mx-subtle">Staff</p>
              </div>
              <div>
                <p className="text-xl font-bold font-mono text-amber-400">
                  {inspectorSchool.stats?.classCount ?? inspectorSchool.classCount ?? 0}
                </p>
                <p className="text-[11px] text-mx-subtle">Classes</p>
              </div>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-mx-elevated border border-mx-border space-y-1">
                <span className="text-mx-subtle font-medium">Principal / Executive Head:</span>
                <p className="font-bold text-white">{inspectorSchool.principalName || 'Prof. Tariq Hameed'}</p>
                <p className="text-mx-subtle font-mono">{inspectorSchool.principalEmail || inspectorSchool.email}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-mx-elevated border border-mx-border space-y-1">
                <span className="text-mx-subtle font-medium">Official Contact:</span>
                <p className="font-bold text-white">{inspectorSchool.phone || '0300-1234567'}</p>
                <p className="text-mx-subtle font-mono">Affiliation: {inspectorSchool.board || 'BISE Lahore'}</p>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="pt-4 border-t border-mx-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-mx-subtle">Current Status:</span>
                <StatusPill status={inspectorSchool.status || (inspectorSchool.isActive ? 'active' : 'suspended')} />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLaunchSchoolPortal(inspectorSchool._id)}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/25 flex items-center gap-1.5 cursor-pointer"
                >
                  <FiExternalLink className="w-3.5 h-3.5" />
                  <span>Open in School Manager</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: USER DETAIL INSPECTOR (Section 9) ───────────────────── */}
      {inspectorUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-mx-surface border border-mx-border rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setInspectorUser(null)}
              className="absolute top-5 right-5 text-mx-subtle hover:text-white p-1 cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold text-lg">
                {inspectorUser.name ? inspectorUser.name[0] : 'U'}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{inspectorUser.name}</h3>
                <p className="text-xs text-mx-subtle">{inspectorUser.email}</p>
                <span className="inline-block mt-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  Role: {inspectorUser.role}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-b border-mx-border py-4">
              <div className="flex justify-between">
                <span className="text-mx-subtle">Assigned School:</span>
                <span className="font-semibold text-white">
                  {inspectorUser.school?.name || inspectorUser.schoolName || '—'} (
                  {inspectorUser.school?.code || inspectorUser.schoolCode || '—'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-mx-subtle">Phone Number:</span>
                <span className="font-mono text-neutral-300">{inspectorUser.phone || '—'}</span>
              </div>
              {inspectorUser.cnic && (
                <div className="flex justify-between">
                  <span className="text-mx-subtle">National CNIC:</span>
                  <span className="font-mono text-neutral-300">{inspectorUser.cnic}</span>
                </div>
              )}
              {inspectorUser.designation && (
                <div className="flex justify-between">
                  <span className="text-mx-subtle">Designation:</span>
                  <span className="text-neutral-300">{inspectorUser.designation}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-mx-subtle">Last Sign-in:</span>
                <span className="font-mono text-neutral-300">
                  {inspectorUser.lastLogin ? new Date(inspectorUser.lastLogin).toLocaleString() : 'Never logged in'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-mx-subtle">Account Status:</span>
                <StatusPill status={inspectorUser.status} />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setInspectorUser(null)}
                className="px-4 py-2 rounded-xl bg-mx-elevated text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetUser = inspectorUser;
                  setInspectorUser(null);
                  setResetPasswordModal({
                    isOpen: true,
                    user: targetUser,
                    reason: 'User cannot access registered email / assisted recovery',
                    generatedCred: null,
                  });
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer"
              >
                Assist Password Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: BLOCK SCHOOL CONFIRMATION (Section 6) ────────────────── */}
      {blockSchoolModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-mx-surface border border-mx-border rounded-3xl max-w-md w-full p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setBlockSchoolModal({ isOpen: false, school: null, reason: '' })}
              disabled={blockingSchoolLoading}
              className="absolute top-4 right-4 text-mx-subtle hover:text-white p-1 cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 flex-shrink-0">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Block School Tenant?</h3>
                <p className="text-xs text-sky-400 font-mono mt-0.5">
                  {blockSchoolModal.school?.name} ({blockSchoolModal.school?.code})
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-neutral-300 space-y-1.5">
              <p className="text-amber-200">
                Blocking this school will immediately prevent all teachers, staff, admins, and parents from signing into
                School Manager.
              </p>
              <p className="text-mx-subtle">
                <strong>School data will NOT be deleted.</strong> Student documents, fees, and academic records remain safe.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-mx-subtle uppercase tracking-wider">
                Reason for Administrative Block (Required):
              </label>
              <textarea
                required
                rows={2}
                placeholder="e.g. Non-payment of monthly license fees / regulatory audit pending"
                value={blockSchoolModal.reason}
                onChange={(e) => setBlockSchoolModal({ ...blockSchoolModal, reason: e.target.value })}
                className="w-full p-3 rounded-xl bg-mx-elevated border border-mx-border text-white text-xs placeholder:text-mx-subtle focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setBlockSchoolModal({ isOpen: false, school: null, reason: '' })}
                disabled={blockingSchoolLoading}
                className="px-4 py-2 rounded-xl bg-mx-elevated text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlockSchoolConfirm}
                disabled={blockingSchoolLoading || !blockSchoolModal.reason.trim()}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/25 cursor-pointer disabled:opacity-50"
              >
                {blockingSchoolLoading ? 'Blocking Tenant...' : 'Confirm Block School'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: PERMANENT SCHOOL DELETION (Section 8) ────────────────── */}
      {deleteSchoolModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-mx-surface border border-rose-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setDeleteSchoolModal({ isOpen: false, school: null, confirmationInput: '' })}
              disabled={deletingSchoolLoading}
              className="absolute top-4 right-4 text-mx-subtle hover:text-white p-1 cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3">
              <div className="p-3.5 rounded-xl bg-rose-500/15 text-rose-400 flex-shrink-0">
                <FiTrash2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Permanently Delete School Tenant?</h3>
                <p className="text-xs text-rose-400 font-bold uppercase tracking-wider">
                  Irreversible Superadmin Action
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 space-y-2">
              <p className="font-bold">
                WARNING: This will permanently purge the school tenant and all associated data collections:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-300/90">
                <li>All enrolled student files and admission records</li>
                <li>All faculty and staff payroll ledgers</li>
                <li>All 3-copy bank fee challans and income entries</li>
                <li>All academic timetables and exam grading transcripts</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-mx-subtle">
                Type <strong className="text-white font-mono font-bold">"{deleteSchoolModal.school?.name}"</strong> to
                confirm:
              </label>
              <input
                type="text"
                placeholder={deleteSchoolModal.school?.name}
                value={deleteSchoolModal.confirmationInput}
                onChange={(e) =>
                  setDeleteSchoolModal({ ...deleteSchoolModal, confirmationInput: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-mx-elevated border border-rose-500/30 text-white text-xs font-mono focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteSchoolModal({ isOpen: false, school: null, confirmationInput: '' })}
                disabled={deletingSchoolLoading}
                className="px-4 py-2 rounded-xl bg-mx-elevated text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSchoolConfirm}
                disabled={
                  deletingSchoolLoading ||
                  deleteSchoolModal.confirmationInput.trim() !== deleteSchoolModal.school?.name.trim()
                }
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deletingSchoolLoading ? 'Purging Tenant...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 5: BLOCK USER CONFIRMATION (Section 10) ────────────────── */}
      {blockUserModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-mx-surface border border-mx-border rounded-3xl max-w-md w-full p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setBlockUserModal({ isOpen: false, user: null, reason: '' })}
              disabled={blockingUserLoading}
              className="absolute top-4 right-4 text-mx-subtle hover:text-white p-1 cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 flex-shrink-0">
                <FiUserX className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Block School Manager User?</h3>
                <p className="text-xs text-sky-400 font-mono mt-0.5">
                  {blockUserModal.user?.name} ({blockUserModal.user?.role})
                </p>
              </div>
            </div>

            <p className="text-xs text-mx-subtle">
              Blocking will immediately revoke active JWT refresh tokens and prevent sign-in into School Manager.
              User profile and history remain preserved.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-mx-subtle uppercase tracking-wider">
                Reason (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Account suspended per school principal request"
                value={blockUserModal.reason}
                onChange={(e) => setBlockUserModal({ ...blockUserModal, reason: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-mx-elevated border border-mx-border text-white text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setBlockUserModal({ isOpen: false, user: null, reason: '' })}
                disabled={blockingUserLoading}
                className="px-4 py-2 rounded-xl bg-mx-elevated text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlockUserConfirm}
                disabled={blockingUserLoading}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
              >
                {blockingUserLoading ? 'Blocking User...' : 'Confirm Block'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 6: ADMIN ASSISTED PASSWORD RESET (Sections 12, 13, 14) ──── */}
      {resetPasswordModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-mx-surface border border-mx-border rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 relative shadow-2xl">
            <button
              onClick={() =>
                setResetPasswordModal({
                  isOpen: false,
                  user: null,
                  reason: '',
                  generatedCred: null,
                })
              }
              disabled={resettingPasswordLoading}
              className="absolute top-5 right-5 text-mx-subtle hover:text-white p-1 cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-sky-500/15 text-sky-400 flex-shrink-0">
                <FiKey className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Administrator-Assisted Reset</h3>
                <p className="text-xs text-mx-subtle">
                  Assisting locked-out user without email access
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-mx-subtle">User:</span>
                <span className="font-semibold text-white">{resetPasswordModal.user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mx-subtle">Email/ID:</span>
                <span className="font-mono text-neutral-300">{resetPasswordModal.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mx-subtle">School:</span>
                <span className="text-neutral-300">{resetPasswordModal.user?.schoolName}</span>
              </div>
            </div>

            {/* Generated Temporary Password Display Box */}
            {resetPasswordModal.generatedCred ? (
              <div className="space-y-3 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl animate-in zoom-in-95 duration-150">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Temporary Access Credential Created</span>
                </div>
                <p className="text-[11px] text-emerald-200/80">
                  Provide this temporary password to the user. All previous active sessions have been purged and they will
                  be forced to select a new password upon signing in.
                </p>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-emerald-500/30 font-mono text-base font-bold text-white">
                  <span>{resetPasswordModal.generatedCred}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(resetPasswordModal.generatedCred);
                      toast.success('Temporary credential copied to clipboard!');
                    }}
                    className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 cursor-pointer"
                    title="Copy temporary password"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-200">
                  The existing password will never be revealed or logged. A secure, high-entropy one-time access
                  password will be generated and audited.
                </div>

                <div>
                  <label className="block text-xs font-bold text-mx-subtle uppercase tracking-wider mb-1.5">
                    Administrative Reason:
                  </label>
                  <input
                    type="text"
                    required
                    value={resetPasswordModal.reason}
                    onChange={(e) => setResetPasswordModal({ ...resetPasswordModal, reason: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-mx-elevated border border-mx-border text-white text-xs focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              {resetPasswordModal.generatedCred ? (
                <button
                  type="button"
                  onClick={() =>
                    setResetPasswordModal({
                      isOpen: false,
                      user: null,
                      reason: '',
                      generatedCred: null,
                    })
                  }
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setResetPasswordModal({
                        isOpen: false,
                        user: null,
                        reason: '',
                        generatedCred: null,
                      })
                    }
                    disabled={resettingPasswordLoading}
                    className="px-4 py-2 rounded-xl bg-mx-elevated text-neutral-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAdminResetPassword}
                    disabled={resettingPasswordLoading || !resetPasswordModal.reason.trim()}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/25 cursor-pointer disabled:opacity-50"
                  >
                    {resettingPasswordLoading ? 'Generating...' : 'Generate Temporary Access'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolManagerModule;
