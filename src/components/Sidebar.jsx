import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import PortalSelector from './navigation/PortalSelector';
import { NavItem, NavGroup } from './navigation/NavGroup';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  UserX,
  UserMinus,
  Activity,
  Receipt,
  Store,
  Wallet,
  Settings,
  Shield,
  Key,
  CreditCard,
} from 'lucide-react';

const Sidebar = ({
  isCollapsed = false,
  isMobile = false,
  onCloseMobile,
}) => {
  const { activePlatform, hasPermission, adminUser } = useAdminAuth();
  const location = useLocation();

  const isSchoolHub =
    activePlatform?.id === 'schoolhub' ||
    activePlatform?.aliasId === 'schoolhub' ||
    activePlatform?.id === 'schoolmanager';

  const canManageAdmins =
    adminUser?.isSuperAdmin || hasPermission('global.users.view');

  return (
    <aside
      className={`h-full flex flex-col justify-between bg-mx-surface border-r border-mx-border transition-all duration-300 ease-in-out select-none ${
        isMobile ? 'w-64' : isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4">
        {/* Top: Portal / Product Selector */}
        <div className="pb-3 border-b border-mx-border">
          <PortalSelector isCollapsed={isCollapsed && !isMobile} />
        </div>

        {/* Dynamic Contextual Navigation */}
        <nav className="space-y-4 flex-1">
          {isSchoolHub ? (
            /* ─────────────────────────────────────────────────────────────
             * SCHOOL HUB NAVIGATION
             * ───────────────────────────────────────────────────────────── */
            <>
              <div className="space-y-1">
                {!isCollapsed && (
                  <div className="text-[10px] font-bold text-mx-subtle uppercase tracking-wider px-3 mb-1">
                    School Hub
                  </div>
                )}

                {/* 1. Dashboard */}
                <NavItem
                  to="/schoolhub"
                  icon={LayoutDashboard}
                  label="Dashboard"
                  isCollapsed={isCollapsed && !isMobile}
                  onClick={onCloseMobile}
                  exact={true}
                />

                {/* 2. Schools Directory */}
                <NavItem
                  to="/schoolhub/schools"
                  icon={Building2}
                  label="Schools Directory"
                  isCollapsed={isCollapsed && !isMobile}
                  onClick={onCloseMobile}
                />

                {/* 3. User Management (Expandable 4 Sub-routes) */}
                <NavGroup
                  icon={Users}
                  title="User Management"
                  isCollapsed={isCollapsed && !isMobile}
                  onItemClick={onCloseMobile}
                  items={[
                    {
                      to: '/schoolhub/users/all',
                      label: 'View All Users',
                      icon: UserCheck,
                    },
                    {
                      to: '/schoolhub/users/blocked',
                      label: 'Blocked Users',
                      icon: UserX,
                    },
                    {
                      to: '/schoolhub/users/deleted',
                      label: 'Recently Deleted Users',
                      icon: UserMinus,
                    },
                    {
                      to: '/schoolhub/users/activity',
                      label: 'User Activity',
                      icon: Activity,
                    },
                  ]}
                />

                {/* 4. Fees & Challans */}
                <NavItem
                  to="/schoolhub/challans"
                  icon={Receipt}
                  label="Fees & 3-Copy Challans"
                  isCollapsed={isCollapsed && !isMobile}
                  onClick={onCloseMobile}
                />
              </div>
            </>
          ) : (
            /* ─────────────────────────────────────────────────────────────
             * BIZ MANAGER NAVIGATION
             * ───────────────────────────────────────────────────────────── */
            <>
              <div className="space-y-1">
                {!isCollapsed && (
                  <div className="text-[10px] font-bold text-mx-subtle uppercase tracking-wider px-3 mb-1">
                    Biz Manager
                  </div>
                )}

                {/* 1. Dashboard */}
                <NavItem
                  to="/bizmanager"
                  icon={LayoutDashboard}
                  label="Dashboard"
                  isCollapsed={isCollapsed && !isMobile}
                  onClick={onCloseMobile}
                  exact={true}
                />

                {/* 2. Stores & Outlets */}
                <NavItem
                  to="/bizmanager/stores"
                  icon={Store}
                  label="Stores & Inventory"
                  isCollapsed={isCollapsed && !isMobile}
                  onClick={onCloseMobile}
                />

                {/* 3. POS & Invoices */}
                <NavItem
                  to="/bizmanager/invoices"
                  icon={CreditCard}
                  label="POS Sales & Invoices"
                  isCollapsed={isCollapsed && !isMobile}
                  onClick={onCloseMobile}
                />

                {/* 4. Customer Khata & Finance */}
                <NavItem
                  to="/bizmanager/finance"
                  icon={Wallet}
                  label="Khata & Receivables"
                  isCollapsed={isCollapsed && !isMobile}
                  onClick={onCloseMobile}
                />

                {/* 5. User Management (Expandable 4 Sub-routes) */}
                <NavGroup
                  icon={Users}
                  title="User Management"
                  isCollapsed={isCollapsed && !isMobile}
                  onItemClick={onCloseMobile}
                  items={[
                    {
                      to: '/bizmanager/users/all',
                      label: 'View All Users',
                      icon: UserCheck,
                    },
                    {
                      to: '/bizmanager/users/blocked',
                      label: 'Blocked Users',
                      icon: UserX,
                    },
                    {
                      to: '/bizmanager/users/deleted',
                      label: 'Recently Deleted Users',
                      icon: UserMinus,
                    },
                    {
                      to: '/bizmanager/users/activity',
                      label: 'User Activity',
                      icon: Activity,
                    },
                  ]}
                />
              </div>
            </>
          )}

          {/* ─────────────────────────────────────────────────────────────
           * COMMON SETTINGS & GOVERNANCE SECTION
           * ───────────────────────────────────────────────────────────── */}
          <div className="pt-3 border-t border-mx-border space-y-1">
            {!isCollapsed && (
              <div className="text-[10px] font-bold text-mx-subtle uppercase tracking-wider px-3 mb-1">
                Governance & Settings
              </div>
            )}

            <NavGroup
              icon={Settings}
              title="Settings"
              isCollapsed={isCollapsed && !isMobile}
              onItemClick={onCloseMobile}
              defaultExpanded={location.pathname.startsWith('/settings')}
              items={[
                {
                  to: '/settings?tab=profile',
                  label: 'Profile',
                  icon: Settings,
                },
                {
                  to: '/settings?tab=security',
                  label: 'Security',
                  icon: Key,
                },
                ...(canManageAdmins
                  ? [
                      {
                        to: '/settings?tab=admins',
                        label: 'Admin Users',
                        icon: Shield,
                        badge: 'Root',
                      },
                    ]
                  : []),
              ]}
            />
          </div>
        </nav>
      </div>

      {/* Bottom Status / Indicator */}
      <div className="p-3 border-t border-mx-border text-[10px] text-mx-subtle flex items-center justify-between">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="truncate">MegaTrix Core Online</span>
            </div>
            <span className="text-neutral-500 font-mono">v1.0</span>
          </>
        ) : (
          <div className="w-full flex justify-center" title="MegaTrix Core Online">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
