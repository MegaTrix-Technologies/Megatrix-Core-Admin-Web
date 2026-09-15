import React, { useState, useEffect } from 'react';
import { FiX, FiAward, FiCalendar, FiClock, FiCheck } from 'react-icons/fi';
import adminApi from '../services/adminApi';
import { toast } from 'react-toastify';

const SubscriptionModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [plan, setPlan] = useState('pro');
  const [durationDays, setDurationDays] = useState(30);
  const [isLifetime, setIsLifetime] = useState(false);
  const [customExpiresAt, setCustomExpiresAt] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.subscription) {
      setPlan(user.subscription.plan || 'pro');
      setIsLifetime(Boolean(user.subscription.isLifetime));
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleQuickDuration = (days) => {
    setIsLifetime(false);
    setDurationDays(days);
    setCustomExpiresAt('');
  };

  const handleSetLifetime = () => {
    setIsLifetime(true);
    setPlan('lifetime');
    setCustomExpiresAt('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        plan: isLifetime ? 'lifetime' : plan,
        isLifetime,
        durationDays: isLifetime ? null : durationDays,
        customExpiresAt: customExpiresAt || null,
        note: note || `Admin granted ${isLifetime ? 'Lifetime' : `${durationDays} days of ${plan}`}`,
      };

      const res = await adminApi.put(`/api/admin/users/${user._id}/subscription`, payload);
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Subscription updated successfully!');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update subscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-mx-surface border border-mx-border rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-8 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-mx-subtle hover:text-neutral-200 transition-colors p-1"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400">
            <FiAward className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Manage User Subscription</h3>
            <p className="text-xs text-mx-subtle">
              User: <strong className="text-white">{user.name}</strong> ({user.email})
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plan Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-mx-subtle uppercase tracking-wider">
                Select Platform Subscription Tier
              </label>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                user.platformId === 'schoolmanager'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                {user.platformId === 'schoolmanager' ? 'School ERP SaaS' : 'Biz POS ERP'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(user.platformId === 'schoolmanager'
                ? [
                    { id: 'campus-basic', name: 'Campus Basic (15k)' },
                    { id: 'campus-pro', name: 'Campus Pro (35k)' },
                    { id: 'multi-campus', name: 'Multi-Campus (75k)' },
                  ]
                : [
                    { id: 'starter', name: 'Starter (2.5k)' },
                    { id: 'pro', name: 'Pro Retail (5k)' },
                    { id: 'enterprise', name: 'Enterprise' },
                  ]
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPlan(p.id);
                    setIsLifetime(false);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    !isLifetime && plan === p.id
                      ? 'bg-white border-white/80 text-black shadow-md shadow-white/5'
                      : 'bg-mx-elevated border-mx-border2 text-mx-subtle hover:text-neutral-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Duration Extension */}
          <div>
            <label className="block text-xs font-bold text-mx-subtle uppercase tracking-wider mb-1.5">
              Add Validity / Duration
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { label: '+7 Days', days: 7 },
                { label: '+30 Days', days: 30 },
                { label: '+90 Days', days: 90 },
                { label: '+1 Year', days: 365 },
              ].map((item) => (
                <button
                  key={item.days}
                  type="button"
                  onClick={() => handleQuickDuration(item.days)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                    !isLifetime && durationDays === item.days
                      ? 'bg-emerald-500 border-emerald-400 text-black shadow-md'
                      : 'bg-mx-elevated border-mx-border2 text-mx-subtle hover:text-neutral-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={handleSetLifetime}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  isLifetime
                    ? 'bg-amber-500 border-amber-400 text-black font-extrabold shadow-md'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                }`}
              >
                Lifetime VIP
              </button>
            </div>
          </div>

          {/* Custom Date Override */}
          {!isLifetime && (
            <div>
              <label className="block text-xs font-bold text-mx-subtle uppercase tracking-wider mb-1.5">
                Or Set Custom Expiry Date
              </label>
              <input
                type="date"
                value={customExpiresAt}
                onChange={(e) => setCustomExpiresAt(e.target.value)}
                className="w-full px-3 py-2 bg-mx-elevated border border-mx-border2 rounded-xl text-xs text-white focus:outline-none focus:border-mx-blue"
              />
            </div>
          )}

          {/* Admin Audit Note */}
          <div>
            <label className="block text-xs font-bold text-mx-subtle uppercase tracking-wider mb-1.5">
              Admin Note / Reason (Logged for Audit)
            </label>
            <input
              type="text"
              placeholder="e.g. Paid via JazzCash Rs 3,500 / 1 Year Promo"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-mx-elevated border border-mx-border2 rounded-xl text-xs text-white placeholder-mx-muted focus:outline-none focus:border-mx-blue"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-mx-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-mx-elevated hover:bg-mx-border2 text-neutral-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-white/90 text-black shadow-md shadow-white/5 transition-all disabled:opacity-50"
            >
              {loading ? 'Applying Changes...' : 'Save & Activate License'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionModal;
