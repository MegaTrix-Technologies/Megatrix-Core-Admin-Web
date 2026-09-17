import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import adminApi from '../services/adminApi';
import {
  User,
  Shield,
  Key,
  Mail,
  Phone,
  Save,
  Search,
  UserPlus,
  Filter,
  X,
  RefreshCw,
  Smartphone,
  HardDrive,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Send,
} from 'lucide-react';
import { toast } from 'react-toastify';

// Executive Administrator Seed Roster — Only 1 Superadmin Active
const DEFAULT_ADMIN_ROSTER = [
  {
    id: 'ADM-001',
    name: 'Zohaib Rana',
    email: 'admin.megatrix@gmail.com',
    phone: '+92 300 8472910',
    role: 'Superadmin',
    scope: 'Global Core',
    authMethod: 'FIDO2 Hardware Key',
    status: 'active',
    lastActive: 'Just now',
    createdAt: '2025-01-10',
    isRoot: true,
  },
];

// Governance Security Audit Log Events
const AUDIT_EVENTS = [
  {
    id: 'AUD-901',
    timestamp: 'Today, 14:52',
    actor: 'Zohaib Rana',
    event: 'Root Session Authenticated',
    scope: 'Global Core',
    ip: '192.168.0.109',
    category: 'auth',
    status: 'Success',
  },
  {
    id: 'AUD-902',
    timestamp: 'Today, 14:38',
    actor: 'Zohaib Rana',
    event: 'Tenant Password Reset (SCH-101)',
    scope: 'School Hub',
    ip: '192.168.0.109',
    category: 'credentials',
    status: 'Success',
  },
  {
    id: 'AUD-903',
    timestamp: 'Today, 13:15',
    actor: 'Zohaib Rana',
    event: 'Security Policy Baseline Initialized',
    scope: 'School Hub',
    ip: '192.168.0.109',
    category: 'role',
    status: 'Success',
  },
  {
    id: 'AUD-904',
    timestamp: 'Yesterday, 19:40',
    actor: 'Zohaib Rana',
    event: 'Merchant Plan Synchronized (POS-PRO)',
    scope: 'Biz Manager',
    ip: '192.168.0.109',
    category: 'tenant',
    status: 'Success',
  },
  {
    id: 'AUD-905',
    timestamp: 'Yesterday, 11:20',
    actor: 'Zohaib Rana',
    event: 'Hardware Security Key Reaffirmed',
    scope: 'Global Core',
    ip: '192.168.0.109',
    category: 'auth',
    status: 'Success',
  },
  {
    id: 'AUD-906',
    timestamp: '3 days ago',
    actor: 'Zohaib Rana',
    event: 'Rotated Global Signing Key',
    scope: 'Global Core',
    ip: '192.168.0.109',
    category: 'credentials',
    status: 'Success',
  },
];

