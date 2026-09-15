import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  FiGrid,
  FiUsers,
  FiAward,
  FiLayers,
  FiLogOut,
  FiShield,
  FiChevronDown,
  FiCheck,
  FiMenu,
  FiX,
  FiExternalLink,
  FiZap,
  FiShoppingCart,
  FiBookOpen,
  FiMail,
} from 'react-icons/fi';

const AdminLayout = ({ children }) => {
  const {
    adminUser,
    activePlatform,
    switchPlatform,
    platforms,
    logout,
    gatewayMode,
    switchGatewayMode,
  } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navSections = [
    {
      title: 'Core Command Center',
      items: [
        { name: 'Overview & Metrics', path: '/', icon: FiGrid },
        { name: 'Platform Registry', path: '/platforms', icon: FiLayers, badge: 'SaaS' },
      ],
    },
    {
      title: 'Governance & Access Control',
      items: [
        { name: 'User Management', path: '/users', icon: FiUsers, badge: 'RBAC' },
        { name: 'Roles & Policies', path: '/roles', icon: FiShield, badge: 'Granular' },
        { name: 'Security Audit Trail', path: '/audit', icon: FiShield, badge: 'Audit' },
      ],
    },
    {
      title: 'Integrated SaaS Modules',
      items: [
        {
          name: 'Biz Manager POS',
          path: '/modules/bizmanager',
          icon: FiShoppingCart,
          badge: 'Port 5173',
        },
        {
          name: 'School Manager ERP',
          path: '/modules/schoolmanager',
          icon: FiBookOpen,
          badge: 'Port 5174',
        },
      ],
    },
    {
      title: 'Shared Platform Services',
      items: [
        {
          name: 'MailerX Email Relay',
          path: '/services/mailerx',
          icon: FiMail,
          badge: 'Brevo',
        },
        {
          name: 'Subscription Licenses',
          path: '/subscriptions',
          icon: FiAward,
          badge: 'Tiers',
        },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-mx-surface border-b border-mx-border sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-md">
            <img src="/megatrix-icon.svg" alt="MegaTrix" className="w-5 h-auto invert" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">MegaTrix Core</h1>
            <p className="text-[10px] text-mx-blue font-semibold">{activePlatform.name}</p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-mx-elevated text-neutral-300"
        >
          {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-mx-surface border-r border-mx-border flex flex-col justify-between transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6 p-4">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-mx-border">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/5">
                <img src="/megatrix-icon.svg" alt="MegaTrix" className="w-6 h-auto invert" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-white tracking-tight leading-none">
                  MegaTrix <span className="text-mx-blue">Core</span>
                </h2>
                <span className="text-[10px] text-mx-subtle font-medium tracking-wide">Multi-SaaS Admin</span>
              </div>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white/5 text-white border border-white/10 uppercase tracking-wider">
              SuperAdmin
            </span>
          </div>

          {/* Multi-SaaS Platform Switcher */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-mx-subtle uppercase tracking-wider mb-1.5">
              Active SaaS Ecosystem
            </label>
            <button
              type="button"
              onClick={() => setPlatformDropdownOpen(!platformDropdownOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-mx-elevated border border-mx-border2 hover:border-mx-border text-left transition-all shadow-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    activePlatform.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{activePlatform.name}</p>
                  <p className="text-[10px] text-mx-subtle truncate">{activePlatform.tagline}</p>
                </div>
              </div>
              <FiChevronDown
                className={`w-4 h-4 text-mx-subtle transition-transform ${
                  platformDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Platform Dropdown */}
            {platformDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-mx-surface border border-mx-border2 rounded-2xl shadow-2xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      switchPlatform(p.id);
                      setPlatformDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                      activePlatform.id === p.id
                        ? 'bg-white/10 text-white font-bold border border-white/15'
                        : 'text-neutral-300 hover:bg-mx-elevated'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">{p.name}</span>
                      <span className="text-[10px] text-mx-subtle">{p.quickStats?.category}</span>
                    </div>
                    {activePlatform.id === p.id && <FiCheck className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grouped Navigation Links */}
          <nav className="space-y-4">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <label className="block text-[10px] font-bold text-mx-subtle uppercase tracking-wider mb-1.5 px-1">
                  {section.title}
                </label>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-white text-black font-bold shadow-md shadow-white/5'
                          : 'text-mx-subtle hover:text-neutral-200 hover:bg-mx-elevated'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                            isActive
                              ? 'bg-black/20 text-black'
                              : 'bg-mx-elevated text-mx-subtle border border-mx-border'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* SuperAdmin Footer Card */}
        <div className="p-4 border-t border-mx-border bg-mx-surface space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
              {adminUser?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {adminUser?.name || 'SuperAdmin'}
              </p>
              <p className="text-[10px] text-mx-subtle truncate">{adminUser?.email || ''}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-rose-500/15"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Breadcrumb Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-mx-surface/80 glass-dark border-b border-mx-border sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-mx-subtle">MegaTrix Core</span>
            <span className="text-mx-muted">/</span>
            <span className="text-xs font-bold text-white capitalize">
              {location.pathname === '/'
                ? 'Overview'
                : location.pathname.replace('/modules/', '').replace('/services/', '').replace('/', '').replace('-', ' ')}
            </span>
            <span className="text-mx-muted">/</span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${activePlatform.badgeColor}`}
            >
              Platform: {activePlatform.name} ({activePlatform.version})
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick module direct launchers */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              title="Launch Biz Manager POS (Port 5173)"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-all border border-blue-500/20"
            >
              <FiShoppingCart className="w-3.5 h-3.5" />
              <span className="font-semibold">Biz POS (:5173)</span>
              <FiExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noreferrer"
              title="Launch School Manager ERP (Port 5174)"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
            >
              <FiBookOpen className="w-3.5 h-3.5" />
              <span className="font-semibold">School ERP (:5174)</span>
              <FiExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <button
              onClick={() => switchGatewayMode(gatewayMode === 'live' ? 'autonomous' : 'live')}
              title={
                gatewayMode === 'live'
                  ? 'Click to run in Autonomous Standalone mode'
                  : 'Click to connect to Live Backend (Port 5000)'
              }
              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                gatewayMode === 'live'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-mx-elevated text-mx-blue border-mx-blue/30 hover:bg-mx-blue/10'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  gatewayMode === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-mx-blue'
                }`}
              />
              <span className="font-semibold">
                {gatewayMode === 'live' ? 'Live Gateway' : 'Autonomous Core'}
              </span>
            </button>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
