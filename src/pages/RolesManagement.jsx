import React, { useState, useEffect } from 'react';
import {
  FiShield,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiLayers,
  FiX,
  FiCheck,
  FiAlertTriangle,
  FiLock,
} from 'react-icons/fi';
import adminApi from '../services/adminApi';
import GranularPermissionBuilder from '../components/GranularPermissionBuilder';
import { toast } from 'react-toastify';

const RolesManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteConfirmRole, setDeleteConfirmRole] = useState(null);

  // Form State
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [platformScopes, setPlatformScopes] = useState(['global']);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getRoles();
      if (res.success) {
        setRoles(res.roles || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openCreateModal = () => {
    setEditingRole(null);
    setRoleName('');
    setRoleDescription('');
    setPlatformScopes(['global']);
    setSelectedPermissions([]);
    setModalOpen(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description || '');
    setPlatformScopes(role.platformScopes || ['global']);

    // Flatten role permissions if stored as objects
    const flattened = [];
    (role.permissions || []).forEach((p) => {
      if (typeof p === 'string') {
        flattened.push(p);
      } else if (p && p.platform && p.actions) {
        p.actions.forEach((act) => {
          flattened.push(`${p.platform}:${p.module}:${p.resource}:${act}`);
        });
      }
    });

    setSelectedPermissions(flattened);
    setModalOpen(true);
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.error('Role name is required');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: roleName.trim(),
        description: roleDescription.trim(),
        platformScopes,
        permissions: selectedPermissions,
      };

      if (editingRole) {
        const res = await adminApi.updateRole(editingRole._id, payload);
        if (res.success) {
          toast.success(`Role "${roleName}" updated successfully`);
          setModalOpen(false);
          fetchRoles();
        }
      } else {
        const res = await adminApi.createRole(payload);
        if (res.success) {
          toast.success(`Role "${roleName}" created successfully`);
          setModalOpen(false);
          fetchRoles();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!deleteConfirmRole) return;
    try {
      const res = await adminApi.deleteRole(deleteConfirmRole._id);
      if (res.success) {
        toast.success(`Role "${deleteConfirmRole.name}" deleted successfully`);
        setDeleteConfirmRole(null);
        fetchRoles();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete role');
    }
  };

  const togglePlatformScope = (platformId) => {
    setPlatformScopes((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Roles & Permissions
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Database
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Meta Business Manager-style Granular RBAC Engine across all MegaTrix platforms
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create Custom Role</span>
        </button>
      </div>

      {/* Role Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-white/40 text-xs">
          Loading roles from live MongoDB Atlas...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {roles.map((role) => {
            const isSuper = role.slug === 'superadmin';
            const permCount = role.permissions?.includes('*')
              ? 'Unrestricted (*)'
              : `${role.permissions?.length || 0} permissions`;

            return (
              <div
                key={role._id}
                className="bg-black/40 border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <FiShield className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          {role.name}
                          {role.isSystem && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70 font-mono flex items-center gap-1">
                              <FiLock className="w-2.5 h-2.5" /> SYSTEM
                            </span>
                          )}
                        </h3>
                        <p className="text-[11px] text-white/40 font-mono mt-0.5">
                          slug: {role.slug}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-white/60 line-clamp-2">
                    {role.description || 'No description provided.'}
                  </p>

                  {/* Scopes & Capability Metrics */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40 flex items-center gap-1.5">
                        <FiLayers className="w-3.5 h-3.5" /> Platform Scopes:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(role.platformScopes || []).map((scope) => (
                          <span
                            key={scope}
                            className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white/5 text-white/80 border border-white/10"
                          >
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40 flex items-center gap-1.5">
                        <FiUsers className="w-3.5 h-3.5" /> Assigned Users:
                      </span>
                      <span className="font-semibold text-white">
                        {role.userCount ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Capabilities:</span>
                      <span className="font-semibold text-emerald-400 font-mono text-[11px]">
                        {permCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(role)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <FiEdit2 className="w-3 h-3" />
                    <span>{role.isSystem ? 'View Policy' : 'Edit Policy'}</span>
                  </button>

                  {!role.isSystem && (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmRole(role)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                    >
                      <FiTrash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT ROLE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-mx-surface border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FiShield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingRole ? (editingRole.isSystem ? 'Inspect System Role' : 'Edit Custom Role') : 'Create New Custom Role'}
                  </h3>
                  <p className="text-xs text-white/50">
                    Define permissions and access boundaries for this role policy
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveRole} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Role Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={editingRole?.isSystem}
                    placeholder="e.g., Billing & Finance Auditor"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none disabled:opacity-50"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider">
                    Description
                  </label>
                  <input
                    type="text"
                    disabled={editingRole?.isSystem}
                    placeholder="Brief description of responsibilities"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Platform Scopes */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider">
                  Platform Scopes
                </label>
                <div className="flex flex-wrap gap-2">
                  {['global', 'bizmanager', 'schoolmanager'].map((plat) => {
                    const active = platformScopes.includes(plat);
                    return (
                      <button
                        key={plat}
                        type="button"
                        disabled={editingRole?.isSystem}
                        onClick={() => togglePlatformScope(plat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                          active
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20'
                        } disabled:opacity-50`}
                      >
                        {plat === 'global' ? 'Global Core' : plat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Granular Permission Builder */}
              <div className="pt-2 border-t border-white/10">
                <GranularPermissionBuilder
                  selectedPermissions={selectedPermissions}
                  onChange={setSelectedPermissions}
                  allowedPlatforms={platformScopes}
                  readOnly={editingRole?.isSystem}
                />
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Close
                </button>

                {!editingRole?.isSystem && (
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/10 transition-all disabled:opacity-50"
                  >
                    <FiCheck className="w-4 h-4" />
                    <span>{saving ? 'Saving Policy...' : 'Save Role Policy'}</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmRole && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-mx-surface border border-rose-500/20 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <FiAlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Delete Role Policy</h4>
                <p className="text-xs text-white/50">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Are you sure you want to permanently delete the custom role{' '}
              <strong className="text-white">"{deleteConfirmRole.name}"</strong>? Any users currently assigned to this role will lose its inherited permissions immediately.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmRole(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteRole}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesManagement;