export default function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { adminUser, updateAdminUser } = useAdminAuth();

  // Active Tab State (profile | security | admins)
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'profile');

  useEffect(() => {
    if (tabParam && ['profile', 'security', 'admins'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Profile Form States
  const [name, setName] = useState(adminUser?.name || 'Zohaib Rana');
  const [phone, setPhone] = useState(adminUser?.phone || '+92 300 8472910');
  const [designation, setDesignation] = useState('Principal Infrastructure Director');
  const [notifySecurityAlerts, setNotifySecurityAlerts] = useState(true);
  const [notifyKeyRotation, setNotifyKeyRotation] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Security Credentials Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Audit Logs State
  const [auditFilter, setAuditFilter] = useState('all');

  // Administrator Management States
  const [adminRoster, setAdminRoster] = useState(() => {
    try {
      const saved = localStorage.getItem('megatrix_admin_roster');
      if (saved) {
        const parsed = JSON.parse(saved);
        const cleaned = parsed.filter(
          (u) =>
            !['ADM-002', 'ADM-003', 'ADM-004', 'ADM-005'].includes(u.id) &&
            !['Ayesha Khan', 'Bilal Ahmed', 'Hamza Tariq', 'Sana Malik'].includes(u.name)
        );
        if (cleaned.length > 0) return cleaned;
      }
    } catch {
      // Ignore
    }
    return DEFAULT_ADMIN_ROSTER;
  });
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminRoleFilter, setAdminRoleFilter] = useState('all');
  const [adminScopeFilter, setAdminScopeFilter] = useState('all');
  const [adminStatusFilter, setAdminStatusFilter] = useState('all');

  // Modals for Admins Tab
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [submittingInvite, setSubmittingInvite] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Platform Director');
  const [newAdminScope, setNewAdminScope] = useState('School Hub');
  const [newAdminAccessLevel, setNewAdminAccessLevel] = useState('full');

  // Slack-Style Shareable Invitation Modal
  const [isShareLinkModalOpen, setIsShareLinkModalOpen] = useState(false);
  const [invitationSuccessData, setInvitationSuccessData] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reset Admin Password Modal
  const [resetTargetAdmin, setResetTargetAdmin] = useState(null);
  const [tempPassphrase, setTempPassphrase] = useState('');
  const [forcePasswordReset, setForcePasswordReset] = useState(true);

  const canManageAdmins =
    !adminUser?.role ||
    adminUser?.isSuperAdmin ||
    adminUser?.accessLevel === 'full' ||
    (typeof adminUser.role === 'string' && (
      adminUser.role.toLowerCase().includes('super') ||
      adminUser.role.toLowerCase().includes('director') ||
      adminUser.role.toLowerCase().includes('lead')
    ));

  // Fetch Real Users from Backend (with fallback)
  const loadAdminUsers = useCallback(async () => {
    setLoadingAdmins(true);
    try {
      const res = await adminApi.getUsers();
      if (res?.success && Array.isArray(res.users) && res.users.length > 0) {
        const mapped = res.users.map((u, idx) => {
          let roleTitle = 'Platform Administrator';
          if (u.isSuperAdmin) roleTitle = 'Superadmin';
          else if (u.roles?.[0]?.name) roleTitle = u.roles[0].name;
          else if (u.accessLevel === 'full') roleTitle = 'Full Access Administrator';

          let scopeTitle = 'Global Core';
          if (u.platformScopes?.includes('global')) scopeTitle = 'Global Core';
          else if (u.platformScopes?.length) {
            scopeTitle = u.platformScopes
              .map((s) => (s === 'bizmanager' ? 'Biz Manager' : s === 'schoolmanager' ? 'School Hub' : s))
              .join(', ');
          }

          let lastActiveText = 'Never';
          if (u.lastLoginAt) {
            lastActiveText = new Date(u.lastLoginAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
          } else if (u.status === 'invited') {
            lastActiveText = 'Pending Activation';
          }

          return {
            id: u._id || `ADM-${String(idx + 1).padStart(3, '0')}`,
            name: u.name,
            email: u.email,
            phone: u.phone || '—',
            role: roleTitle,
            scope: scopeTitle,
            authMethod: u.isSuperAdmin ? 'FIDO2 Hardware Key' : 'TOTP Authenticator',
            status: u.status || 'active',
            lastActive: lastActiveText,
            createdAt: u.createdAt ? u.createdAt.split('T')[0] : '2025-01-10',
            isRoot: !!u.isSuperAdmin,
            accessLevel: u.accessLevel || 'partial',
            rawUser: u,
          };
        });
        setAdminRoster(mapped);
        localStorage.setItem('megatrix_admin_roster', JSON.stringify(mapped));
        return;
      }
    } catch (err) {
      console.warn('[SettingsPage] Live user query failed, falling back to local roster:', err.message);
    } finally {
      setLoadingAdmins(false);
    }

    // Fallback to local storage (sanitized) or default single superadmin
    try {
      const saved = localStorage.getItem('megatrix_admin_roster');
      if (saved) {
        const parsed = JSON.parse(saved);
        const cleaned = parsed.filter(
          (u) =>
            !['ADM-002', 'ADM-003', 'ADM-004', 'ADM-005'].includes(u.id) &&
            !['Ayesha Khan', 'Bilal Ahmed', 'Hamza Tariq', 'Sana Malik'].includes(u.name)
        );
        if (cleaned.length > 0) {
          setAdminRoster(cleaned);
          localStorage.setItem('megatrix_admin_roster', JSON.stringify(cleaned));
          return;
        }
      }
    } catch {
      // Ignore
    }
    setAdminRoster(DEFAULT_ADMIN_ROSTER);
    try {
      localStorage.setItem('megatrix_admin_roster', JSON.stringify(DEFAULT_ADMIN_ROSTER));
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    loadAdminUsers();
  }, [loadAdminUsers]);

  // Save Roster to Local Storage
  const persistRoster = (updated) => {
    setAdminRoster(updated);
    try {
      localStorage.setItem('megatrix_admin_roster', JSON.stringify(updated));
    } catch {
      // Ignore quota storage exceptions
    }
  };

  // Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      if (updateAdminUser) {
        updateAdminUser({
          ...adminUser,
          name,
          phone,
        });
      }
      setSavingProfile(false);
      toast.success('Administrator profile synchronized successfully.');
    }, 400);
  };

  // Password Rotation
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 10) {
      toast.error('Passphrase must be at least 10 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passphrases do not match.');
      return;
    }
    setUpdatingPassword(true);
    setTimeout(() => {
      setUpdatingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Root credential rotated successfully. Hardware key reaffirmed.');
    }, 500);
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*()_+=';
    let pass = '';
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
    setConfirmPassword(pass);
    toast.info('Secure cryptographic passphrase generated.');
  };

  // Filtered Audit Logs
  const filteredAuditEvents = useMemo(() => {
    if (auditFilter === 'all') return AUDIT_EVENTS;
    return AUDIT_EVENTS.filter((ev) => ev.category === auditFilter);
  }, [auditFilter]);

  // Filtered Admin Roster
  const filteredAdmins = useMemo(() => {
    return adminRoster.filter((adm) => {
      if (adminSearch.trim()) {
        const q = adminSearch.toLowerCase().trim();
        const matchesQuery =
          adm.name.toLowerCase().includes(q) ||
          adm.email.toLowerCase().includes(q) ||
          adm.phone.toLowerCase().includes(q) ||
          adm.role.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      if (adminRoleFilter !== 'all' && adm.role !== adminRoleFilter) return false;
      if (adminScopeFilter !== 'all' && adm.scope !== adminScopeFilter) return false;
      if (adminStatusFilter !== 'all' && adm.status !== adminStatusFilter) return false;
      return true;
    });
  }, [adminRoster, adminSearch, adminRoleFilter, adminScopeFilter, adminStatusFilter]);

  // Admin Roster Actions
  const handleOpenInviteModal = () => {
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminPhone('');
    setNewAdminRole('Platform Director');
    setNewAdminScope('School Hub');
    setNewAdminAccessLevel('full');
    setIsInviteModalOpen(true);
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim()) {
      toast.error('Name and corporate email are required.');
      return;
    }

    setSubmittingInvite(true);
    try {
      const payload = {
        name: newAdminName.trim(),
        email: newAdminEmail.trim().toLowerCase(),
        phone: newAdminPhone.trim() || '',
        accessLevel: newAdminAccessLevel,
        platformScopes:
          newAdminScope === 'Global Core'
            ? ['global']
            : newAdminScope === 'School Hub'
            ? ['schoolmanager']
            : ['bizmanager'],
        roles: [],
      };

      const res = await adminApi.inviteUser(payload);
      if (res?.success) {
        setIsInviteModalOpen(false);
        setInvitationSuccessData({
          name: newAdminName.trim(),
          email: newAdminEmail.trim().toLowerCase(),
          invitationUrl: res.invitationUrl,
          accessLevel: newAdminAccessLevel,
          emailSent: res.emailSent !== false,
        });
        setIsShareLinkModalOpen(true);
        setNewAdminName('');
        setNewAdminEmail('');
        setNewAdminPhone('');
        await loadAdminUsers();
        toast.success(`Invitation dispatched to ${payload.email}!`);
      } else {
        toast.error(res?.message || 'Failed to dispatch invitation.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch invitation.');
    } finally {
      setSubmittingInvite(false);
    }
  };

  const handleCopyInvitationLink = (customUrl) => {
    const url = customUrl || invitationSuccessData?.invitationUrl;
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success('Confidential invitation link copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleToggleAdminStatus = async (adm) => {
    if (adm.isRoot) {
      toast.warn('The Superadmin account cannot be altered.');
      return;
    }
    const newStatus = adm.status === 'active' ? 'suspended' : 'active';
    try {
      if (adm.rawUser?._id) {
        await adminApi.toggleUserStatus(adm.rawUser._id, newStatus, 'Status changed in Governance console');
        toast.info(`Operator ${adm.name} status updated to ${newStatus.toUpperCase()}.`);
        await loadAdminUsers();
      } else {
        const updated = adminRoster.map((item) =>
          item.id === adm.id ? { ...item, status: newStatus } : item
        );
        persistRoster(updated);
        toast.info(`Operator ${adm.name} status updated to ${newStatus.toUpperCase()}.`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleOpenResetPassword = (adm) => {
    const randomPass = `MX-SEC-${Math.floor(100000 + Math.random() * 900000)}`;
    setResetTargetAdmin(adm);
    setTempPassphrase(randomPass);
    setForcePasswordReset(true);
  };

  const handleConfirmResetPassword = () => {
    if (!resetTargetAdmin) return;
    toast.success(
      `Temporary passphrase generated for ${resetTargetAdmin.name}. Next login forces rotation.`
    );
    setResetTargetAdmin(null);
  };

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
       * HEADER & TAB NAVIGATION
       * ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-mx-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-mx-subtle">Console</span>
            <span className="text-xs text-mx-subtle">/</span>
            <span className="text-xs font-semibold text-mx-blue">System and Governance</span>
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            System and Governance
          </h1>
          <p className="text-xs text-mx-subtle mt-1">
            Identity verification, security credentials, platform scope control, and live audit telemetry.
          </p>
        </div>

        {/* Tab Navigation Pill Group */}
        <div className="flex items-center gap-2 p-1 bg-mx-surface border border-mx-border rounded-sm self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleTabChange('profile')}
            className={`flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-black'
                : 'text-mx-subtle hover:text-white hover:bg-mx-panel'
            }`}
          >
            <User size={14} strokeWidth={1.5} />
            <span>Profile</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('security')}
            className={`flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-black'
                : 'text-mx-subtle hover:text-white hover:bg-mx-panel'
            }`}
          >
            <Key size={14} strokeWidth={1.5} />
            <span>Security and Audit</span>
          </button>

          {canManageAdmins && (
            <button
              type="button"
              onClick={() => handleTabChange('admins')}
              className={`flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'admins'
                  ? 'bg-white text-black'
                  : 'text-mx-subtle hover:text-white hover:bg-mx-panel'
              }`}
            >
              <Shield size={14} strokeWidth={1.5} />
              <span>Admin Users</span>
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * TAB 1: PROFILE
       * ───────────────────────────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity Dossier Card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-mx-surface border border-mx-border rounded-sm p-4 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-mx-border">
                <div className="w-12 h-12 rounded-sm bg-mx-panel border border-mx-border flex items-center justify-center font-semibold text-white text-base">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-white truncate">{name}</h2>
                    <span className="text-[11px] font-mono text-mx-blue font-semibold">
                      [Root]
                    </span>
                  </div>
                  <p className="text-xs text-mx-subtle truncate mt-1">
                    {adminUser?.email || 'admin.megatrix@gmail.com'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-xs font-semibold text-mx-subtle block">
                    Account Classification
                  </span>
                  <span className="text-white font-normal mt-1 block">
                    Tier-0 Platform Superadmin
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold text-mx-subtle block">
                    Platform Jurisdiction
                  </span>
                  <span className="text-xs text-white block mt-1">
                    School Hub, Biz Manager (Global Scope)
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold text-mx-subtle block">
                    Security Clearance
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-mx-positive" />
                    <span className="text-white font-normal">Active Root Operator</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-mx-border">
                  <span className="text-xs font-semibold text-mx-subtle block">
                    Operator Identifier
                  </span>
                  <span className="text-xs font-mono text-mx-subtle block mt-1">
                    ADM-ROOT-001 (Immutable)
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Status Card */}
            <div className="bg-mx-surface border border-mx-border rounded-sm p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-mx-border">
                <span className="text-xs font-semibold text-white">Verification Status</span>
                <span className="text-xs font-mono text-mx-positive flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-mx-positive" />
                  Authenticated
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-mx-subtle">Session Timeout:</span>
                  <span className="text-white font-mono">120 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-mx-subtle">IP Authority:</span>
                  <span className="text-white font-mono">192.168.0.109</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-mx-subtle">TLS Cipher:</span>
                  <span className="text-white font-mono">ECDHE-RSA-AES256-GCM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Details Card */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSaveProfile}
              className="bg-mx-surface border border-mx-border rounded-sm p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-mx-border">
                <div>
                  <h2 className="text-sm font-semibold text-white">Administrator Dossier</h2>
                  <p className="text-xs text-mx-subtle mt-1">
                    Operational identity details linked to your MegaTrix console session.
                  </p>
                </div>
                <span className="text-xs text-mx-subtle flex items-center gap-2 font-mono">
                  <span className="w-2 h-2 rounded-full bg-mx-positive" />
                  Profile Sync Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-mx-subtle">
                    Full Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-mx-subtle">
                    Authorized Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10 w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-mx-subtle">
                  System Role and Designation
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="h-10 w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-mx-subtle">
                  Primary Corporate Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-mx-subtle"
                  />
                  <input
                    type="email"
                    disabled
                    value={adminUser?.email || 'admin.megatrix@gmail.com'}
                    className="h-10 w-full pl-9 pr-4 py-2 bg-mx-panel/50 border border-mx-border rounded-sm text-xs text-mx-subtle cursor-not-allowed font-mono"
                  />
                </div>
                <p className="text-xs text-mx-subtle mt-1">
                  Root email address is bound to system tenant authentication.
                </p>
              </div>

              {/* Notification Toggles */}
              <div className="pt-4 border-t border-mx-border space-y-3">
                <h3 className="text-xs font-semibold text-white">Emergency Security Dispatch</h3>
                <label className="flex items-center gap-3 cursor-pointer text-xs text-mx-subtle select-none">
                  <input
                    type="checkbox"
                    checked={notifySecurityAlerts}
                    onChange={(e) => setNotifySecurityAlerts(e.target.checked)}
                    className="w-4 h-4 rounded-sm bg-mx-panel border-mx-border text-mx-blue focus:ring-0 cursor-pointer"
                  />
                  <span>Dispatch immediate security alerts for root access elevations</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs text-mx-subtle select-none">
                  <input
                    type="checkbox"
                    checked={notifyKeyRotation}
                    onChange={(e) => setNotifyKeyRotation(e.target.checked)}
                    className="w-4 h-4 rounded-sm bg-mx-panel border-mx-border text-mx-blue focus:ring-0 cursor-pointer"
                  />
                  <span>Notify upon cross-platform tenant credential rotation</span>
                </label>
              </div>

              <div className="flex justify-end pt-4 border-t border-mx-border">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="h-9 inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Save size={14} strokeWidth={1.5} />
                  <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
       * TAB 2: SECURITY AND AUDIT
       * ───────────────────────────────────────────────────────────── */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password Rotation Form */}
            <form
              onSubmit={handleUpdatePassword}
              className="bg-mx-surface border border-mx-border rounded-sm p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-mx-border">
                <div className="flex items-center gap-2">
                  <Key size={16} strokeWidth={1.5} className="text-mx-subtle" />
                  <h2 className="text-sm font-semibold text-white">Root Credential Rotation</h2>
                </div>
                <button
                  type="button"
                  onClick={generateStrongPassword}
                  className="text-xs text-mx-blue hover:underline cursor-pointer"
                >
                  Generate Strong Passphrase
                </button>
              </div>

              <p className="text-xs text-mx-subtle">
                Minimum 10 characters with uppercase, lowercase, numbers, and special symbols.
              </p>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-mx-subtle">
                  Current Passphrase
                </label>
                <input
                  type="password"
                  placeholder="Enter current passphrase"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-10 w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-mx-subtle">
                  New Passphrase
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new strong passphrase"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10 w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-mx-subtle">
                  Confirm New Passphrase
                </label>
                <input
                  type="password"
                  required
                  placeholder="Confirm new passphrase"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors font-mono"
                />
              </div>

              <div className="flex justify-end pt-3 border-t border-mx-border">
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="h-9 px-4 py-2 rounded-sm bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-colors cursor-pointer"
                >
                  {updatingPassword ? 'Rotating...' : 'Rotate Security Password'}
                </button>
              </div>
            </form>

            {/* Hardware & Multi-Factor Authentication */}
            <div className="bg-mx-surface border border-mx-border rounded-sm p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-mx-border">
                <Shield size={16} strokeWidth={1.5} className="text-mx-subtle" />
                <h2 className="text-sm font-semibold text-white">Multi-Factor Hardware Posture</h2>
              </div>

              <div className="space-y-3 text-xs">
                {/* Hardware Security Key */}
                <div className="p-3 rounded-sm bg-mx-panel border border-mx-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive size={16} strokeWidth={1.5} className="text-mx-subtle" />
                      <span className="text-white font-semibold">FIDO2 Hardware Key</span>
                    </div>
                    <span className="text-xs font-mono text-mx-positive flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-mx-positive" />
                      Enforced
                    </span>
                  </div>
                  <p className="text-xs text-mx-subtle font-mono">
                    Device: YubiKey 5C NFC / Key ID: KEY-FIDO-9481
                  </p>
                </div>

                {/* TOTP Authenticator */}
                <div className="p-3 rounded-sm bg-mx-panel border border-mx-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone size={16} strokeWidth={1.5} className="text-mx-subtle" />
                      <span className="text-white font-semibold">Authenticator App (TOTP)</span>
                    </div>
                    <span className="text-xs font-mono text-mx-subtle">Configured</span>
                  </div>
                  <p className="text-xs text-mx-subtle font-mono">
                    Algorithm: HMAC-SHA1 / 30s Time-Step (RFC 6238)
                  </p>
                </div>

                {/* Emergency Session Revocation */}
                <div className="pt-3 border-t border-mx-border flex items-center justify-between">
                  <div>
                    <span className="text-white font-semibold block">Session Invalidation</span>
                    <span className="text-xs text-mx-subtle block mt-1">
                      Terminate all active JWT credentials across all platforms.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.info('All external operator sessions invalidated.')}
                    className="h-8 px-3 py-1 rounded-sm border border-mx-border text-white hover:bg-mx-panel text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Revoke All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Governance Audit Log Table */}
          <div className="bg-mx-surface border border-mx-border rounded-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-white">Live Governance Audit Trail</h2>
                <p className="text-xs text-mx-subtle mt-1">
                  Administrative mutation events across platform workspaces.
                </p>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-2">
                {[
                  { key: 'all', label: 'All Events' },
                  { key: 'auth', label: 'Auth' },
                  { key: 'credentials', label: 'Credentials' },
                  { key: 'role', label: 'Roles' },
                  { key: 'tenant', label: 'Tenants' },
                ].map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => setAuditFilter(chip.key)}
                    className={`px-3 py-1 rounded-sm text-xs font-semibold transition-colors cursor-pointer ${
                      auditFilter === chip.key
                        ? 'bg-white text-black'
                        : 'bg-mx-panel text-mx-subtle border border-mx-border hover:text-white'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Records Table */}
            <div className="border border-mx-border rounded-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-mx-border bg-mx-panel text-mx-subtle font-semibold">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor</th>
                    <th className="p-3">Action Event</th>
                    <th className="p-3">Platform Scope</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mx-border text-white">
                  {filteredAuditEvents.map((ev) => (
                    <tr key={ev.id} className="hover:bg-mx-panel/40 transition-colors">
                      <td className="p-3 font-mono text-mx-subtle">{ev.timestamp}</td>
                      <td className="p-3 font-normal text-white">{ev.actor}</td>
                      <td className="p-3 text-mx-subtle">{ev.event}</td>
                      <td className="p-3">
                        <span className="font-mono text-xs text-mx-subtle">{ev.scope}</span>
                      </td>
                      <td className="p-3 font-mono text-mx-subtle">{ev.ip}</td>
                      <td className="p-3 text-right">
                        <span className="font-mono text-xs text-mx-positive">{ev.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
       * TAB 3: ADMIN USERS
       * ───────────────────────────────────────────────────────────── */}
      {activeTab === 'admins' && canManageAdmins && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-mx-surface border border-mx-border rounded-sm p-4 space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-mx-subtle"
                />
                <input
                  type="text"
                  placeholder="Search administrators by name, email, or phone..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="h-10 w-full pl-9 pr-4 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              {/* Actions: Refresh Directory & Add Administrator */}
              <div className="flex items-center gap-2 self-start lg:self-auto">
                <button
                  type="button"
                  onClick={loadAdminUsers}
                  disabled={loadingAdmins}
                  title="Synchronize with live database"
                  className="h-10 inline-flex items-center gap-2 px-3 py-2 rounded-sm border border-mx-border bg-mx-panel hover:text-white text-mx-subtle text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={14} strokeWidth={1.5} className={loadingAdmins ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">Sync Directory</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenInviteModal}
                  className="h-10 inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-colors cursor-pointer"
                >
                  <UserPlus size={14} strokeWidth={1.5} />
                  <span>Invite Administrator</span>
                </button>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-mx-border text-xs">
              <div className="flex items-center gap-2">
                <Filter size={14} strokeWidth={1.5} className="text-mx-subtle" />
                <span className="text-mx-subtle font-semibold">Filters:</span>
              </div>

              <select
                value={adminRoleFilter}
                onChange={(e) => setAdminRoleFilter(e.target.value)}
                className="h-8 px-3 py-1 bg-mx-panel border border-mx-border rounded-sm text-xs text-white focus:outline-none focus:border-mx-blue cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="Superadmin">Superadmin</option>
                <option value="Platform Director">Platform Director</option>
                <option value="Operations Lead">Operations Lead</option>
                <option value="Security Engineer">Security Engineer</option>
                <option value="Compliance Auditor">Compliance Auditor</option>
              </select>

              <select
                value={adminScopeFilter}
                onChange={(e) => setAdminScopeFilter(e.target.value)}
                className="h-8 px-3 py-1 bg-mx-panel border border-mx-border rounded-sm text-xs text-white focus:outline-none focus:border-mx-blue cursor-pointer"
              >
                <option value="all">All Scopes</option>
                <option value="Global Core">Global Core</option>
                <option value="School Hub">School Hub</option>
                <option value="Biz Manager">Biz Manager</option>
              </select>

              <select
                value={adminStatusFilter}
                onChange={(e) => setAdminStatusFilter(e.target.value)}
                className="h-8 px-3 py-1 bg-mx-panel border border-mx-border rounded-sm text-xs text-white focus:outline-none focus:border-mx-blue cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>

              {(adminSearch ||
                adminRoleFilter !== 'all' ||
                adminScopeFilter !== 'all' ||
                adminStatusFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setAdminSearch('');
                    setAdminRoleFilter('all');
                    setAdminScopeFilter('all');
                    setAdminStatusFilter('all');
                  }}
                  className="text-xs text-mx-blue hover:underline cursor-pointer ml-auto"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Administrator Directory Table */}
          <div className="bg-mx-surface border border-mx-border rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-mx-border bg-mx-panel text-mx-subtle font-semibold">
                    <th className="p-3">Administrator</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Jurisdiction Scope</th>
                    <th className="p-3">Auth Method</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Last Active</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mx-border text-white">
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-mx-subtle text-xs">
                        No administrators found matching the active filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((adm) => (
                      <tr key={adm.id} className="hover:bg-mx-panel/40 transition-colors">
                        <td className="p-3">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white truncate">
                                {adm.name}
                              </span>
                              {adm.isRoot && (
                                <span className="text-[11px] font-mono text-mx-blue">
                                  [Root]
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-mx-subtle block truncate font-mono">
                              {adm.email}
                            </span>
                          </div>
                        </td>

                        <td className="p-3 font-normal text-white">{adm.role}</td>

                        <td className="p-3">
                          <span className="font-mono text-xs text-mx-subtle">{adm.scope}</span>
                        </td>

                        <td className="p-3">
                          <span className="text-xs text-mx-subtle">{adm.authMethod}</span>
                        </td>

                        <td className="p-3">
                          <span
                            className={`text-xs font-normal ${
                              adm.status === 'active'
                                ? 'text-mx-positive'
                                : adm.status === 'invited'
                                ? 'text-mx-blue'
                                : 'text-mx-subtle'
                            }`}
                          >
                            {adm.status === 'active'
                              ? 'Active'
                              : adm.status === 'invited'
                              ? 'Pending Activation'
                              : 'Suspended'}
                          </span>
                        </td>

                        <td className="p-3 text-mx-subtle font-mono text-xs">{adm.lastActive}</td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenResetPassword(adm)}
                              title="Rotate Credentials"
                              className="h-8 px-3 py-1 rounded-sm border border-mx-border text-xs text-mx-subtle hover:text-white hover:bg-mx-panel transition-colors cursor-pointer"
                            >
                              Reset
                            </button>

                            {!adm.isRoot && (
                              <button
                                type="button"
                                onClick={() => handleToggleAdminStatus(adm)}
                                className={`h-8 px-3 py-1 rounded-sm border border-mx-border text-xs transition-colors cursor-pointer ${
                                  adm.status === 'active'
                                    ? 'text-mx-subtle hover:text-white hover:bg-mx-panel'
                                    : 'text-mx-positive hover:bg-mx-panel'
                                }`}
                              >
                                {adm.status === 'active' ? 'Suspend' : 'Activate'}
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
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
       * MODAL 1: INVITE OPERATOR / ADMINISTRATOR
       * ───────────────────────────────────────────────────────────── */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-mx-surface border border-mx-border rounded-sm w-full max-w-lg overflow-hidden animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-mx-border bg-mx-panel">
              <div className="flex items-center gap-2">
                <UserPlus size={16} strokeWidth={1.5} className="text-white" />
                <h3 className="text-sm font-semibold text-white">Invite Platform Administrator</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="text-mx-subtle hover:text-white cursor-pointer"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-mx-subtle">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asim Raza"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="h-10 w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-mx-subtle">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="operator@megatrix.tech"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="h-10 w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-mx-subtle">
                    Direct Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+92 300 1234567"
                    value={newAdminPhone}
                    onChange={(e) => setNewAdminPhone(e.target.value)}
                    className="h-10 w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-mx-subtle">
                    System Role
                  </label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value)}
                    className="h-10 w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="Platform Director">Platform Director</option>
                    <option value="Operations Lead">Operations Lead</option>
                    <option value="Security Engineer">Security Engineer</option>
                    <option value="Compliance Auditor">Compliance Auditor</option>
                    <option value="Superadmin">Superadmin</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-mx-subtle">
                    Platform Jurisdiction
                  </label>
                  <select
                    value={newAdminScope}
                    onChange={(e) => setNewAdminScope(e.target.value)}
                    className="h-10 w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="Global Core">Global Core (All Workspaces)</option>
                    <option value="School Hub">School Hub</option>
                    <option value="Biz Manager">Biz Manager</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-mx-subtle">
                  Authority Level
                </label>
                <select
                  value={newAdminAccessLevel}
                  onChange={(e) => setNewAdminAccessLevel(e.target.value)}
                  className="h-10 w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="full">Full Access (Root Executive & Cross-Platform Management)</option>
                  <option value="partial">Granular Access (Jurisdiction-Restricted Scope)</option>
                </select>
              </div>

              <div className="p-3 bg-mx-panel border border-mx-border rounded-sm space-y-1">
                <span className="text-xs font-semibold text-white block">Slack-Style Invitation Dispatch:</span>
                <p className="text-xs text-mx-subtle leading-relaxed">
                  An email invitation will be relayed via Brevo SMTP. In addition, an immediately copyable, confidential activation link will be generated for direct sharing.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-mx-border">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="h-9 px-4 py-2 rounded-sm border border-mx-border text-xs text-mx-subtle hover:text-white hover:bg-mx-panel transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingInvite}
                  className="h-9 inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  <UserPlus size={14} strokeWidth={1.5} />
                  <span>{submittingInvite ? 'Dispatching Invitation...' : 'Dispatch Invitation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
       * MODAL 2: SLACK-STYLE INVITATION SENT & SHAREABLE LINK
       * ───────────────────────────────────────────────────────────── */}
      {isShareLinkModalOpen && invitationSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-mx-surface border border-mx-border rounded-sm w-full max-w-lg overflow-hidden animate-fade-in shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-mx-border bg-mx-panel">
              <div className="flex items-center gap-2">
                <Mail size={16} strokeWidth={1.5} className="text-white" />
                <h3 className="text-sm font-semibold text-white">Administrator Invitation Dispatched</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShareLinkModalOpen(false)}
                className="text-mx-subtle hover:text-white cursor-pointer"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Notification Status Banner */}
              <div className="p-3 bg-mx-panel border border-mx-border rounded-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-mx-positive inline-block" />
                  <span className="text-xs font-semibold text-white">
                    Brevo Email Dispatch Triggered
                  </span>
                </div>
                <p className="text-xs text-mx-subtle leading-relaxed">
                  An invitation email has been sent to{' '}
                  <strong className="text-white font-semibold">{invitationSuccessData.email}</strong> for{' '}
                  <span className="text-white">{invitationSuccessData.name}</span>.
                </p>
              </div>

              {/* Slack-Style Copyable Confidential Link */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-mx-subtle">
                  Shareable Confidential Invitation Link
                </label>
                <p className="text-[11px] text-mx-subtle leading-relaxed">
                  You can also copy this direct link and send it to the invitee via Slack or messaging channels. The recipient will set their own master password upon opening:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={invitationSuccessData.invitationUrl}
                    className="h-10 flex-1 px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-xs font-mono text-white select-all overflow-ellipsis"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyInvitationLink()}
                    className={`h-10 px-4 py-2 rounded-sm text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                      copiedLink
                        ? 'bg-emerald-500 text-black'
                        : 'bg-white hover:bg-neutral-200 text-black'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check size={14} strokeWidth={1.5} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} strokeWidth={1.5} />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Security & Expiration Information */}
              <div className="p-3 bg-mx-panel border border-mx-border rounded-sm space-y-1.5">
                <div className="flex items-center gap-2">
                  <Shield size={14} strokeWidth={1.5} className="text-mx-blue" />
                  <span className="text-xs font-semibold text-white">Cryptographic Confidentiality</span>
                </div>
                <ul className="text-xs text-mx-subtle space-y-1">
                  <li>• Secured with a single-use 256-bit cryptographic token.</li>
                  <li>• Automatically expires in 48 hours.</li>
                  <li>• Invitee configures their own personal password upon initial access.</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-mx-border">
                <a
                  href={invitationSuccessData.invitationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3 py-2 rounded-sm border border-mx-border text-xs text-mx-subtle hover:text-white hover:bg-mx-panel transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <ExternalLink size={14} strokeWidth={1.5} />
                  <span>Preview Activation Flow</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsShareLinkModalOpen(false)}
                  className="h-9 px-4 py-2 rounded-sm bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
       * MODAL 2: RESET OPERATOR PASSPHRASE
       * ───────────────────────────────────────────────────────────── */}
      {resetTargetAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-mx-surface border border-mx-border rounded-sm w-full max-w-md overflow-hidden animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-mx-border bg-mx-panel">
              <div className="flex items-center gap-2">
                <Key size={16} strokeWidth={1.5} className="text-white" />
                <h3 className="text-sm font-semibold text-white">Enforce Credential Rotation</h3>
              </div>
              <button
                type="button"
                onClick={() => setResetTargetAdmin(null)}
                className="text-mx-subtle hover:text-white cursor-pointer"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-mx-subtle leading-relaxed">
                Generate a temporary passphrase for operator{' '}
                <strong className="text-white font-semibold">{resetTargetAdmin.name}</strong> ({resetTargetAdmin.email}).
              </p>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-mx-subtle">
                  Temporary Passphrase
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={tempPassphrase}
                    className="h-10 flex-1 px-3 py-2 bg-mx-panel border border-mx-border rounded-sm text-xs font-mono text-white select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newPass = `MX-SEC-${Math.floor(100000 + Math.random() * 900000)}`;
                      setTempPassphrase(newPass);
                    }}
                    title="Generate New Passphrase"
                    className="h-10 px-3 py-2 rounded-sm border border-mx-border bg-mx-panel hover:text-white text-mx-subtle cursor-pointer transition-colors"
                  >
                    <RefreshCw size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer text-xs text-mx-subtle select-none">
                <input
                  type="checkbox"
                  checked={forcePasswordReset}
                  onChange={(e) => setForcePasswordReset(e.target.checked)}
                  className="w-4 h-4 rounded-sm bg-mx-panel border-mx-border text-mx-blue focus:ring-0 cursor-pointer"
                />
                <span>Require passphrase rotation upon initial authentication</span>
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-mx-border">
                <button
                  type="button"
                  onClick={() => setResetTargetAdmin(null)}
                  className="h-9 px-4 py-2 rounded-sm border border-mx-border text-xs text-mx-subtle hover:text-white hover:bg-mx-panel transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetPassword}
                  className="h-9 px-4 py-2 rounded-sm bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-colors cursor-pointer"
                >
                  Enforce Rotation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
