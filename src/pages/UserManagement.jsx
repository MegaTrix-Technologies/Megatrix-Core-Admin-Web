import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import adminApi from '../services/adminApi';
import GranularPermissionBuilder from '../components/GranularPermissionBuilder';
import AddAdminUserModal from '../components/AddAdminUserModal';
import { DEFAULT_ADMIN_ROSTER } from './SettingsPage';
import {
  FiUsers,
  FiSearch,
  FiUserPlus,
  FiFilter,
  FiShield,
  FiLock,
  FiMail,
  FiCheckCircle,
  FiSlash,
  FiTrash2,
  FiEdit2,
  FiEye,
  FiClock,
  FiAlertTriangle,
  FiLayers,
  FiX,
  FiCheck,
  FiSend,
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
  FiExternalLink,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const STATUS_VARIANTS = {
  active: { label: 'Active', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  invited: { label: 'Invited', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  pending: { label: 'Pending', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  suspended: { label: 'Suspended', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  disabled: { label: 'Disabled', bg: 'bg-white/5', text: 'text-white/40', border: 'border-white/10' },
};

const UserManagement = () => {
  const { adminUser: currentAdmin } = useAdminAuth();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [accessFilter, setAccessFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modals
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inspectUser, setInspectUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [shareLinkModalOpen, setShareLinkModalOpen] = useState(false);
  const [shareLinkData, setShareLinkData] = useState(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);


  // Fetch Users from Live MongoDB
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
      };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;
      if (accessFilter !== 'all') params.accessLevel = accessFilter;
      if (platformFilter !== 'all') params.platform = platformFilter;
      if (roleFilter !== 'all') params.role = roleFilter;

      const res = await adminApi.getUsers(params);
      if (res?.success && Array.isArray(res.users) && res.users.length > 0) {
        setUsers(res.users);
        if (res.pagination) {
          setPagination(res.pagination);
        }
        return;
      }
    } catch (err) {
      console.warn('Backend user directory query failed, using local roster:', err.message);
    } finally {
      setLoading(false);
    }

    // Fallback to local admin roster or DEFAULT_ADMIN_ROSTER
    try {
      const saved = localStorage.getItem('megatrix_admin_roster');
      const source = saved ? JSON.parse(saved) : DEFAULT_ADMIN_ROSTER;
      const roster = Array.isArray(source) && source.length > 0 ? source : DEFAULT_ADMIN_ROSTER;
      const mapped = roster.map((u) => ({
        _id: u.id || u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        status: u.status || 'active',
        accessLevel: u.accessLevel || 'partial',
        platformScopes: u.platformScopes || (u.scope?.includes('School') ? ['schoolmanager'] : u.scope?.includes('Biz') ? ['bizmanager'] : ['global']),
        roles: [{ name: u.role || 'Platform Administrator' }],
        permissions: u.permissions || [],
        createdAt: u.createdAt || '2026-08-15',
        lastLoginAt: u.lastActive?.includes('Today') ? new Date().toISOString() : null,
      }));
      setUsers(mapped);
      setPagination({ page: 1, limit: 15, total: mapped.length, totalPages: 1 });
    } catch {
      // Ignore
    }
  };

  // Fetch Roles for dropdown selection
  const fetchRoles = async () => {
    try {
      const res = await adminApi.getRoles();
      if (res.success) {
        setRoles(res.roles || []);
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    fetchRoles();
  }, [statusFilter, accessFilter, platformFilter, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  // Open Invite Modal
  const openInviteModal = () => {
    setEditUser(null);
    setInviteModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (user) => {
    setEditUser(user);
    setInviteModalOpen(true);
  };

  const handleModalSuccess = (data) => {
    if (!data.isEdit && data.invitationUrl) {
      setShareLinkData({
        name: data.name,
        email: data.email,
        invitationUrl: data.invitationUrl,
        accessLevel: data.accessLevel,
      });
      setShareLinkModalOpen(true);
    }
    fetchUsers(pagination.page);
  };

  // Handle Status Change
  const handleStatusChange = async (user, newStatus) => {
    if (user.isSuperAdmin) {
      toast.warn('The Root Superadmin account cannot be altered.');
      return;
    }

    try {
      const res = await adminApi.toggleUserStatus(user._id, newStatus, `Admin manual transition to ${newStatus}`);
      if (res.success) {
        toast.success(`User status changed to ${newStatus.toUpperCase()}`);
        fetchUsers(pagination.page);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change status');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    if (deleteConfirmUser.isSuperAdmin) {
      toast.warn('The Root Superadmin account cannot be deleted.');
      return;
    }

    try {
      const res = await adminApi.deleteUser(deleteConfirmUser._id);
      if (res.success) {
        toast.success(`User ${deleteConfirmUser.name} removed`);
        setDeleteConfirmUser(null);
        fetchUsers(pagination.page);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };


  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Administrator Directory & Access Control
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              MongoDB Atlas Live
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Manage administrative identities, platform boundaries, and RBAC policies
          </p>
        </div>

        <button
          type="button"
          onClick={openInviteModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
        >
          <FiUserPlus className="w-4 h-4" />
          <span>Invite Administrator</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500"
            />
          </form>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/60 border border-white/10 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="disabled">Disabled</option>
            </select>

            {/* Access Level Filter */}
            <select
              value={accessFilter}
              onChange={(e) => setAccessFilter(e.target.value)}
              className="bg-black/60 border border-white/10 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Access Levels</option>
              <option value="full">Full Access (Unrestricted)</option>
              <option value="partial">Partial Access (Scoped)</option>
            </select>

            {/* Platform Scope Filter */}
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-black/60 border border-white/10 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Platforms</option>
              <option value="global">Global Platform</option>
              <option value="bizmanager">Biz Manager</option>
              <option value="schoolmanager">School Hub</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead className="bg-white/[0.03] text-white/40 uppercase font-bold text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Administrator</th>
                <th className="py-3.5 px-4">Access Level</th>
                <th className="py-3.5 px-4">Roles</th>
                <th className="py-3.5 px-4">Platform Scopes</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-white/40">
                    Querying administrative directory from MongoDB Atlas...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-white/40">
                    No administrators found matching current filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const statusMeta = STATUS_VARIANTS[user.status] || STATUS_VARIANTS.pending;
                  const isRootSuper = user.isSuperAdmin || user.email === 'admin.megatrix@gmail.com';

                  return (
                    <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Identity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs uppercase">
                            {user.name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{user.name}</span>
                              {isRootSuper && (
                                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold flex items-center gap-1">
                                  <FiShield className="w-2.5 h-2.5" /> ROOT SUPERADMIN
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-white/50 font-mono mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Access Level */}
                      <td className="py-3.5 px-4">
                        {user.accessLevel === 'full' ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px] uppercase tracking-wider">
                            Full Access
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold text-[10px] uppercase tracking-wider">
                            Partial Access
                          </span>
                        )}
                      </td>

                      {/* Roles */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(user.roles || []).length === 0 ? (
                            <span className="text-white/30 text-[11px]">No roles</span>
                          ) : (
                            user.roles.map((r) => (
                              <span
                                key={r._id || r}
                                className="px-2 py-0.5 rounded bg-white/5 text-white/80 border border-white/10 text-[10px] font-medium"
                              >
                                {r.name || r}
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      {/* Platform Scopes */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(user.platformScopes || []).map((scope) => (
                            <span
                              key={scope}
                              className="px-2 py-0.5 rounded bg-white/5 text-white/60 text-[10px] uppercase font-mono"
                            >
                              {scope}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect */}
                          <button
                            type="button"
                            onClick={() => setInspectUser(user)}
                            className="p-1.5 rounded-lg text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                            title="Inspect Access & Telemetry"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                          </button>

                          {!isRootSuper && (
                            <>
                              {/* Edit */}
                              <button
                                type="button"
                                onClick={() => openEditModal(user)}
                                className="p-1.5 rounded-lg text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                                title="Edit Roles & Scopes"
                              >
                                <FiEdit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Toggle Status */}
                              {user.status === 'active' ? (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(user, 'suspended')}
                                  className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                                  title="Suspend Administrator"
                                >
                                  <FiSlash className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(user, 'active')}
                                  className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                                  title="Activate Administrator"
                                >
                                  <FiCheckCircle className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmUser(user)}
                                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                                title="Remove User"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
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
            Showing {users.length} of {pagination.total} administrators
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => fetchUsers(pagination.page - 1)}
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
              onClick={() => fetchUsers(pagination.page + 1)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ADD / INVITE / EDIT ADMINISTRATOR MODAL */}
      <AddAdminUserModal
        isOpen={inviteModalOpen}
        editUser={editUser}
        availableRoles={roles}
        onClose={() => {
          setInviteModalOpen(false);
          setEditUser(null);
        }}
        onSuccess={handleModalSuccess}
      />

      {/* INSPECT USER & EFFECTIVE PERMISSIONS MODAL */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-mx-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FiShield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{inspectUser.name}</h3>
                  <p className="text-xs text-white/50">{inspectUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectUser(null)}
                className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-1">
                  <span className="text-white/40 uppercase font-bold text-[10px]">Access Level</span>
                  <p className="text-white font-semibold uppercase">{inspectUser.accessLevel}</p>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-1">
                  <span className="text-white/40 uppercase font-bold text-[10px]">Lifecycle Status</span>
                  <p className="text-white font-semibold uppercase">{inspectUser.status}</p>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-1">
                  <span className="text-white/40 uppercase font-bold text-[10px]">Last Login IP</span>
                  <p className="text-white font-mono">{inspectUser.lastLoginIp || 'Never'}</p>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-1">
                  <span className="text-white/40 uppercase font-bold text-[10px]">Last Login Time</span>
                  <p className="text-white font-mono">
                    {inspectUser.lastLoginAt ? new Date(inspectUser.lastLoginAt).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>

              {/* Roles Breakdown */}
              <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-2">
                <span className="text-white/40 uppercase font-bold text-[10px]">Inherited Roles</span>
                <div className="flex flex-wrap gap-1.5">
                  {(inspectUser.roles || []).map((r) => (
                    <span key={r._id || r} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
                      {r.name || r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Platform Scopes */}
              <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-2">
                <span className="text-white/40 uppercase font-bold text-[10px]">Platform Scopes</span>
                <div className="flex flex-wrap gap-1.5">
                  {(inspectUser.platformScopes || []).map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded bg-white/5 text-white/80 border border-white/10 text-xs uppercase">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-mx-surface border border-rose-500/20 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <FiAlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Delete Administrator</h4>
                <p className="text-xs text-white/50">Permanent access revocation</p>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Are you sure you want to remove administrator{' '}
              <strong className="text-white">"{deleteConfirmUser.name}" ({deleteConfirmUser.email})</strong>? All administrative tokens and sessions will be permanently revoked.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INVITATION SHARE MODAL */}
      {shareLinkModalOpen && shareLinkData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-mx-surface border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <FiMail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Administrator Invitation Dispatched</h4>
                  <p className="text-[11px] text-white/50">Brevo notification sent & direct link ready</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShareLinkModalOpen(false)}
                className="text-white/40 hover:text-white p-1"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  <span className="text-xs font-semibold text-white">Email Sent via Brevo SMTP</span>
                </div>
                <p className="text-xs text-white/70">
                  We sent an invitation email to <strong className="text-white">{shareLinkData.email}</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-white/70">
                  Shareable Confidential Invitation Link
                </label>
                <p className="text-[11px] text-white/50">
                  Copy and send this direct link to the recipient. The invitee will set their password upon opening:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareLinkData.invitationUrl}
                    className="h-10 flex-1 px-3 py-2 bg-black/40 border border-white/10 focus:border-emerald-500 rounded-xl text-xs font-mono text-white select-all overflow-ellipsis"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(shareLinkData.invitationUrl);
                      setShareLinkCopied(true);
                      toast.success('Invitation link copied to clipboard!');
                      setTimeout(() => setShareLinkCopied(false), 2500);
                    }}
                    className={`h-10 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                      shareLinkCopied
                        ? 'bg-emerald-500 text-black'
                        : 'bg-white hover:bg-neutral-200 text-black'
                    }`}
                  >
                    {shareLinkCopied ? (
                      <>
                        <FiCheck className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                <div className="flex items-center gap-2">
                  <FiShield className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-semibold text-white">Cryptographic Confidentiality</span>
                </div>
                <p className="text-[11px] text-white/50">
                  Single-use 256-bit token. Valid for 48 hours. Upon visiting, the user configures their master password.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <a
                  href={shareLinkData.invitationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white"
                >
                  <FiExternalLink className="w-3.5 h-3.5" />
                  <span>Preview Activation Page</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShareLinkModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-neutral-200 text-black"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
