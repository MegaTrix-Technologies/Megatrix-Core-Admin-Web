import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  FiLayers,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiCpu,
  FiShoppingBag,
  FiShare2,
  FiTarget,
  FiShield,
  FiSettings,
  FiBookOpen,
  FiMail,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const PlatformRegistry = () => {
  const { platforms, activePlatform, switchPlatform } = useAdminAuth();

  const iconMap = {
    bizmanager: FiShoppingBag,
    schoolmanager: FiBookOpen,
    mailerx: FiMail,
    'mega-ai': FiCpu,
    autoposting: FiShare2,
    leadhunter: FiTarget,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-mx-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              MegaTrix SaaS Platform Registry
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-mx-blue/10 text-mx-blue border border-mx-blue/20">
              Ecosystem Core
            </span>
          </div>
          <p className="text-xs text-mx-subtle mt-1">
            Global ecosystem directory for MegaTrix Technologies. Manage credentials, API connectors, and
            active tenant routing across all SaaS products.
          </p>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((p) => {
          const isSelected = activePlatform.id === p.id;
          const IconComponent = iconMap[p.id] || FiLayers;

          return (
            <div
              key={p.id}
              className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between space-y-6 ${
                isSelected
                  ? 'bg-gradient-to-b from-slate-900 to-slate-900/90 border-violet-500 shadow-xl shadow-violet-500/10 ring-1 ring-violet-500/30'
                  : 'bg-mx-surface/70 border-mx-border hover:border-mx-border2'
              }`}
            >
              <div className="space-y-4">
                {/* Platform Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                        p.status === 'active'
                          ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-emerald-600/20'
                          : 'bg-mx-elevated text-mx-subtle'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{p.name}</h3>
                        <span className="text-[10px] font-mono text-mx-subtle bg-mx-elevated px-1.5 py-0.5 rounded">
                          {p.version}
                        </span>
                      </div>
                      <p className="text-xs text-mx-subtle">{p.tagline}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                      p.status === 'active'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {p.status === 'active' ? '● Live Production' : '○ Standby Engine'}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">{p.description}</p>

                {/* Capabilities Badges */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] uppercase font-bold text-mx-muted tracking-wider">
                    Platform Capabilities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(p.capabilities || {}).map((cap) => (
                      <span
                        key={cap}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-mx-elevated text-neutral-300 border border-mx-border2/60"
                      >
                        ✓ {cap.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* API Gateway details */}
                <div className="bg-black/60 p-3 rounded-xl border border-mx-border text-[11px] font-mono text-mx-subtle space-y-1">
                  <div className="flex justify-between">
                    <span className="text-mx-muted">Gateway:</span>
                    <span className="text-neutral-300 truncate max-w-[220px]">
                      {p.apiUrl || 'Internal Monorepo Gateway'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mx-muted">Default Trial:</span>
                    <span className="text-emerald-400 font-bold">{p.quickStats?.defaultTrialDays} Days</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-mx-border flex items-center justify-between gap-3">
                {isSelected ? (
                  <span className="text-xs font-bold text-mx-blue flex items-center gap-1.5">
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Currently Active Management Target</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => switchPlatform(p.id)}
                    className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs shadow-md transition-all"
                  >
                    Activate Platform Target
                  </button>
                )}

                {p.id === 'bizmanager' && (
                  <a
                    href="http://localhost:5173"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-mx-elevated hover:bg-mx-border2 text-neutral-300 hover:text-white transition-all border border-mx-border2"
                    title="Open Biz Manager POS App (Port 5173)"
                  >
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                )}
                {p.id === 'schoolmanager' && (
                  <a
                    href="http://localhost:5174"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-mx-elevated hover:bg-mx-border2 text-neutral-300 hover:text-white transition-all border border-mx-border2"
                    title="Open School Manager ERP (Port 5174)"
                  >
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Guide Box */}
      <div className="bg-gradient-to-r from-violet-900/30 via-slate-900 to-indigo-900/30 border border-mx-blue/20 rounded-3xl p-6 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <FiShield className="w-5 h-5 text-mx-blue" />
          <span>MegaTrix Multi-SaaS Architecture Standard</span>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl">
          To plug any new MegaTrix SaaS platform into this central Core System, simply expose standard{' '}
          <code className="bg-mx-elevated px-1.5 py-0.5 rounded text-mx-blue">/api/admin/users</code> and{' '}
          <code className="bg-mx-elevated px-1.5 py-0.5 rounded text-mx-blue">/api/admin/subscriptions</code>{' '}
          endpoints adhering to the MegaTrix SuperAdmin JWT specification. The Admin Core will automatically
          provide full telemetry, user management, and subscription enforcement out of the box.
        </p>
      </div>
    </div>
  );
};

export default PlatformRegistry;
