import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  UserPlus,
  Shield,
  Layers,
  Search,
  Check,
  CheckSquare,
  Square,
  Send,
  Lock,
  Building,
  GraduationCap,
  ShoppingBag,
  Target,
  Mail,
  Sliders,
  Sparkles,
  Key,
  Info,
  ChevronRight,
  Globe,
  DollarSign,
  FileText,
  UserCheck,
  CheckCircle2,
  Zap,
  Activity,
  CreditCard,
  RotateCcw,
  Fingerprint,
} from 'lucide-react';
import { toast } from 'react-toastify';
import adminApi from '../services/adminApi';

/**
 * MegaTrix Canonical Platform Sub-Sections & Delegation Schema
 * Built for Core Admin Portal multi-project administrator onboarding.
 * Each platform workspace is partitioned into the canonical 5 core management sub-sections:
 * 1. User Management (Includes full CRUD + Direct Account Spoofing)
 * 2. Subscription Management (Plans, extensions, trial days, quotas, history)
 * 3. Reset Password (Credential rotation, temporary passphrase, forced change)
 * 4. User Activity (Real-time activity audit stream, IP forensics, login logs)
 * 5. Credentials (Project AES-256-GCM encrypted database secrets, API keys)
 *
 * Plus central Core Platform Governance (Portal Basic Functionalities).
 */
export const PROJECT_PERMISSION_SCHEMA = {
  schoolmanager: {
    id: 'schoolmanager',
    aliasId: 'schoolhub',
    name: 'School Manager',
    tagline: 'Institutional Multi-Campus School ERP',
    icon: GraduationCap,
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    accentColor: 'sky',
    subsections: [
      {
        id: 'users:directory',
        module: 'users',
        resource: 'directory',
        name: 'User Management',
        icon: UserCheck,
        description: 'Cross-school user directory, principal & teacher accounts, student profiles, and direct SSO impersonation',
        actions: ['view', 'create', 'edit', 'block', 'delete', 'spoof'],
        isUserManagement: true,
        hasSpoofing: true,
        specialNotice: 'Selecting User Management enables full administrative control including direct SSO account spoofing.',
      },
      {
        id: 'subscriptions:plans',
        module: 'subscriptions',
        resource: 'plans',
        name: 'Subscription Management',
        icon: CreditCard,
        description: 'Tiered institutional plans, trial day extensions, student quota allocations, and billing status',
        actions: ['view', 'assign', 'extend', 'modify', 'cancel'],
      },
      {
        id: 'passwords:reset',
        module: 'passwords',
        resource: 'reset',
        name: 'Reset Password',
        icon: RotateCcw,
        description: 'Institutional password resets, temporary recovery passphrase generation, and forced password changes',
        actions: ['view', 'rotate', 'generate_temp', 'force_change'],
      },
      {
        id: 'activity:stream',
        module: 'activity',
        resource: 'stream',
        name: 'User Activity',
        icon: Activity,
        description: 'Real-time activity audit stream, IP forensics, login history, and session tracking',
        actions: ['view', 'export', 'filter'],
      },
      {
        id: 'credentials:vault',
        module: 'credentials',
        resource: 'vault',
        name: 'Credentials Vault',
        icon: Key,
        description: 'Project AES-256-GCM encrypted database secrets, API tokens, and webhook keys',
        actions: ['view', 'reveal', 'manage'],
      },
    ],
  },

  bizmanager: {
    id: 'bizmanager',
    aliasId: 'bizmanager',
    name: 'Biz Manager',
    tagline: 'Retail POS, Barcode Billing & Khata Ledgers',
    icon: ShoppingBag,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    accentColor: 'emerald',
    subsections: [
      {
        id: 'users:directory',
        module: 'users',
        resource: 'directory',
        name: 'User Management',
        icon: UserCheck,
        description: 'Merchant user directory, store operator accounts, terminal access, and direct SSO spoofing',
        actions: ['view', 'create', 'edit', 'block', 'delete', 'spoof'],
        isUserManagement: true,
        hasSpoofing: true,
        specialNotice: 'Selecting User Management enables full administrative control including direct SSO account spoofing.',
      },
      {
        id: 'subscriptions:plans',
        module: 'subscriptions',
        resource: 'plans',
        name: 'Subscription Management',
        icon: CreditCard,
        description: 'Store subscription plans, POS terminal limits, trial day extensions, and billing lifecycle',
        actions: ['view', 'assign', 'extend', 'modify', 'cancel'],
      },
      {
        id: 'passwords:reset',
        module: 'passwords',
        resource: 'reset',
        name: 'Reset Password',
        icon: RotateCcw,
        description: 'Merchant password resets, PIN regeneration, and forced password changes',
        actions: ['view', 'rotate', 'generate_temp', 'force_change'],
      },
      {
        id: 'activity:stream',
        module: 'activity',
        resource: 'stream',
        name: 'User Activity',
        icon: Activity,
        description: 'Store transaction telemetry, POS checkout audit trails, and staff session tracking',
        actions: ['view', 'export', 'filter'],
      },
      {
        id: 'credentials:vault',
        module: 'credentials',
        resource: 'vault',
        name: 'Credentials Vault',
        icon: Key,
        description: 'Project AES-256-GCM cryptographic database credentials, POS API keys, and gateway secrets',
        actions: ['view', 'reveal', 'manage'],
      },
    ],
  },

  global: {
    id: 'global',
    aliasId: 'global',
    name: 'Core Admin Platform',
    tagline: 'Portal Basic Functionalities & Administrator Management',
    icon: Shield,
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    accentColor: 'purple',
    subsections: [
      {
        id: 'users:directory',
        module: 'users',
        resource: 'directory',
        name: 'Core Admin User Addition & Management',
        icon: UserPlus,
        description: 'Invite new platform administrators, manage identities, assign RBAC access, and suspend accounts',
        actions: ['view', 'create', 'edit', 'suspend', 'disable', 'export', 'assign_permissions'],
      },
      {
        id: 'accounts:overview',
        module: 'accounts',
        resource: 'overview',
        name: 'Global Accounts & Financial Center',
        icon: DollarSign,
        description: 'Global revenue ledger, operating expenses, cash flow, P&L statements, and multi-tenant reconciliation',
        actions: ['view', 'create', 'edit', 'delete', 'export', 'adjust', 'sync'],
      },
      {
        id: 'roles:role_matrix',
        module: 'roles',
        resource: 'role_matrix',
        name: 'Roles & Policy Matrix',
        icon: Layers,
        description: 'Author custom administrative roles, define permission boundaries, and govern RBAC schemas',
        actions: ['view', 'create', 'edit', 'delete'],
      },
      {
        id: 'audit:logs',
        module: 'audit',
        resource: 'logs',
        name: 'System Audit Trail & Compliance',
        icon: Fingerprint,
        description: 'Immutable cryptographic security audit logs, IP tracing, forensic session records, and export',
        actions: ['view', 'export'],
      },
      {
        id: 'settings:configuration',
        module: 'settings',
        resource: 'configuration',
        name: 'Global System Settings',
        icon: Sliders,
        description: 'Core system variables, OAuth/SSO configuration, API keys, and maintenance mode',
        actions: ['view', 'manage'],
      },
    ],
  },
};

