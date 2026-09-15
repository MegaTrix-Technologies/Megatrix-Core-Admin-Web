import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FiShield,
  FiLock,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiLayers,
} from 'react-icons/fi';
import adminApi from '../services/adminApi';
import ParticleNetwork from '../components/ParticleNetwork';
import { toast } from 'react-toastify';

const AccountActivation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [verifying, setVerifying] = useState(true);
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('No invitation token provided. Please use the secure link sent to your email.');
      setVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        setVerifying(true);
        const res = await adminApi.verifyInvitation(token);
        if (res.success && res.invitation) {
          setInvitation(res.invitation);
        } else {
          setError(res.message || 'Invitation is invalid or has expired.');
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Invalid or expired invitation token. Please contact your MegaTrix administrator.'
        );
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await adminApi.activateInvitation({
        token,
        password,
        confirmPassword,
      });

      if (res.success) {
        setActivated(true);
        toast.success('Account activated successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(res.message || 'Failed to activate account.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Activation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black">
      {/* LEFT 60% — Brand Panel */}
      <div className="relative w-full lg:w-[60%] h-[35vh] lg:h-screen bg-black flex items-center justify-center overflow-hidden">
        <ParticleNetwork className="absolute inset-0" />
        <div className="relative z-10 flex flex-col items-center space-y-6 pointer-events-none">
          <img src="/megatrix-icon.svg" alt="MegaTrix" className="w-52 lg:w-72 drop-shadow-2xl" />
          <div className="text-center space-y-2">
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 font-medium">
              Administrator Onboarding
            </p>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
            <p className="text-[11px] text-white/25">MegaTrix Global Platform</p>
          </div>
        </div>
      </div>

      {/* RIGHT 40% — Activation Form Panel */}
      <div className="w-full lg:w-[40%] min-h-[65vh] lg:min-h-screen bg-mx-surface flex items-center justify-center p-8 lg:p-12 border-l border-mx-border z-10">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FiShield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Activate Administrator Account
              </h1>
              <p className="text-xs text-mx-subtle mt-1">
                Configure your secure credentials to enter the MegaTrix Admin Core
              </p>
            </div>
          </div>

          {/* Verification / Loading State */}
          {verifying ? (
            <div className="p-8 text-center bg-black/40 border border-white/10 rounded-2xl space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-white/60">Verifying cryptographic invitation token...</p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <FiAlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Invalid or Expired Invitation</h3>
                <p className="text-xs text-rose-300/80 leading-relaxed">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Return to Login
              </button>
            </div>
          ) : activated ? (
            /* Success State */
            <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-4 text-center animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <FiCheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Account Successfully Activated!</h3>
                <p className="text-xs text-emerald-300/80">
                  Your administrator credentials have been stored. Redirecting you to the sign-in console...
                </p>
              </div>
            </div>
          ) : (
            /* Activation Form */
            <div className="space-y-6">
              {/* Profile Card Summary */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">Invited Administrator:</span>
                  <span className="font-bold text-white">{invitation?.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">Email:</span>
                  <span className="font-mono text-emerald-400">{invitation?.email}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">Access Level:</span>
                  <span className="uppercase font-semibold text-white px-2 py-0.5 rounded bg-white/10 text-[10px]">
                    {invitation?.accessLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40 flex items-center gap-1">
                    <FiLayers className="w-3 h-3" /> Platform Scopes:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(invitation?.platformScopes || []).map((scope) => (
                      <span
                        key={scope}
                        className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider">
                    Set Master Password *
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="password"
                      required
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="password"
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  <span>{submitting ? 'Activating Account...' : 'Complete Activation & Sign In'}</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="space-y-2 pt-4 border-t border-mx-border text-center">
            <p className="text-[10px] text-mx-muted">
              Restricted Access. MegaTrix Technologies Unified Control Center.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountActivation;
