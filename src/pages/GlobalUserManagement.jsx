import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import UserManagement from './UserManagement';
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  Mail,
  ShieldAlert,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const GlobalUserManagement = () => {
  const { adminUser, hasPermission } = useAdminAuth();

  const isAuthorized =
    adminUser?.isSuperAdmin ||
    adminUser?.accessLevel === 'full' ||
    hasPermission('global.users.view');

  if (!isAuthorized) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto space-y-4 my-16 bg-mx-surface border border-rose-500/20 rounded-2xl">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-white">Access Restricted</h2>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Global User Management is restricted to Superadmin and authorized Full Access administrators.
          Your account does not possess the required <code>global.users.view</code> authority.
        </p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-mx-elevated text-xs font-semibold text-white hover:bg-mx-border2 transition-colors border border-mx-border"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Executive Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-mx-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-mx-elevated text-white border border-mx-border">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Global User Management
              </h1>
              <p className="text-xs text-neutral-400">
                Cross-platform identity governance, access delegation, and lifecycle management for{' '}
                <strong className="text-white">MegaTrix Ecosystem</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/settings?tab=admins"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-mx-elevated hover:bg-mx-border2 text-xs font-semibold text-neutral-200 transition-all border border-mx-border cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-mx-blue" />
            <span>Admin Users (Settings)</span>
          </Link>
        </div>
      </div>

      {/* Embedded Core User Management Component */}
      <UserManagement />
    </div>
  );
};

export default GlobalUserManagement;