const SYSTEM_ROLES = [
  { id: 'Platform Director', label: 'Platform Director', desc: 'Strategic executive oversight across designated platforms' },
  { id: 'Operations Lead', label: 'Operations Lead', desc: 'Day-to-day operations and tenant management' },
  { id: 'School Operations Lead', label: 'School Operations Lead', desc: 'Dedicated institutional governance for School Manager' },
  { id: 'POS Operations Lead', label: 'POS Operations Lead', desc: 'Retail store and inventory management for Biz Manager' },
  { id: 'Financial Auditor', label: 'Financial Auditor', desc: 'Accounts, challans, ledgers, and revenue auditing' },
  { id: 'Security Engineer', label: 'Security Engineer', desc: 'Authentication, access controls, and security audit logs' },
  { id: 'Regional Admin', label: 'Regional Admin', desc: 'Territory-scoped administrative coordination' },
];

/**
 * AddAdminUserModal
 * Multi-project administrator onboarding and granular RBAC policy delegation.
 */
const AddAdminUserModal = ({
  isOpen,
  onClose,
  onSuccess,
  editUser = null,
  availableRoles = [],
}) => {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [systemRole, setSystemRole] = useState('Platform Director');
  const [accessLevel, setAccessLevel] = useState('partial'); // 'full' | 'partial'
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [activeProjectTab, setActiveProjectTab] = useState('schoolmanager');
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Initialize or populate data on modal open / editUser change
  useEffect(() => {
    if (!isOpen) return;

    if (editUser) {
      setName(editUser.name || '');
      setEmail(editUser.email || '');
      setPhone(editUser.phone || '');
      setSystemRole(editUser.systemRole || editUser.role || 'Platform Director');
      setAccessLevel(editUser.accessLevel === 'full' ? 'full' : 'partial');

      // Populate roles
      const roleIds = (editUser.roles || []).map((r) => (typeof r === 'object' ? r._id : r));
      setAssignedRoles(roleIds);

      // Populate permissions set
      const permSet = new Set();
      if (editUser.accessLevel === 'full' || (editUser.permissions || []).includes('*')) {
        permSet.add('*');
      } else {
        (editUser.permissions || []).forEach((p) => {
          if (typeof p === 'string') {
            permSet.add(p);
          } else if (p && p.platform && p.actions) {
            p.actions.forEach((act) => {
              permSet.add(`${p.platform}:${p.module || 'core'}:${p.resource || 'item'}:${act}`);
            });
          }
        });
      }
      setSelectedPermissions(permSet);
    } else {
      // Clean default state for new invitation
      setName('');
      setEmail('');
      setPhone('');
      setSystemRole('Platform Director');
      setAccessLevel('partial');
      setAssignedRoles([]);

      // Pre-seed convenient starter permissions for School Manager & Biz Manager
      const defaultSet = new Set([
        'schoolmanager:users:directory:view',
        'schoolmanager:users:directory:create',
        'schoolmanager:users:directory:edit',
        'schoolmanager:users:directory:block',
        'schoolmanager:users:directory:delete',
        'schoolmanager:users:directory:spoof',
        'schoolmanager:subscriptions:plans:view',
        'schoolmanager:activity:stream:view',
        'bizmanager:users:directory:view',
        'bizmanager:users:directory:create',
        'bizmanager:users:directory:edit',
        'bizmanager:users:directory:block',
        'bizmanager:users:directory:delete',
        'bizmanager:users:directory:spoof',
        'bizmanager:subscriptions:plans:view',
        'bizmanager:activity:stream:view',
      ]);
      setSelectedPermissions(defaultSet);
    }
  }, [isOpen, editUser]);

  // Total permission count calculations per project
  const projectStats = useMemo(() => {
    const stats = {};
    Object.values(PROJECT_PERMISSION_SCHEMA).forEach((proj) => {
      let total = 0;
      let selected = 0;
      proj.subsections.forEach((sub) => {
        sub.actions.forEach((act) => {
          total++;
          const key = `${proj.id}:${sub.module}:${sub.resource}:${act}`;
          if (selectedPermissions.has(key) || selectedPermissions.has('*')) {
            selected++;
          }
        });
      });
      stats[proj.id] = { total, selected, isEnabled: selected > 0 || selectedPermissions.has('*') };
    });
    return stats;
  }, [selectedPermissions]);

  // Overall selected count
  const totalSelectedCount = useMemo(() => {
    if (selectedPermissions.has('*')) return 'Unrestricted (Full Root Authority)';
    return selectedPermissions.size;
  }, [selectedPermissions]);

  // Toggle single action permission
  const toggleAction = (projId, module, resource, action) => {
    const key = `${projId}:${module}:${resource}:${action}`;
    const next = new Set(selectedPermissions);

    if (next.has('*')) {
      next.delete('*');
    }

    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setSelectedPermissions(next);
  };

  // Toggle all actions inside a subsection
  // Note: For User Management, toggling on automatically enables all operations including spoofing!
  const toggleSubsection = (projId, subsection) => {
    const keys = subsection.actions.map(
      (act) => `${projId}:${subsection.module}:${subsection.resource}:${act}`
    );
    const allSelected = keys.every((k) => selectedPermissions.has(k) || selectedPermissions.has('*'));
    const next = new Set(selectedPermissions);
    next.delete('*');

    if (allSelected) {
      keys.forEach((k) => next.delete(k));
    } else {
      keys.forEach((k) => next.add(k));
    }
    setSelectedPermissions(next);
  };

  // Bulk project preset selector
  const applyProjectPreset = (projId, preset) => {
    const proj = PROJECT_PERMISSION_SCHEMA[projId];
    if (!proj) return;

    const next = new Set(selectedPermissions);
    next.delete('*');

    const allKeys = [];
    const readKeys = [];
    const managerKeys = [];

    proj.subsections.forEach((sub) => {
      sub.actions.forEach((act) => {
        const key = `${proj.id}:${sub.module}:${sub.resource}:${act}`;
        allKeys.push(key);
        if (act === 'view' || act === 'export' || act === 'filter') {
          readKeys.push(key);
        }
        // Manager preset grants all operational actions including spoofing, resets, and plan modifications
        if (act !== 'delete' && act !== 'disable') {
          managerKeys.push(key);
        }
      });
    });

    // Clear all for this project first
    allKeys.forEach((k) => next.delete(k));

    if (preset === 'all') {
      allKeys.forEach((k) => next.add(k));
    } else if (preset === 'manager') {
      managerKeys.forEach((k) => next.add(k));
    } else if (preset === 'readonly') {
      readKeys.forEach((k) => next.add(k));
    }

    setSelectedPermissions(next);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error('Legal Name and Corporate Email are required.');
      return;
    }

    // Determine authorized platform scopes based on selected permissions
    const derivedPlatformScopes = [];
    Object.entries(projectStats).forEach(([projId, data]) => {
      if (data.selected > 0 || accessLevel === 'full') {
        derivedPlatformScopes.push(projId);
        // Add alias ID if exists (e.g. schoolhub for schoolmanager)
        const projConfig = PROJECT_PERMISSION_SCHEMA[projId];
        if (projConfig?.aliasId && !derivedPlatformScopes.includes(projConfig.aliasId)) {
          derivedPlatformScopes.push(projConfig.aliasId);
        }
      }
    });

    if (accessLevel === 'full' || derivedPlatformScopes.length === 0) {
      derivedPlatformScopes.push('global');
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      systemRole,
      accessLevel,
      platformScopes: derivedPlatformScopes,
      roles: assignedRoles,
      permissions: accessLevel === 'full' ? ['*'] : Array.from(selectedPermissions),
    };

    setSubmitting(true);
    try {
      if (editUser && editUser._id) {
        // Edit Mode
        const res = await adminApi.updateUser(editUser._id, payload);
        if (res?.success) {
          toast.success(`Administrator policy for ${name} updated successfully!`);
          onSuccess && onSuccess({ user: res.user, isEdit: true });
          onClose();
        } else {
          toast.error(res?.message || 'Failed to update administrator policy.');
        }
      } else {
        // Invite Mode
        const res = await adminApi.inviteUser(payload);
        if (res?.success) {
          toast.success(`Invitation dispatched to ${payload.email} via Brevo!`);
          onSuccess &&
            onSuccess({
              name: payload.name,
              email: payload.email,
              invitationUrl: res.invitationUrl,
              accessLevel: payload.accessLevel,
              isEdit: false,
            });
          onClose();
        } else {
          toast.error(res?.message || 'Failed to dispatch invitation.');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Operation failed.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentProject = PROJECT_PERMISSION_SCHEMA[activeProjectTab] || PROJECT_PERMISSION_SCHEMA.schoolmanager;
  const CurrentProjectIcon = currentProject.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden animate-fade-in">
      <div className="bg-mx-surface border border-mx-border rounded-sm w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* ── MODAL HEADER ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-mx-border bg-mx-panel flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-white/10 border border-white/20 flex items-center justify-center text-white">
              {editUser ? <Sliders size={18} strokeWidth={1.5} /> : <UserPlus size={18} strokeWidth={1.5} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  {editUser ? 'Modify Administrator Policy & Capabilities' : 'Add / Invite Platform Administrator'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-mx-blue/10 text-mx-blue border border-mx-blue/20 uppercase">
                  Granular RBAC Delegation
                </span>
              </div>
              <p className="text-xs text-mx-subtle">
                Configure legal identity, system role tier, and granular multi-project sub-section permissions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-mx-subtle hover:text-white p-1 rounded-sm hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── MODAL BODY (SCROLLABLE) ── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECTION 1: IDENTITY & SYSTEM ROLE */}
          <div className="space-y-4 bg-mx-panel border border-mx-border rounded-sm p-5">
            <div className="flex items-center justify-between pb-2 border-b border-mx-border">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <UserCheck size={14} className="text-mx-blue" />
                1. Identity & System Role
              </span>
              <span className="text-[11px] text-mx-subtle">Primary credentials for platform administrative access</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-mx-subtle">
                  Full Legal Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asim Raza"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 w-full px-3 py-2 bg-mx-surface border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-mx-subtle">
                  Corporate Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  disabled={Boolean(editUser)}
                  placeholder="admin@megatrix.tech"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full px-3 py-2 bg-mx-surface border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors font-mono disabled:opacity-60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-mx-subtle">
                  Direct Phone / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 w-full px-3 py-2 bg-mx-surface border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-mx-subtle">
                  System Job Title / Executive Tier
                </label>
                <select
                  value={systemRole}
                  onChange={(e) => setSystemRole(e.target.value)}
                  className="h-10 w-full px-3 py-2 bg-mx-surface border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors cursor-pointer"
                >
                  {SYSTEM_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label} — {r.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-mx-subtle">
                  Attach Preset RBAC Role
                </label>
                <select
                  value={assignedRoles[0] || ''}
                  onChange={(e) => setAssignedRoles(e.target.value ? [e.target.value] : [])}
                  className="h-10 w-full px-3 py-2 bg-mx-surface border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="">No Role Override (Custom Granular Matrix)</option>
                  {availableRoles.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name} ({r.slug})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: AUTHORITY LEVEL SELECTION (PARTIAL VS FULL) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Lock size={14} className="text-mx-blue" />
              2. Administrative Access Authority Tier
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Partial Access */}
              <div
                onClick={() => setAccessLevel('partial')}
                className={`p-4 rounded-sm border cursor-pointer transition-all ${
                  accessLevel === 'partial'
                    ? 'bg-mx-blue/10 border-mx-blue text-white shadow-lg shadow-mx-blue/5'
                    : 'bg-mx-panel border-mx-border text-mx-subtle hover:border-mx-border2 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders size={16} className={accessLevel === 'partial' ? 'text-mx-blue' : 'text-mx-subtle'} />
                    <p className="font-bold text-xs text-white">Partial Access (Granular Project Scopes)</p>
                  </div>
                  {accessLevel === 'partial' && <CheckCircle2 size={16} className="text-mx-blue" />}
                </div>
                <p className="text-[11px] text-mx-subtle mt-1.5 leading-relaxed">
                  Recommended. Selectively assign project boundaries and configure individual sub-sections (User Management, Subscriptions, Passwords, Activity, Credentials).
                </p>
              </div>

              {/* Option 2: Full Access (Global Administrator) */}
              <div
                onClick={() => setAccessLevel('full')}
                className={`p-4 rounded-sm border cursor-pointer transition-all ${
                  accessLevel === 'full'
                    ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/5'
                    : 'bg-mx-panel border-mx-border text-mx-subtle hover:border-mx-border2 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className={accessLevel === 'full' ? 'text-emerald-400' : 'text-mx-subtle'} />
                    <p className="font-bold text-xs text-white">Full Access (Global Executive Administrator)</p>
                  </div>
                  {accessLevel === 'full' && <CheckCircle2 size={16} className="text-emerald-400" />}
                </div>
                <p className="text-[11px] text-mx-subtle mt-1.5 leading-relaxed">
                  Unrestricted global root authority across all platforms, user management, account spoofing, billing systems, and cryptographic vaults.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: PROJECT-BY-PROJECT GRANULAR SUB-SECTIONS (When Partial Access is selected) */}
          {accessLevel === 'partial' ? (
            <div className="space-y-4 bg-mx-panel border border-mx-border rounded-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-mx-border">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers size={14} className="text-mx-blue" />
                    3. Project Access & Sub-Section Selectors
                  </span>
                  <p className="text-[11px] text-mx-subtle mt-0.5">
                    Select a project to configure its 5 administrative sub-sections and granular action selectors
                  </p>
                </div>

                {/* Filter Search */}
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mx-subtle" />
                  <input
                    type="text"
                    placeholder="Filter sub-sections / actions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-mx-surface border border-mx-border rounded-sm text-xs text-white placeholder-mx-subtle focus:outline-none focus:border-mx-blue"
                  />
                </div>
              </div>

              {/* PROJECT TABS LIST */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-mx-border">
                {Object.values(PROJECT_PERMISSION_SCHEMA).map((proj) => {
                  const Icon = proj.icon;
                  const isActive = activeProjectTab === proj.id;
                  const stats = projectStats[proj.id];
                  const hasSelection = stats?.selected > 0;

                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => setActiveProjectTab(proj.id)}
                      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-sm text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-black font-semibold shadow-md'
                          : hasSelection
                          ? 'bg-mx-surface text-white border border-mx-border2 hover:border-white/30'
                          : 'bg-mx-surface/50 text-mx-subtle border border-mx-border hover:text-white'
                      }`}
                    >
                      <Icon size={14} className={isActive ? 'text-black' : hasSelection ? 'text-emerald-400' : 'text-mx-subtle'} />
                      <span>{proj.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive
                            ? 'bg-black/15 text-black'
                            : hasSelection
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-white/5 text-mx-subtle'
                        }`}
                      >
                        {stats?.selected || 0}/{stats?.total || 0}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ACTIVE PROJECT CONFIGURATION PANEL */}
              <div className="space-y-4 pt-2">
                {/* Project Header Bar & Quick Presets */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-mx-surface border border-mx-border rounded-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white">
                      <CurrentProjectIcon size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{currentProject.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${currentProject.badgeColor}`}>
                          {currentProject.tagline}
                        </span>
                      </div>
                      <p className="text-[11px] text-mx-subtle">
                        {projectStats[currentProject.id]?.selected} of {projectStats[currentProject.id]?.total} capabilities assigned
                      </p>
                    </div>
                  </div>

                  {/* Preset Action Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => applyProjectPreset(currentProject.id, 'all')}
                      className="px-2.5 py-1 rounded-sm text-[11px] font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all cursor-pointer"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => applyProjectPreset(currentProject.id, 'manager')}
                      className="px-2.5 py-1 rounded-sm text-[11px] font-medium bg-mx-blue/10 text-mx-blue hover:bg-mx-blue/20 border border-mx-blue/20 transition-all cursor-pointer"
                    >
                      Manager / Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => applyProjectPreset(currentProject.id, 'readonly')}
                      className="px-2.5 py-1 rounded-sm text-[11px] font-medium bg-white/5 text-mx-subtle hover:text-white hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                    >
                      Read Only
                    </button>
                    <button
                      type="button"
                      onClick={() => applyProjectPreset(currentProject.id, 'clear')}
                      className="px-2.5 py-1 rounded-sm text-[11px] font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* SUB-SECTIONS GRID WITH ACTION SELECTORS */}
                <div className="space-y-3">
                  {currentProject.subsections.map((sub) => {
                    const SubIcon = sub.icon || Layers;
                    const subKeys = sub.actions.map(
                      (act) => `${currentProject.id}:${sub.module}:${sub.resource}:${act}`
                    );
                    const allSubSelected = subKeys.every(
                      (k) => selectedPermissions.has(k) || selectedPermissions.has('*')
                    );
                    const selectedCount = subKeys.filter(
                      (k) => selectedPermissions.has(k) || selectedPermissions.has('*')
                    ).length;

                    const hasSpoofAction = sub.actions.includes('spoof');
                    const isSpoofGranted =
                      selectedPermissions.has(`${currentProject.id}:${sub.module}:${sub.resource}:spoof`) ||
                      selectedPermissions.has('*');

                    // Search Query Filter
                    if (searchQuery.trim()) {
                      const q = searchQuery.toLowerCase();
                      const matches =
                        sub.name.toLowerCase().includes(q) ||
                        sub.description.toLowerCase().includes(q) ||
                        sub.actions.some((act) => act.toLowerCase().includes(q));
                      if (!matches) return null;
                    }

                    return (
                      <div
                        key={sub.id}
                        className={`p-4 bg-mx-surface border rounded-sm space-y-3 transition-colors ${
                          allSubSelected
                            ? 'border-mx-blue/40 shadow-sm'
                            : selectedCount > 0
                            ? 'border-mx-border2'
                            : 'border-mx-border'
                        }`}
                      >
                        {/* Subsection Title, Badges & Select All Toggle */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-mx-border/50">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <SubIcon size={15} className={selectedCount > 0 ? 'text-mx-blue' : 'text-mx-subtle'} />
                              <span className="text-xs font-semibold text-white">{sub.name}</span>
                              <span className="text-[10px] text-mx-subtle font-mono">
                                ({selectedCount}/{sub.actions.length} selected)
                              </span>

                              {/* Special Spoofing Indicator on User Management */}
                              {sub.isUserManagement && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                  <Zap size={10} className="text-amber-400" />
                                  Includes SSO Spoofing
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-mx-subtle leading-relaxed">{sub.description}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleSubsection(currentProject.id, sub)}
                            className="text-[11px] text-mx-blue hover:text-blue-300 font-medium px-2.5 py-1 rounded-sm hover:bg-mx-blue/10 border border-transparent hover:border-mx-blue/20 transition-all cursor-pointer self-start sm:self-center whitespace-nowrap"
                          >
                            {allSubSelected ? 'Clear Subsection' : 'Select All'}
                          </button>
                        </div>

                        {/* Special Notice for User Management */}
                        {sub.specialNotice && (
                          <div className="px-3 py-1.5 rounded-sm bg-amber-500/5 border border-amber-500/15 flex items-center justify-between text-[11px] text-amber-200/90">
                            <span className="flex items-center gap-1.5">
                              <Info size={13} className="text-amber-400 flex-shrink-0" />
                              {sub.specialNotice}
                            </span>
                            {isSpoofGranted && (
                              <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                SPOOFING ACTIVE
                              </span>
                            )}
                          </div>
                        )}

                        {/* Granular Action Chips */}
                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {sub.actions.map((act) => {
                            const key = `${currentProject.id}:${sub.module}:${sub.resource}:${act}`;
                            const isGranted = selectedPermissions.has(key) || selectedPermissions.has('*');
                            const isSpoof = act === 'spoof';

                            return (
                              <button
                                key={act}
                                type="button"
                                onClick={() => toggleAction(currentProject.id, sub.module, sub.resource, act)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-all cursor-pointer ${
                                  isGranted
                                    ? isSpoof
                                      ? 'bg-amber-400 text-black font-semibold shadow-sm ring-1 ring-amber-300'
                                      : 'bg-white text-black font-semibold shadow-sm'
                                    : 'bg-mx-panel text-mx-subtle border border-mx-border hover:border-mx-border2 hover:text-white'
                                }`}
                              >
                                {isGranted ? (
                                  <Check size={12} strokeWidth={2.5} className="text-black" />
                                ) : (
                                  <Square size={12} strokeWidth={1.5} className="text-mx-subtle" />
                                )}
                                <span className="capitalize">
                                  {isSpoof ? 'Account Spoofing (SSO)' : act.replace('_', ' ')}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Full Access Callout */
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-sm flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Full Executive Global Administrator</h4>
                <p className="text-xs text-mx-subtle leading-relaxed">
                  This user will inherit full, unrestricted root authority (<code className="text-emerald-400 font-mono">*</code>) across School Manager, Biz Manager, central Accounts Command Center, and all system vaults.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 4: INVITATION DISPATCH INFORMATION */}
          <div className="p-4 bg-mx-panel border border-mx-border rounded-sm flex items-start gap-3">
            <Mail className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-white block">Automated Email Dispatch:</span>
              <p className="text-xs text-mx-subtle leading-relaxed">
                An invitation email will be dispatched to the recipient inbox via Brevo SMTP relay. A direct activation link will also be provided immediately upon creation for manual sharing.
              </p>
            </div>
          </div>

          {/* ── MODAL FOOTER ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-mx-border">
            {/* Live Capability Counter Pill */}
            <div className="flex items-center gap-2 text-xs text-mx-subtle">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Granted: </span>
              <strong className="text-white font-mono">{totalSelectedCount}</strong>
              {accessLevel === 'partial' && (
                <span>
                  across{' '}
                  <strong className="text-white font-mono">
                    {Object.values(projectStats).filter((s) => s.selected > 0).length}
                  </strong>{' '}
                  projects
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 self-end">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-4 py-2 rounded-sm border border-mx-border text-xs text-mx-subtle hover:text-white hover:bg-mx-panel transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="h-9 inline-flex items-center gap-2 px-5 py-2 rounded-sm bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-lg shadow-white/5 transition-all cursor-pointer disabled:opacity-50"
              >
                {editUser ? <Sliders size={14} /> : <Send size={14} />}
                <span>
                  {submitting
                    ? editUser
                      ? 'Saving Policy...'
                      : 'Dispatching Invitation...'
                    : editUser
                    ? 'Save Administrator Policy'
                    : 'Dispatch Invitation'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminUserModal;
