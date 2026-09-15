import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import ParticleNetwork from '../components/ParticleNetwork';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, loading } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black">
      {/* LEFT 60% — Brand Panel */}
      <div className="relative w-full lg:w-[60%] h-[40vh] lg:h-screen bg-black flex items-center justify-center overflow-hidden">
        {/* ParticleNetwork fills this entire panel */}
        <ParticleNetwork className="absolute inset-0" />
        
        {/* Logo overlay centered on top of particles */}
        <div className="relative z-10 flex flex-col items-center space-y-6 pointer-events-none">
          <img src="/megatrix-icon.svg" alt="MegaTrix" className="w-52 lg:w-72 drop-shadow-2xl" />
          <div className="text-center space-y-2">
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 font-medium">Matrix Core System</p>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
            <p className="text-[11px] text-white/25">Enterprise SaaS Management Platform</p>
          </div>
        </div>
      </div>

      {/* RIGHT 40% — Login Panel */}
      <div className="w-full lg:w-[40%] min-h-[60vh] lg:min-h-screen bg-mx-surface flex items-center justify-center p-8 lg:p-12 border-l border-mx-border z-10">
        <div className="max-w-sm w-full space-y-8">
          {/* Brand header */}
          <div className="space-y-3">
            <div className="font-tech tracking-wide select-none">
              <h2 className="text-2xl sm:text-[26px] font-black tracking-wide text-white drop-shadow-[0_0_24px_rgba(59,130,246,0.35)] flex items-center flex-wrap gap-x-2.5">
                <span className="bg-gradient-to-r from-white via-neutral-100 to-neutral-200 bg-clip-text text-transparent">
                  MegaTrix
                </span>
                <span className="text-mx-blue">
                  Technologies
                </span>
              </h2>
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Unified Command Center
              </h1>
              <p className="text-xs text-mx-subtle mt-1">
                Centralized multi-SaaS governance & ecosystem operations
              </p>
            </div>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                Enter Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mx-muted" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-mx-elevated border border-mx-border focus:border-mx-blue rounded-lg text-sm text-white placeholder-mx-muted focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mx-muted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-mx-elevated border border-mx-border focus:border-mx-blue rounded-lg text-sm text-white placeholder-mx-muted focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-white hover:bg-white/90 text-black font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-white/5"
            >
              <span>{loading ? 'Authenticating...' : 'Access Command Center'}</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer */}
          <div className="space-y-3 pt-4 border-t border-mx-border">
            <p className="text-[10px] text-mx-muted text-center">
              Restricted Access. All operations are monitored and logged.
            </p>
            <p className="text-[10px] text-mx-muted/50 text-center">
              © 2026 MegaTrix Technologies Inc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
