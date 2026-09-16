import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import adminApi from '../services/adminApi';
import AdminUsersManager from './UserManagement';
import {
  User,
  Shield,
  Key,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Globe,
  Save,
} from 'lucide-react';
import { toast } from 'react-toastify';

const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { adminUser, hasPermission } = useAdminAuth();

  const tabParam = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(tabParam);

  const canManageAdmins =
    adminUser?.isSuperAdmin || hasPermission('global.users.view');

  // Sync tab with URL query parameter
  useEffect(() => {
    const current = searchParams.get('tab') || 'profile';
    if (current === 'admins' && !canManageAdmins) {
      setActiveTab('profile');
      setSearchParams({ tab: 'profile' });
    } else {
      setActiveTab(current);
    }
  }, [searchParams, canManageAdmins, setSearchParams]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Profile Form State
  const [name, setName] = useState(adminUser?.name || '');
  const [phone, setPhone] = useState(adminUser?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      if (adminUser?._id) {
        await adminApi.updateUser(adminUser._id, { name, phone });
        toast.success('Administrator profile updated successfully.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    try {
      setUpdatingPassword(true);
      // Call update endpoint
      if (adminUser?._id) {
        await adminApi.updateUser(adminUser._id, { password: newPassword });
        toast.success('Security password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-mx-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-neutral-400">Governance</span>
            <span className="text-neutral-600">/</span>
            <span className="text-xs font-semibold text-mx-blue">Settings</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            System & Administrator Settings
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Configure administrator profile, cryptographic credentials, and multi-SaaS access policies.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-mx-surface border border-mx-border rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleTabChange('profile')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-black shadow-xs'
                : 'text-neutral-400 hover:text-white hover:bg-mx-elevated'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('security')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-black shadow-xs'
                : 'text-neutral-400 hover:text-white hover:bg-mx-elevated'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Security</span>
          </button>

          {canManageAdmins && (
            <button
              type="button"
              onClick={() => handleTabChange('admins')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'admins'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-neutral-400 hover:text-white hover:bg-mx-elevated'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Users</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-mx-blue/20 text-mx-blue">
                Superadmin
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ─── TAB 1: PROFILE ─── */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
          {/* Left Column: Account Details Card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-mx-surface border border-mx-border rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-mx-border">
                <div className="w-12 h-12 rounded-full bg-mx-elevated border border-mx-border flex items-center justify-center font-bold text-white text-lg">
                  {adminUser?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-white truncate">
                    {adminUser?.name || 'Administrator'}
                  </h2>
                  <p className="text-xs text-neutral-400 truncate">
                    {adminUser?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                    Assigned Role
                  </span>
                  <span className="text-neutral-200 font-semibold">
                    {adminUser?.isSuperAdmin ? 'Superadmin (Root Access)' : adminUser?.accessLevel || 'Administrator'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                    Platform Authorization Scope
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(adminUser?.platformScopes || ['global']).map((scope) => (
                      <span
                        key={scope}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-mx-elevated text-mx-blue border border-mx-border"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                    Account Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active & Authenticated</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleUpdateProfile}
              className="bg-mx-surface border border-mx-border rounded-xl p-6 space-y-5"
            >
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-mx-blue" />
                <span>Personal Profile Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-mx-elevated border border-mx-border focus:border-mx-blue rounded-lg text-xs text-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+92 300 0000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-mx-elevated border border-mx-border focus:border-mx-blue rounded-lg text-xs text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Registered Email Address (Immutable)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="email"
                    disabled
                    value={adminUser?.email || ''}
                    className="w-full pl-9 pr-4 py-2 bg-mx-elevated/40 border border-mx-border rounded-lg text-xs text-neutral-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-neutral-500">
                  Contact the primary root administrator to alter system-registered login emails.
                </p>
              </div>

              <div className="flex justify-end pt-3 border-t border-mx-border">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── TAB 2: SECURITY ─── */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-150">
          {/* Password Change Form */}
          <form
            onSubmit={handleChangePassword}
            className="bg-mx-surface border border-mx-border rounded-xl p-6 space-y-4"
          >
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-mx-blue" />
              <span>Change Security Password</span>
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Ensure your account password contains at least 8 characters, with letters and numbers.
            </p>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 bg-mx-elevated border border-mx-border focus:border-mx-blue rounded-lg text-xs text-white focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                required
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-mx-elevated border border-mx-border focus:border-mx-blue rounded-lg text-xs text-white focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-mx-elevated border border-mx-border focus:border-mx-blue rounded-lg text-xs text-white focus:outline-none transition-colors"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-mx-border">
              <button
                type="submit"
                disabled={updatingPassword}
                className="px-4 py-2 rounded-lg bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors cursor-pointer"
              >
                {updatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>

          {/* Active Session & Cryptographic Telemetry */}
          <div className="bg-mx-surface border border-mx-border rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-mx-blue" />
              <span>Authentication Session Telemetry</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-mx-elevated border border-mx-border space-y-1">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                  JWT Token Lifespan
                </span>
                <span className="font-mono text-neutral-200">
                  7-Day Cryptographic Bearer Token (SHA-256)
                </span>
              </div>

              <div className="p-3 rounded-lg bg-mx-elevated border border-mx-border space-y-1">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                  Current Session Device
                </span>
                <span className="text-neutral-200">
                  {navigator.userAgent}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-mx-elevated border border-mx-border space-y-1">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                  Immutable Audit Enactment
                </span>
                <span className="text-emerald-400 font-semibold">
                  All administrative mutations are signed and logged to MongoDB
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: ADMIN USERS (SUPERADMIN ONLY) ─── */}
      {activeTab === 'admins' && canManageAdmins && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-3 rounded-xl bg-mx-blue/10 border border-mx-blue/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-mx-blue">
              <Shield className="w-4 h-4 shrink-0" />
              <span className="font-semibold">
                Superadmin Command: Managing Core Administrators with Global RBAC
              </span>
            </div>
            <span className="text-[10px] text-neutral-400">
              Settings &bull; Admin Users
            </span>
          </div>

          {/* Embedded Full Administrator Management Interface */}
          <AdminUsersManager />
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
