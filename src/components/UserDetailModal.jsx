import React from 'react';
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiShoppingBag,
  FiCalendar,
  FiShield,
  FiSmartphone,
  FiGlobe,
  FiClock,
  FiAward,
} from 'react-icons/fi';
import StatusPill from './StatusPill';

const UserDetailModal = ({ isOpen, onClose, user, onManageSubscription }) => {
  if (!isOpen || !user) return null;

  const sub = user.subscription || {};
  const expiresAt = sub.expiresAt ? new Date(sub.expiresAt) : null;
  const now = new Date();
  const daysRemaining = sub.isLifetime
    ? 'Lifetime'
    : expiresAt
    ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-mx-surface border border-mx-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-mx-subtle hover:text-neutral-200 transition-colors p-1"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* User Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-black font-extrabold text-xl shadow-lg shadow-white/5">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <StatusPill type="account" status={user.accountStatus} />
            </div>
            <p className="text-xs text-mx-subtle flex items-center gap-2 mt-0.5">
              <span>{user.email}</span>
              <span>•</span>
              <span className="text-mx-blue font-semibold uppercase tracking-wider">{user.role}</span>
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tenancy & Business Information */}
          <div className="bg-mx-elevated rounded-2xl p-4 border border-mx-border2 space-y-3">
            <h4 className="text-xs font-bold text-mx-subtle uppercase tracking-wider flex items-center gap-1.5">
              <FiShoppingBag className="w-4 h-4 text-mx-blue" />
              <span>
                {user.platformId === 'schoolmanager' ? 'Institutional Profile' : 'Retail Business Profile'}
              </span>
            </h4>
            <div className="space-y-1.5 text-xs text-neutral-300">
              {user.platformId === 'schoolmanager' ? (
                <>
                  <p>
                    <span className="text-mx-muted">Campus Code:</span>{' '}
                    <strong className="text-emerald-400 font-mono font-bold">{user.campusCode || 'CAMPUS'}</strong>
                  </p>
                  <p>
                    <span className="text-mx-muted">Institution:</span>{' '}
                    <strong className="text-white">{user.schoolName || 'Campus Admin'}</strong>
                  </p>
                  <p>
                    <span className="text-mx-muted">Role:</span>{' '}
                    <strong className="text-sky-300 capitalize">{user.role || 'Admin'}</strong>
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <span className="text-mx-muted">Shop Name:</span>{' '}
                    <strong className="text-white">{user.shopName || 'Retail Merchant'}</strong>
                  </p>
                  <p>
                    <span className="text-mx-muted">Merchant Role:</span>{' '}
                    <strong className="text-blue-300 capitalize">{user.role || 'Owner'}</strong>
                  </p>
                </>
              )}
              <p>
                <span className="text-mx-muted">Phone:</span>{' '}
                <strong className="text-white">{user.phone || 'N/A'}</strong>
              </p>
              <p>
                <span className="text-mx-muted">Registered:</span>{' '}
                <strong className="text-white">{new Date(user.createdAt).toLocaleDateString()}</strong>
              </p>
            </div>
            <div className="pt-2 border-t border-mx-border">
              <span className="text-[10px] text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 block">
                {user.platformId === 'schoolmanager'
                  ? 'Locked to School Hub. Cannot access Biz POS.'
                  : 'Locked to Biz Manager. Cannot access School Hub.'}
              </span>
            </div>
          </div>

          {/* Device & Session Security */}
          <div className="bg-mx-elevated rounded-2xl p-4 border border-mx-border2 space-y-3">
            <h4 className="text-xs font-bold text-mx-subtle uppercase tracking-wider flex items-center gap-1.5">
              <FiShield className="w-4 h-4 text-emerald-400" />
              <span>Session & Device Security</span>
            </h4>
            <div className="space-y-1.5 text-xs text-neutral-300">
              <p>
                <span className="text-mx-muted">Device:</span>{' '}
                <strong className="text-white">
                  {user.lastActiveOS || 'OS'} • {user.lastActiveBrowser || 'Browser'}
                </strong>
              </p>
              <p>
                <span className="text-mx-muted">Last IP:</span>{' '}
                <strong className="text-white">{user.lastLoginIp || user.lastKnownIp || 'Unknown'}</strong>
              </p>
              <p>
                <span className="text-mx-muted">Last Seen:</span>{' '}
                <strong className="text-white">
                  {user.lastSeenAt ? new Date(user.lastSeenAt).toLocaleString() : 'N/A'}
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="bg-mx-elevated rounded-2xl p-5 border border-mx-blue/20 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <FiAward className="w-4 h-4 text-amber-400" />
              <span>Subscription & License Details</span>
            </h4>
            <StatusPill type="subscription" status={sub.status} isLifetime={sub.isLifetime} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-mx-surface p-3 rounded-xl border border-mx-border">
              <span className="text-mx-muted block text-[10px] uppercase font-bold">Plan</span>
              <strong className="text-white capitalize text-sm">{sub.plan || 'Trial'}</strong>
            </div>
            <div className="bg-mx-surface p-3 rounded-xl border border-mx-border">
              <span className="text-mx-muted block text-[10px] uppercase font-bold">Days Remaining</span>
              <strong className="text-emerald-400 text-sm">{daysRemaining}</strong>
            </div>
            <div className="bg-mx-surface p-3 rounded-xl border border-mx-border">
              <span className="text-mx-muted block text-[10px] uppercase font-bold">Expires At</span>
              <strong className="text-white text-xs">
                {sub.isLifetime ? 'Lifetime' : expiresAt ? expiresAt.toLocaleDateString() : 'N/A'}
              </strong>
            </div>
            <div className="bg-mx-surface p-3 rounded-xl border border-mx-border">
              <span className="text-mx-muted block text-[10px] uppercase font-bold">Assigned By</span>
              <strong className="text-neutral-300 text-xs truncate block">{sub.assignedBy || 'system'}</strong>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onManageSubscription) onManageSubscription(user);
            }}
            className="w-full py-2 px-4 rounded-xl bg-white hover:bg-white/90 text-black font-bold text-xs shadow-md shadow-white/5 transition-all flex items-center justify-center gap-2"
          >
            <span>Modify Plan or Extend Subscription</span>
          </button>
        </div>

        {/* Subscription History (if available) */}
        {sub.history && sub.history.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-mx-subtle uppercase tracking-wider">License Audit History</h5>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {sub.history.map((h, i) => (
                <div
                  key={i}
                  className="bg-mx-elevated p-2.5 rounded-xl text-xs flex items-center justify-between border border-mx-border"
                >
                  <div>
                    <span className="font-bold text-white capitalize">{h.plan}</span>
                    <span className="text-mx-subtle ml-2">({h.note || 'No note'})</span>
                  </div>
                  <span className="text-[10px] text-mx-muted">
                    {h.changedAt ? new Date(h.changedAt).toLocaleDateString() : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailModal;
