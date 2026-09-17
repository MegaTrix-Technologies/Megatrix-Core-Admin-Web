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
        aria-label="User Profile and Settings"
        aria-expanded={isOpen}
        className="flex items-center gap-2 p-1 rounded-sm hover:bg-mx-panel text-left transition-colors cursor-pointer group focus:outline-none focus:border focus:border-mx-blue border border-mx-border"
      >
        <div className="w-8 h-8 rounded-sm bg-mx-panel border border-mx-border flex items-center justify-center font-semibold text-white text-xs transition-colors relative">
          <span>{userInitial}</span>
          <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-mx-positive" />
        </div>
      </button>

      {/* Profile Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-mx-surface border border-mx-border rounded-md p-2 z-50 animate-in fade-in duration-150">
          {/* User Header Details */}
          <div className="px-3 py-2 border-b border-mx-border mb-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-white truncate">
                {adminUser?.name || 'Administrator'}
              </p>
              <span className="text-[11px] font-mono px-2 py-1 rounded-sm bg-mx-panel text-mx-subtle border border-mx-border uppercase tracking-wider shrink-0">
                {roleDisplay}
              </span>
            </div>
            <p className="text-[11px] text-mx-subtle truncate mt-0.5">
              {adminUser?.email || 'admin@megatrix.tech'}
            </p>
          </div>

          {/* Account & Profile Actions */}
          <div className="space-y-1 py-1">
            <button
              type="button"
              onClick={() => handleNavigate('/settings?tab=profile')}
              aria-label="Manage admin profile"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs text-mx-subtle hover:text-white hover:bg-mx-panel transition-colors text-left cursor-pointer min-h-[36px]"
            >
              <User size={16} strokeWidth={1.5} className="text-mx-muted" />
              <span>Admin Profile</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('/settings?tab=security')}
              aria-label="Security and audit logs"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs text-mx-subtle hover:text-white hover:bg-mx-panel transition-colors text-left cursor-pointer min-h-[36px]"
            >
              <Key size={16} strokeWidth={1.5} className="text-mx-muted" />
              <span>Security and API Keys</span>
            </button>

            {canManageAdmins && (
              <button
                type="button"
                onClick={() => handleNavigate('/settings?tab=admins')}
                aria-label="Manage team admin users"
                className="w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs text-mx-subtle hover:text-white hover:bg-mx-panel transition-colors text-left cursor-pointer min-h-[36px]"
              >
                <div className="flex items-center gap-2.5">
                  <Shield size={16} strokeWidth={1.5} className="text-mx-muted" />
                  <span>Admin Access Management</span>
                </div>
                <span className="text-[11px] font-mono px-1 rounded-sm bg-mx-panel text-mx-muted border border-mx-border">
                  Root
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleNavigate('/users')}
              aria-label="Global cross-platform users"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs text-mx-subtle hover:text-white hover:bg-mx-panel transition-colors text-left cursor-pointer min-h-[36px]"
            >
              <Users size={16} strokeWidth={1.5} className="text-mx-muted" />
              <span>Global Client Users</span>
            </button>
          </div>

          {/* Sign Out Action */}
          <div className="pt-1 border-t border-mx-border mt-1">
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Sign out of MegaTrix core"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs text-mx-danger hover:bg-mx-panel transition-colors text-left cursor-pointer min-h-[36px]"
            >
              <LogOut size={16} strokeWidth={1.5} />
              <span className="font-semibold">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
