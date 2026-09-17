import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { NavItem, NavGroup } from './navigation/NavGroup';
import {
  LayoutDashboard,
  FolderKanban,
  GraduationCap,
  Store,
  Users,
  Settings,
  Shield,
  Key,
  User,
} from 'lucide-react';

const Sidebar = ({
  isCollapsed = false,
  isMobile = false,
  onCloseMobile,
}) => {
  const { hasPermission, adminUser, canAccessPlatform } = useAdminAuth();
  const location = useLocation();

  const canAccessSchoolHub =
    canAccessPlatform('schoolhub') || canAccessPlatform('schoolmanager');
  const canAccessBizManager = canAccessPlatform('bizmanager');

  const canManageUsers =
    adminUser?.isSuperAdmin ||
    adminUser?.accessLevel === 'full' ||
    hasPermission('global.users.view');

  const canManageAdmins =
    adminUser?.isSuperAdmin || hasPermission('global.users.view');

  return (
    <aside
      className={`h-full flex flex-col justify-between bg-mx-surface border-r border-mx-border transition-all duration-300 ease-in-out select-none ${
        isMobile ? 'w-64' : isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4">
        {/* Top Header Label */}
        {!isCollapsed && (
          <div className="px-3 pt-2 pb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold text-mx-subtle uppercase tracking-widest font-mono">
              Core Navigation
            </span>
            <span className="text-[11px] font-mono px-2 h-[22px] flex items-center rounded-sm bg-mx-panel text-mx-subtle border border-mx-border">
              Enterprise
            </span>
          </div>
        )}

        {/* Navigation Groups */}
        <nav className="space-y-4 flex-1">
          {/* ─────────────────────────────────────────────────────────────
           * 1. PLATFORM ADMINISTRATION
           * ───────────────────────────────────────────────────────────── */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="text-[11px] font-bold text-mx-subtle uppercase tracking-wider px-3 mb-1 font-mono">
                Platform
              </div>
            )}

            {/* Platform Executive Dashboard */}
            <NavItem
              to="/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
              isCollapsed={isCollapsed && !isMobile}
              onClick={onCloseMobile}
              exact={true}
            />

            {/* Projects Navigation */}
            <NavGroup
              icon={FolderKanban}
              title="Projects"
              isCollapsed={isCollapsed && !isMobile}
              onItemClick={onCloseMobile}
              defaultExpanded={true}
              items={[
                ...(canAccessSchoolHub
                  ? [
                      {
                        to: '/projects/school-hub',
                        label: 'School Hub',
                        icon: GraduationCap,
                      },
                    ]
                  : []),
                ...(canAccessBizManager
                  ? [
                      {
                        to: '/projects/biz-manager',
                        label: 'Biz Manager',
                        icon: Store,
                      },
                    ]
                  : []),
              ]}
            />

            {/* Platform User Management */}
            {canManageUsers && (
              <NavItem
                to="/users"
                icon={Users}
                label="User Management"
                isCollapsed={isCollapsed && !isMobile}
                onClick={onCloseMobile}
              />
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────
           * 2. GOVERNANCE & SETTINGS
           * ───────────────────────────────────────────────────────────── */}
          <div className="pt-3 border-t border-mx-border space-y-1">
            {!isCollapsed && (
              <div className="text-[11px] font-bold text-mx-subtle uppercase tracking-wider px-3 mb-1 font-mono">
                System and Governance
              </div>
            )}

            <NavItem
              to="/settings?tab=profile"
              icon={User}
              label="Profile"
              isCollapsed={isCollapsed && !isMobile}
              onClick={onCloseMobile}
            />

            <NavItem
              to="/settings?tab=security"
              icon={Key}
              label="Security and Audit"
              isCollapsed={isCollapsed && !isMobile}
              onClick={onCloseMobile}
            />

            {canManageAdmins && (
              <NavItem
                to="/settings?tab=admins"
                icon={Shield}
                label="Admin Users"
                isCollapsed={isCollapsed && !isMobile}
                onClick={onCloseMobile}
              />
            )}
          </div>
        </nav>
      </div>

      {/* Bottom Status / Indicator */}
      <div className="p-3 border-t border-mx-border text-[11px] text-mx-subtle flex items-center justify-between font-mono">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-mx-positive" />
              <span className="truncate text-mx-subtle">Core Online</span>
            </div>
            <span className="text-mx-subtle">v1.0</span>
          </>
        ) : (
          <div className="w-full flex justify-center" title="Core Online">
            <span className="w-2 h-2 rounded-full bg-mx-positive" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
