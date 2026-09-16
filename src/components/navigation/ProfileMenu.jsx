import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  User,
  Shield,
  Key,
  LogOut,
  Settings,
  Users,
  ExternalLink,
} from 'lucide-react';

const ProfileMenu = () => {
  const { adminUser, logout, hasPermission } = useAdminAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const userInitial = adminUser?.name?.charAt(0)?.toUpperCase() || 'A';
  const roleDisplay = adminUser?.isSuperAdmin
    ? 'Superadmin'
    : adminUser?.accessLevel === 'full'
    ? 'Global Administrator'
    : 'Platform Admin';

  const canManageAdmins = adminUser?.isSuperAdmin || hasPermission('global.users.view');

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User Profile & Settings"
        aria-expanded={isOpen}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-mx-elevated text-left transition-colors cursor-pointer group focus:outline-none focus:ring-1 focus:ring-mx-blue"
      >
        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 group-hover:border-neutral-500 flex items-center justify-center font-semibold text-white text-xs transition-colors relative">
          <span>{userInitial}</span>
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-black" />
        </div>
      </button>

      {/* Profile Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-mx-surface border border-mx-border rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Header Details */}
          <div className="px-3 py-2.5 border-b border-mx-border mb-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-white truncate">
                {adminUser?.name || 'Administrator'}
              </p>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10 uppercase tracking-wider shrink-0">
                {roleDisplay}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 truncate mt-0.5">
              {adminUser?.email || 'admin@megatrix.tech'}
            </p>
          </div>

          {/* Account & Profile Actions */}
          <div className="space-y-0.5 py-1">
            <button
              type="button"
              onClick={() => handleNavigate('/settings?tab=profile')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-mx-elevated transition-colors text-left cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-neutral-400" />
              <span>Profile & Account Details</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('/settings?tab=profile')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-mx-elevated transition-colors text-left cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-neutral-400" />
              <span>Profile Settings</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('/settings?tab=security')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-mx-elevated transition-colors text-left cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-neutral-400" />
              <span>Security & Account Access</span>
            </button>

            {canManageAdmins && (
              <button
                type="button"
                onClick={() => handleNavigate('/settings?tab=admins')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-mx-elevated transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-3.5 h-3.5 text-mx-blue" />
                  <span>Admin User Governance</span>
                </div>
                <span className="text-[9px] font-bold text-mx-blue bg-mx-blue/10 px-1.5 py-0.5 rounded">
                  Superadmin
                </span>
              </button>
            )}
          </div>

          {/* Separated Logout Action */}
          <div className="pt-1 mt-1 border-t border-mx-border">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Command Center</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
