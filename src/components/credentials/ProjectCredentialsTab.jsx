import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminApi from '../../services/adminApi';
import {
  Key,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Plus,
  RefreshCw,
  Trash2,
  Edit2,
  Shield,
  ShieldAlert,
  Check,
  AlertCircle,
  Clock,
  Server,
  Database,
  Mail,
  HardDrive,
  Globe,
  Radio,
} from 'lucide-react';
import { toast } from 'react-toastify';

const CATEGORY_META = {
  database: { label: 'Database', icon: Database, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  api_key: { label: 'API Key', icon: Radio, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
  auth_secret: { label: 'Auth Secret', icon: Lock, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  storage: { label: 'Storage', icon: HardDrive, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  smtp: { label: 'SMTP Relay', icon: Mail, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  service_token: { label: 'Service Token', icon: Server, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  deployment: { label: 'Deployment', icon: Globe, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  other: { label: 'Config', icon: Key, color: 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20' },
};

const ProjectCredentialsTab = ({ project = 'schoolhub' }) => {
  const { adminUser } = useAdminAuth();
  const isAuthorized = adminUser?.isSuperAdmin || adminUser?.accessLevel === 'full';

  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterEnv, setFilterEnv] = useState('all');

  // In-memory decrypted secret storage ONLY (cleared on component unmount, NEVER in storage)
  const [revealedSecrets, setRevealedSecrets] = useState({});
  const [revealingId, setRevealingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCred, setEditingCred] = useState(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('other');
  const [formEnvironment, setFormEnvironment] = useState('production');
  const [formDescription, setFormDescription] = useState('');
  const [formSecretValue, setFormSecretValue] = useState('');
  const [showFormSecret, setShowFormSecret] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation (Vercel-level confirmation)
  const [deleteConfirmCred, setDeleteConfirmCred] = useState(null);
  const [deleteVerifyInput, setDeleteVerifyInput] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchCredentials = useCallback(async () => {
    if (!isAuthorized) return;
    try {
      setLoading(true);
      const params = { project };
      if (filterCategory !== 'all') params.category = filterCategory;
      if (filterEnv !== 'all') params.environment = filterEnv;

      const res = await adminApi.getCredentials(params);
      if (res.success) {
        setCredentials(res.credentials || []);
        localStorage.setItem(`megatrix_creds_${project}`, JSON.stringify(res.credentials || []));
      }
    } catch (err) {
      console.warn('[ProjectCredentialsTab] Gateway 5002 offline, using autonomous credentials store.');
      const local = localStorage.getItem(`megatrix_creds_${project}`);
      if (local) {
        try {
          setCredentials(JSON.parse(local));
        } catch {
          setCredentials([]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [project, filterCategory, filterEnv, isAuthorized]);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  // Handle Secret Reveal
  const handleToggleReveal = async (cred) => {
    if (revealedSecrets[cred._id]) {
      // Hide
      setRevealedSecrets((prev) => {
        const next = { ...prev };
        delete next[cred._id];
        return next;
      });
      return;
    }

    try {
      setRevealingId(cred._id);
      const res = await adminApi.revealCredential(cred._id);
      if (res.success && res.credential?.secretValue) {
        setRevealedSecrets((prev) => ({
          ...prev,
          [cred._id]: res.credential.secretValue,
        }));
        toast.info(`Secret for "${cred.name}" revealed. Audit log signed.`, { autoClose: 2000 });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to decrypt secret.');
    } finally {
      setRevealingId(null);
    }
  };

  // Handle Copy
  const handleCopySecret = async (cred) => {
    try {
      let val = revealedSecrets[cred._id];
      if (!val) {
        const res = await adminApi.revealCredential(cred._id);
        if (res.success && res.credential?.secretValue) {
          val = res.credential.secretValue;
          setRevealedSecrets((prev) => ({
            ...prev,
            [cred._id]: val,
          }));
        }
      }

      if (val) {
        await navigator.clipboard.writeText(val);
        setCopiedId(cred._id);
        setTimeout(() => setCopiedId(null), 2000);
        toast.success(`Copied "${cred.name}" to clipboard securely.`);
      }
    } catch (err) {
      toast.error('Failed to copy secret to clipboard.');
    }
  };

  // Open Create / Edit Modal
  const openCreateModal = () => {
    setEditingCred(null);
    setFormName('');
    setFormCategory('other');
    setFormEnvironment('production');
    setFormDescription('');
    setFormSecretValue('');
    setShowFormSecret(false);
    setModalOpen(true);
  };

  const openEditModal = (cred) => {
    setEditingCred(cred);
    setFormName(cred.name);
    setFormCategory(cred.category || 'other');
    setFormEnvironment(cred.environment || 'production');
    setFormDescription(cred.description || '');
    setFormSecretValue('');
    setShowFormSecret(false);
    setModalOpen(true);
  };

  // Handle Save
  const handleSaveCredential = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Credential name is required.');
      return;
    }

    if (!editingCred && !formSecretValue) {
      toast.error('Secret value is required when creating a new credential.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingCred) {
        const payload = {
          name: formName.trim().toUpperCase(),
          category: formCategory,
          environment: formEnvironment,
          description: formDescription.trim(),
        };
        if (formSecretValue.trim()) {
          payload.secretValue = formSecretValue;
        }

        const res = await adminApi.updateCredential(editingCred._id, payload);
        if (res.success) {
          toast.success(
            formSecretValue.trim()
              ? `Rotated secret for "${formName}" successfully.`
              : `Updated metadata for "${formName}".`
          );
          setModalOpen(false);
          fetchCredentials();
        }
      } else {
        const payload = {
          project,
          name: formName.trim().toUpperCase(),
          category: formCategory,
          environment: formEnvironment,
          description: formDescription.trim(),
          secretValue: formSecretValue,
        };

        const res = await adminApi.createCredential(payload);
        if (res.success) {
          toast.success(`Created encrypted credential "${formName}".`);
          setModalOpen(false);
          fetchCredentials();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save credential.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDeleteCredential = async () => {
    if (!deleteConfirmCred) return;
    try {
      setDeleting(true);
      const res = await adminApi.deleteCredential(deleteConfirmCred._id);
      if (res.success) {
        toast.success(`Credential "${deleteConfirmCred.name}" deleted.`);
        setDeleteConfirmCred(null);
        fetchCredentials();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete credential.');
    } finally {
      setDeleting(false);
    }
  };

  // 1. Unauthorized Guard View
  if (!isAuthorized) {
    return (
      <div className="p-8 rounded-2xl bg-mx-surface border border-rose-500/20 text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Restricted Operational Vault</h2>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            Credential management is strictly restricted to Superadmin and authorized Full Access administrators.
            Your role does not possess cryptographic authorization to access or view platform secrets.
          </p>
        </div>
        <div className="pt-2 text-[11px] text-neutral-500 font-mono">
          Security Policy: Zero-Trust Scoped RBAC &bull; Access attempt audited
        </div>
      </div>
    );
  }

  const projectName = project === 'schoolhub' ? 'School Hub' : 'Biz Manager';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Vault Telemetry Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-mx-surface border border-mx-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {projectName} Cryptographic Vault
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              AES-256-GCM
            </span>
          </div>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            Encrypted environment variables, database keys, and third-party service credentials.
            Secrets are masked by default, never stored plaintext, and all access operations are signed to the audit trail.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={fetchCredentials}
            disabled={loading}
            className="p-2 rounded-xl bg-mx-elevated hover:bg-mx-border2 text-neutral-300 transition-colors border border-mx-border disabled:opacity-50 cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Credential</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-neutral-500 font-semibold">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-mx-surface border border-mx-border text-neutral-200 text-xs focus:outline-none focus:border-mx-blue cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="database">Database</option>
            <option value="api_key">API Keys</option>
            <option value="auth_secret">Auth Secrets</option>
            <option value="storage">Storage</option>
            <option value="smtp">SMTP Relay</option>
            <option value="service_token">Service Tokens</option>
            <option value="deployment">Deployment</option>
            <option value="other">Other</option>
          </select>

          <span className="text-neutral-500 font-semibold ml-2">Environment:</span>
          <select
            value={filterEnv}
            onChange={(e) => setFilterEnv(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-mx-surface border border-mx-border text-neutral-200 text-xs focus:outline-none focus:border-mx-blue cursor-pointer"
          >
            <option value="all">All Environments</option>
            <option value="production">Production</option>
            <option value="staging">Staging</option>
            <option value="development">Development</option>
          </select>
        </div>

        <span className="text-neutral-400 font-mono text-[11px]">
          {credentials.length} secret{credentials.length === 1 ? '' : 's'} managed
        </span>
      </div>

      {/* Credentials Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500 font-mono">
          Loading secure credentials from encrypted store...
        </div>
      ) : credentials.length === 0 ? (
        <div className="p-12 rounded-2xl bg-mx-surface border border-mx-border text-center space-y-3">
          <Key className="w-8 h-8 text-neutral-600 mx-auto" />
          <p className="text-xs text-neutral-400">No credentials found matching current filters.</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mx-elevated text-xs text-neutral-300 hover:text-white border border-mx-border"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Credential</span>
          </button>
        </div>
      ) : (
        <div className="bg-mx-surface border border-mx-border rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-mx-border bg-mx-elevated/40 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Credential Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Environment</th>
                  <th className="py-3 px-4">Secret Value (Encrypted)</th>
                  <th className="py-3 px-4">Last Rotated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mx-border text-xs">
                {credentials.map((cred) => {
                  const cat = CATEGORY_META[cred.category] || CATEGORY_META.other;
                  const CatIcon = cat.icon;
                  const isRevealed = Boolean(revealedSecrets[cred._id]);
                  const secretText = revealedSecrets[cred._id] || cred.maskedValue || '••••••••••••••••';
                  const isRevealing = revealingId === cred._id;
                  const isCopied = copiedId === cred._id;

                  return (
                    <tr key={cred._id} className="hover:bg-mx-elevated/20 transition-colors">
                      {/* Name & Description */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        <div className="flex flex-col">
                          <span className="text-white text-xs tracking-wide">{cred.name}</span>
                          {cred.description && (
                            <span className="text-[10px] text-neutral-500 font-sans font-normal mt-0.5 max-w-xs truncate">
                              {cred.description}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${cat.color}`}
                        >
                          <CatIcon className="w-3 h-3" />
                          <span>{cat.label}</span>
                        </span>
                      </td>

                      {/* Environment */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                            cred.environment === 'production'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                          }`}
                        >
                          {cred.environment}
                        </span>
                      </td>

                      {/* Masked / Revealed Secret */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded bg-black/40 border border-mx-border text-xs select-all max-w-[220px] truncate ${
                              isRevealed ? 'text-emerald-300 font-semibold' : 'text-neutral-400'
                            }`}
                          >
                            {secretText}
                          </span>

                          {/* Reveal / Hide Toggle */}
                          <button
                            onClick={() => handleToggleReveal(cred)}
                            disabled={isRevealing}
                            className="p-1.5 rounded-lg bg-mx-elevated hover:bg-mx-border2 text-neutral-300 hover:text-white border border-mx-border transition-colors cursor-pointer"
                            title={isRevealed ? 'Mask secret' : 'Decrypt & reveal secret'}
                          >
                            {isRevealing ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-neutral-400" />
                            ) : isRevealed ? (
                              <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Copy Action */}
                          <button
                            onClick={() => handleCopySecret(cred)}
                            className="p-1.5 rounded-lg bg-mx-elevated hover:bg-mx-border2 text-neutral-300 hover:text-white border border-mx-border transition-colors cursor-pointer"
                            title="Copy secret"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Last Rotated */}
                      <td className="py-3.5 px-4 text-neutral-400 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-500" />
                          <span>
                            {cred.lastRotatedAt
                              ? new Date(cred.lastRotatedAt).toLocaleDateString()
                              : 'Initial'}
                          </span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(cred)}
                            className="p-1.5 rounded-lg hover:bg-mx-elevated text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                            title="Edit metadata or rotate secret"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteConfirmCred(cred);
                              setDeleteVerifyInput('');
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete credential"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE / EDIT CREDENTIAL (No category selector, inline secret reveal) ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-mx-surface border border-mx-border rounded-xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-mx-border">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-mx-blue" strokeWidth={1.5} />
                <h3 className="text-sm font-bold text-white">
                  {editingCred ? `Rotate Secret: ${editingCred.name}` : 'Add Encrypted Credential'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-neutral-500 hover:text-white text-xs cursor-pointer p-1"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCredential} className="space-y-4 text-xs">
              {/* Title of Secret */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Title of Secret
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BIZ_POS_SECRET_KEY"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-mx-elevated border border-mx-border focus:border-mx-blue rounded-lg text-white font-mono text-xs focus:outline-none uppercase"
                />
              </div>

              {/* Secret Value with Hide / Unhide Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    {editingCred ? 'Secret Value (Leave blank to preserve current)' : 'Secret Value'}
                  </label>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {showFormSecret ? 'Plaintext Visible' : 'Masked'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showFormSecret ? 'text' : 'password'}
                    placeholder={editingCred ? 'Enter new secret to rotate...' : 'Paste or type secret key...'}
                    value={formSecretValue}
                    onChange={(e) => setFormSecretValue(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-mx-elevated border border-mx-border focus:border-mx-blue rounded-lg text-white font-mono text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormSecret(!showFormSecret)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title={showFormSecret ? 'Hide secret value' : 'Show secret value'}
                    aria-label="Toggle secret visibility"
                  >
                    {showFormSecret ? (
                      <EyeOff className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              {/* Environment */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Target Environment
                </label>
                <select
                  value={formEnvironment}
                  onChange={(e) => setFormEnvironment(e.target.value)}
                  className="w-full px-3 py-2 bg-mx-elevated border border-mx-border focus:border-mx-blue rounded-lg text-white text-xs focus:outline-none cursor-pointer"
                >
                  <option value="production">Production (Default)</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Description / Context (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional notes regarding key usage or service"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-mx-elevated border border-mx-border focus:border-mx-blue rounded-lg text-white text-xs focus:outline-none resize-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-mx-border text-[11px] text-neutral-400 space-y-1">
                <span className="font-semibold text-emerald-400">Hardware Vault Security:</span>
                <p>Payload is encrypted via AES-256-GCM prior to database commit. Plaintext is never stored unencrypted.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-mx-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-mx-elevated hover:bg-mx-border2 text-neutral-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-white/90 text-black text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Encrypting & Saving...' : editingCred ? 'Update Secret' : 'Save Encrypted Secret'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: DELETE CONFIRMATION (Vercel-Level Confirmation) ─── */}
      {deleteConfirmCred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-mx-surface border border-rose-500/40 rounded-xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-400" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Credential Permanently</h3>
                <p className="text-[11px] text-neutral-400 font-mono">Immutable Security Action</p>
              </div>
            </div>

            <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg text-xs text-neutral-300 leading-relaxed">
              This action <strong className="text-white font-semibold">cannot be undone</strong>. This will permanently revoke and purge the secret from the platform cryptographic vault.
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-neutral-300">
                To confirm deletion, please type{' '}
                <span className="text-rose-400 font-mono font-bold select-all bg-black/60 px-1.5 py-0.5 rounded border border-rose-500/30">
                  {deleteConfirmCred.name}
                </span>{' '}
                below:
              </label>
              <input
                type="text"
                autoFocus
                placeholder={deleteConfirmCred.name}
                value={deleteVerifyInput}
                onChange={(e) => setDeleteVerifyInput(e.target.value)}
                className="w-full px-3 py-2 bg-mx-elevated border border-mx-border focus:border-rose-500 rounded-lg text-white font-mono text-xs focus:outline-none"
              />
              <p className="text-[11px] text-neutral-500">
                {deleteVerifyInput.trim() === deleteConfirmCred.name ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <Check className="w-3.5 h-3.5" /> Identity verified. Deletion authorized.
                  </span>
                ) : (
                  <span>Type the exact secret title above to enable confirmation.</span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-mx-border">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmCred(null);
                  setDeleteVerifyInput('');
                }}
                className="px-3.5 py-2 rounded-lg bg-mx-elevated hover:bg-mx-border2 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCredential}
                disabled={deleting || deleteVerifyInput.trim() !== deleteConfirmCred.name}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:border disabled:border-neutral-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {deleting ? 'Purging Secret...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCredentialsTab;
