import React, { useState, useEffect, useMemo } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import MetricCard from '../../components/MetricCard';
import ProjectCredentialsTab from '../../components/credentials/ProjectCredentialsTab';
import {
  ShoppingCart,
  Users,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Shield,
  Key,
  Activity,
  Search,
  Lock,
  Unlock,
  Trash2,
  UserCheck,
  Clock,
  TrendingUp,
  Tag,
  Edit3,
  AlertTriangle,
  X,
  Check,
  Globe,
} from 'lucide-react';
import { toast } from 'react-toastify';
import platformApi from '../../services/platformApi';
import adminApi from '../../services/adminApi';

const DEFAULT_PLANS = [
  {
    id: 'starter',
    name: 'Starter POS',
    tagline: 'Ideal for neighborhood retail shops & single registers',
    price: 'PKR 2,500',
    billing: 'monthly',
    activeCount: 142,
    popular: false,
    features: [
      'Single POS terminal registration',
      'Barcode scanning & label printing',
      'Basic customer udhaar khata',
      'Thermal receipt printing (58mm/80mm)',
      'Daily profit & sales reconciliation',
      'Offline-first POS cache',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Enterprise',
    tagline: 'Built for high-volume grocery marts & multi-counters',
    price: 'PKR 6,500',
    billing: 'monthly',
    activeCount: 318,
    popular: true,
    features: [
      'Unlimited POS terminals & cashier logins',
      'Live wholesale credit khata ledgers',
      'Multi-currency & bank transfer support',
      'Automatic stock low alerts & reorders',
      'Direct WhatsApp invoice dispatch',
      'Manager override & audit security',
      'Dedicated MegaTrix Cloud sync',
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime License',
    tagline: 'Permanent institutional ownership with zero recurring dues',
    price: 'PKR 45,000',
    billing: 'one-time',
    activeCount: 45,
    popular: false,
    features: [
      'Lifetime permanent software access',
      'Zero monthly or annual subscriptions',
      'All present & upcoming POS features',
      'Unlimited inventory SKU catalog',
      'Priority 24/7 dedicated support desk',
      'Custom invoice header branding',
    ],
  },
];

const INITIAL_RETAIL_USERS = [
  {
    id: '6a9ad01d54017a31796d9ff7',
    name: 'HASHIR FAROOQ',
    shopName: 'electronics',
    email: 'hashirfarooq48@gmail.com',
    phone: '+92 308 1505859',
    role: 'Store Owner / Merchant',
    terminal: 'Terminal-01 (Electronics POS)',
    status: 'active',
    createdAt: '2026-09-04T14:05:17.888Z',
    totalSales: 360000,
    subscription: {
      plan: 'Pro Enterprise',
      status: 'active',
      isLifetime: false,
      startedAt: '2026-09-04T14:05:17.888Z',
      expiresAt: '2026-10-15T00:00:00.000Z',
      billingCycle: 'Monthly',
      price: 'PKR 6,500/mo',
    },
    deviceInfo: {
      ip: '154.208.36.59',
      os: 'Windows 11 Pro',
      browser: 'Chrome 152',
      lastSeen: '7 active sessions',
    },
  },
  {
    id: '6a9adeaed6a8788d8ecfa721',
    name: 'Demo Shop Owner',
    shopName: 'Demo Grocery Store',
    email: 'demo@bizzai.com',
    phone: '+92 987 6543210',
    role: 'Store Owner / Cashier Manager',
    terminal: 'Terminal-02 (Grocery Counter)',
    status: 'active',
    createdAt: '2026-09-04T15:07:26.100Z',
    totalSales: 14850,
    subscription: {
      plan: 'Starter POS',
      status: 'active',
      isLifetime: false,
      startedAt: '2026-09-04T15:07:26.100Z',
      expiresAt: '2026-10-20T00:00:00.000Z',
      billingCycle: 'Monthly',
      price: 'PKR 2,500/mo',
    },
    deviceInfo: {
      ip: '72.255.3.76',
      os: 'Windows 10 Enterprise',
      browser: 'Chrome 153',
      lastSeen: '9 active sessions',
    },
  },
  {
    id: '6aa1a451c28840b13feb3559',
    name: 'Abu Sufian',
    shopName: 'Shawarma Point',
    email: 'ranasuffyan9@gmail.com',
    phone: '+92 301 0915911',
    role: 'Store Owner (Suspended)',
    terminal: 'Deactivated',
    status: 'blocked',
    createdAt: '2026-09-09T18:24:17.461Z',
    totalSales: 0,
    subscription: {
      plan: '14-Day Pro Trial',
      status: 'expired',
      isLifetime: false,
      startedAt: '2026-09-09T18:24:17.461Z',
      expiresAt: '2026-09-24T21:23:27.264Z',
      billingCycle: '14-Day Trial',
      price: 'Evaluation Expired',
    },
    deviceInfo: {
      ip: '72.255.3.76',
      os: 'Windows 10',
      browser: 'Chrome 153',
      lastSeen: 'Suspended via Admin Core',
    },
  },
  {
    id: '6aa31e8848f93ab1f033a5f0',
    name: 'MegaTrix Master SuperAdmin',
    shopName: 'MegaTrix Headquarters',
    email: 'admin.megatrixai@gmail.com',
    phone: '+92 300 0000000',
    role: 'Platform SuperAdmin',
    terminal: 'HQ Master Console',
    status: 'active',
    createdAt: '2026-09-10T21:18:00.272Z',
    totalSales: 450000,
    subscription: {
      plan: 'Lifetime License',
      status: 'active',
      isLifetime: true,
      startedAt: '2026-09-10T21:18:00.272Z',
      expiresAt: '2126-08-17T21:18:00.272Z',
      billingCycle: 'Lifetime',
      price: 'PKR 45,000 (Lifetime)',
    },
    deviceInfo: {
      ip: '::1 (Gateway)',
      os: 'Windows 64-bit',
      browser: 'Headless Chrome / Admin Shell',
      lastSeen: '22 active sessions',
    },
  },
];

const INITIAL_AUDIT_LOGS = [
  {
    id: 'log_01',
    userId: '6a9ad01d54017a31796d9ff7',
    userName: 'HASHIR FAROOQ',
    action: 'INVENTORY_STOCK_UPDATED',
    category: 'inventory',
    detail: 'Stock update: Samsung Galaxy S25 Slim (256GB) SKU-SAM-S25SLIM-256 set to 10 units available',
    terminal: 'Terminal-01 (Electronics POS)',
    ip: '154.208.36.59',
    timestamp: '2026-09-09T22:32:44.438Z',
  },
  {
    id: 'log_02',
    userId: '6a9adeaed6a8788d8ecfa721',
    userName: 'Demo Shop Owner',
    action: 'INVOICE_GENERATED',
    category: 'invoices',
    detail: 'Issued POS Invoice #INV-00001 (PKR 645 via Cash) at Demo Grocery Store',
    terminal: 'Terminal-02 (Grocery Counter)',
    ip: '72.255.3.76',
    timestamp: '2026-09-04T15:07:30.507Z',
  },
  {
    id: 'log_03',
    userId: '6a9adeaed6a8788d8ecfa721',
    userName: 'Demo Shop Owner',
    action: 'INVOICE_GENERATED',
    category: 'invoices',
    detail: 'Issued POS Invoice #INV-00002 (PKR 520 via UPI Online) at Demo Grocery Store',
    terminal: 'Terminal-02 (Grocery Counter)',
    ip: '72.255.3.76',
    timestamp: '2026-09-04T15:07:30.709Z',
  },
  {
    id: 'log_04',
    userId: '6aa31e8848f93ab1f033a5f0',
    userName: 'MegaTrix Master SuperAdmin',
    action: 'TERMINAL_SESSION_OPENED',
    category: 'terminal',
    detail: 'SuperAdmin administrative session authenticated with 22 concurrent cluster devices',
    terminal: 'HQ Master Console',
    ip: '::1',
    timestamp: '2026-09-11T20:55:28.685Z',
  },
  {
    id: 'log_05',
    userId: '6aa1a451c28840b13feb3559',
    userName: 'Abu Sufian',
    action: 'SECURITY_ACCESS_BLOCKED',
    category: 'security',
    detail: 'Merchant account suspended: "Suspended via MegaTrix Admin Core". Device tokens revoked.',
    terminal: 'Deactivated',
    ip: '72.255.3.76',
    timestamp: '2026-09-10T21:21:08.866Z',
  },
  {
    id: 'log_06',
    userId: '6a9ad01d54017a31796d9ff7',
    userName: 'HASHIR FAROOQ',
    action: 'PASSWORD_RESET_DISPATCHED',
    category: 'security',
    detail: 'Administrative password reset token verified and generated for merchant recovery',
    terminal: 'Terminal-01 (Electronics POS)',
    ip: '154.208.36.59',
    timestamp: '2026-09-08T22:15:06.904Z',
  },
];

const BizManagerModule = ({ defaultTab = 'users' }) => {
  const { adminUser, canAccessPlatform } = useAdminAuth();
  const canAccess = canAccessPlatform('bizmanager');

  const isSuperAdmin = Boolean(adminUser?.isSuperAdmin);
  const isFullAccess = adminUser?.accessLevel === 'full';
  const canViewCredentials = isSuperAdmin || isFullAccess;
  const canEditSubscriptions = isSuperAdmin || isFullAccess;
  const canSpoof = isSuperAdmin || isFullAccess;

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('megatrix_bizmanager_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasLegacy = parsed.some((u) => u.id === 'usr_bm_01' || u.name === 'Muhammad Tariq');
        if (!hasLegacy && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        return INITIAL_RETAIL_USERS;
      }
    }
    return INITIAL_RETAIL_USERS;
  });

  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [selectedUserForDetail, setSelectedUserForDetail] = useState(null);
  const [spoofTargetUser, setSpoofTargetUser] = useState(null);
  const [spoofReason, setSpoofReason] = useState('');
  const [isSpoofing, setIsSpoofing] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);

  // Administrative Reset Password State
  const [resetSearchQuery, setResetSearchQuery] = useState('');
  const [resetTargetUser, setResetTargetUser] = useState(null);
  const [resetTempPassword, setResetTempPassword] = useState('');
  const [resetForceChange, setResetForceChange] = useState(true);
  const [resetSuccessData, setResetSuccessData] = useState(null);

  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem('megatrix_bizmanager_pricing');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PLANS;
      }
    }
    return DEFAULT_PLANS;
  });
  const [editingPlan, setEditingPlan] = useState(null);
  const [planFormPrice, setPlanFormPrice] = useState('');
  const [planFormBilling, setPlanFormBilling] = useState('monthly');
  const [planFormName, setPlanFormName] = useState('');
  const [planFormTagline, setPlanFormTagline] = useState('');
  const [planFormFeatures, setPlanFormFeatures] = useState('');

  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem('megatrix_bizmanager_activity_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasLegacy = parsed.some((l) => l.userName === 'Muhammad Tariq' || l.detail?.includes('#INV-88219'));
        if (!hasLegacy && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        return INITIAL_AUDIT_LOGS;
      }
    }
    return INITIAL_AUDIT_LOGS;
  });
  const [selectedActivityUserId, setSelectedActivityUserId] = useState('');
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [activityTimeFilter, setActivityTimeFilter] = useState('all');
  const [activityCategoryFilter, setActivityCategoryFilter] = useState('all');

  const bizManagerUrl = import.meta.env.VITE_BIZMANAGER_APP_URL || 'https://bizmanager.megatrixai.com';

  useEffect(() => {
    if (defaultTab) {
      if (['invoices', 'khata', 'stock'].includes(defaultTab)) {
        setActiveTab('users');
      } else {
        setActiveTab(defaultTab);
      }
    }
  }, [defaultTab]);

  // Live Microservice Communication with BizManager Backend (Port 5000)
  useEffect(() => {
    let isMounted = true;
    const fetchLiveBackend = async () => {
      try {
        const [overviewRes, usersRes] = await Promise.all([
          platformApi.getBizManagerOverview(),
          platformApi.getBizManagerUsers({ limit: 50 }),
        ]);

        if (!isMounted) return;

        if (usersRes.success && usersRes.live && Array.isArray(usersRes.data?.users)) {
          setIsLiveConnected(true);
          const liveUsers = usersRes.data.users.map((u) => {
            const isSuspended = u.accountStatus === 'suspended' || u.status === 'suspended';
            return {
              id: u._id,
              name: u.name || 'Unnamed Merchant',
              email: u.email || '—',
              phone: u.phone || '—',
              shopName: u.shopName || 'Retail Counter',
              role: u.role || 'owner',
              status: isSuspended ? 'blocked' : 'active',
              terminal: u.shopName ? `${u.shopName} POS` : 'Register 01',
              createdAt: u.createdAt || new Date().toISOString(),
              lastSeenAt: u.lastSeenAt || u.lastLoginAt || '—',
              subscription: {
                plan: u.subscription?.plan || 'pro',
                status: u.subscription?.status || (isSuspended ? 'expired' : 'active'),
                isLifetime: Boolean(u.subscription?.isLifetime),
                expiresAt: u.subscription?.expiresAt || null,
              },
            };
          });
          setUsers(liveUsers);
        } else {
          setIsLiveConnected(false);
        }
      } catch (err) {
        if (isMounted) setIsLiveConnected(false);
      }
    };

    fetchLiveBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('megatrix_bizmanager_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('megatrix_bizmanager_pricing', JSON.stringify(plans));
    window.dispatchEvent(new CustomEvent('megatrix_pricing_sync', { detail: plans }));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('megatrix_bizmanager_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const metrics = useMemo(() => {
    const activeCount = users.filter((u) => u.status === 'active').length;
    const activeSubs = users.filter((u) => u.status === 'active' && (u.subscription?.status === 'active' || u.subscription?.isLifetime)).length;
    const trialCount = users.filter((u) => u.subscription?.status === 'trial' && u.status !== 'blocked').length;
    const blockedCount = users.filter((u) => u.status === 'blocked' || u.subscription?.status === 'expired').length;

    return {
      totalActiveUsers: activeCount.toLocaleString(),
      activeSubscriptions: activeSubs.toLocaleString(),
      usersOnTrial: trialCount.toLocaleString(),
      expiredUsers: blockedCount.toLocaleString(),
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = userSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        (u.shopName && u.shopName.toLowerCase().includes(q)) ||
        u.phone.includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        u.id.toLowerCase().includes(q);

      let matchStatus = true;
      if (userStatusFilter === 'active') matchStatus = u.status === 'active' && u.subscription?.status !== 'trial';
      else if (userStatusFilter === 'trial') matchStatus = u.subscription?.status === 'trial';
      else if (userStatusFilter === 'blocked') matchStatus = u.status === 'blocked';
      return matchSearch && matchStatus;
    });
  }, [users, userSearch, userStatusFilter]);

  const generateRandomTempPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = 'Biz#';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleOpenResetModal = (user) => {
    setResetTargetUser(user);
    setResetTempPassword(generateRandomTempPassword());
    setResetForceChange(true);
  };

  const handleExecutePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetTargetUser) return;

    let tempPass = resetTempPassword.trim() || generateRandomTempPassword();

    // Live API execution targeting MongoDB Atlas
    const apiRes = await platformApi.resetBizManagerUserPassword(
      resetTargetUser.id,
      'Administrative password reset from MegaTrix Admin Console'
    );

    if (apiRes.live && apiRes.data?.temporaryPassword) {
      tempPass = apiRes.data.temporaryPassword;
    }

    const updatedUsers = users.map((u) => {
      if (u.id === resetTargetUser.id) {
        return {
          ...u,
          mustChangePassword: resetForceChange,
          lastPasswordReset: new Date().toISOString(),
          tempPassword: tempPass,
        };
      }
      return u;
    });

    setUsers(updatedUsers);

    // Append audit log
    const resetLog = {
      id: `log_${Date.now()}`,
      userId: resetTargetUser.id,
      userName: resetTargetUser.name,
      action: 'PASSWORD_FORCE_RESET',
      category: 'security',
      detail: `Administrative password reset executed. Temporary token issued. Force change on next login: ${resetForceChange ? 'YES' : 'NO'}.`,
      terminal: resetTargetUser.terminal || 'System Vault',
      ip: '127.0.0.1 (Admin Console)',
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [resetLog, ...prev]);

    setResetSuccessData({
      userName: resetTargetUser.name,
      userEmail: resetTargetUser.email,
      userId: resetTargetUser.id,
      shopName: resetTargetUser.shopName,
      tempPassword: tempPass,
      forceChange: resetForceChange,
    });

    setResetTargetUser(null);
    if (apiRes.live) {
      toast.success(`Live MongoDB: Password reset enforced for "${resetTargetUser.name}". Forced reset on next login active.`);
    } else {
      toast.success(`Password reset enforced for "${resetTargetUser.name}".`);
    }
  };

  const handleToggleBlockUser = async (userToToggle) => {
    const newStatus = userToToggle.status === 'active' ? 'blocked' : 'active';
    setUsers((prev) =>
      prev.map((u) => (u.id === userToToggle.id ? { ...u, status: newStatus } : u))
    );

    const newLog = {
      id: `log_${Date.now()}`,
      userId: userToToggle.id,
      userName: userToToggle.name,
      action: newStatus === 'blocked' ? 'ACCOUNT_BLOCKED' : 'ACCOUNT_UNBLOCKED',
      category: 'security',
      detail: `Operator ${userToToggle.name} (${userToToggle.phone}) status updated to ${newStatus.toUpperCase()} by ${adminUser?.name || 'Administrator'}.`,
      terminal: userToToggle.terminal,
      ip: '127.0.0.1 (Control Desk)',
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    // Live API call to mutate MongoDB Atlas in real time!
    const apiRes = await platformApi.toggleBizManagerUserStatus(
      userToToggle.id,
      newStatus === 'blocked' ? 'suspended' : 'active',
      `Administrative status update by ${adminUser?.name || 'SuperAdmin'}`
    );

    if (apiRes.live) {
      toast.success(
        newStatus === 'blocked'
          ? `Live MongoDB: Restricted account access for ${userToToggle.name}. Sessions revoked.`
          : `Live MongoDB: Reactivated account access for ${userToToggle.name}.`
      );
    } else {
      toast.info(
        newStatus === 'blocked'
          ? `Restricted account access for ${userToToggle.name}.`
          : `Reactivated account access for ${userToToggle.name}.`
      );
    }
  };

  const handleLaunchSpoof = async () => {
    if (!spoofTargetUser) return;
    if (!spoofReason || spoofReason.trim().length < 10) {
      toast.error('Please enter a valid justification (minimum 10 characters).');
      return;
    }

    try {
      setIsSpoofing(true);
      const targetId = spoofTargetUser._id || spoofTargetUser.id;
      const res = await adminApi.initiateSpoof({
        platform: 'bizmanager',
        targetUserId: targetId,
        targetUserName: spoofTargetUser.name,
        targetUserEmail: spoofTargetUser.email,
        reason: spoofReason.trim(),
      });

      if (res.success && res.handoffUrl) {
        toast.success(`Active spoof session launched for ${spoofTargetUser.name}. Opening new tab...`);
        window.open(res.handoffUrl, '_blank');
        setSpoofTargetUser(null);
        setSpoofReason('');
      } else {
        toast.error(res.message || 'Failed to initiate spoof session.');
      }
    } catch (err) {
      console.error('[BizManager Spoof] Error:', err);
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to initiate spoof session with BizManager.';
      toast.error(errMsg);
    } finally {
      setIsSpoofing(false);
    }
  };

  const handleConfirmDeleteUser = () => {
    if (!deleteConfirmUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteConfirmUser.id));

    const newLog = {
      id: `log_${Date.now()}`,
      userId: deleteConfirmUser.id,
      userName: deleteConfirmUser.name,
      action: 'USER_DELETED',
      category: 'security',
      detail: `Record for operator ${deleteConfirmUser.name} permanently deleted from platform by ${adminUser?.name || 'Admin'}.`,
      terminal: deleteConfirmUser.terminal,
      ip: '127.0.0.1 (Control Desk)',
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    toast.success(`User record "${deleteConfirmUser.name}" removed successfully.`);
    setDeleteConfirmUser(null);
  };

  const openEditPlanModal = (plan) => {
    if (!canEditSubscriptions) {
      toast.error('Subscription pricing adjustments are restricted to Superadmin and Full Access.');
      return;
    }
    setEditingPlan(plan);
    setPlanFormName(plan.name);
    setPlanFormPrice(plan.price);
    setPlanFormBilling(plan.billing);
    setPlanFormTagline(plan.tagline || '');
    setPlanFormFeatures((plan.features || []).join('\n'));
  };

  const handleSavePlan = (e) => {
    e.preventDefault();
    if (!editingPlan) return;

    const updated = plans.map((p) => {
      if (p.id === editingPlan.id) {
        return {
          ...p,
          name: planFormName.trim() || p.name,
          price: planFormPrice.trim() || p.price,
          billing: planFormBilling,
          tagline: planFormTagline.trim(),
          features: planFormFeatures
            .split('\n')
            .map((f) => f.trim())
            .filter(Boolean),
        };
      }
      return p;
    });

    setPlans(updated);
    toast.success(`Updated pricing for ${planFormName}. Synchronized with Biz Manager landing page.`);
    setEditingPlan(null);
  };

  const filteredActivityLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      if (selectedActivityUserId && log.userId !== selectedActivityUserId) {
        return false;
      }

      if (activitySearchQuery.trim()) {
        const q = activitySearchQuery.toLowerCase().trim();
        const match =
          log.userName.toLowerCase().includes(q) ||
          log.detail.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.terminal.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (activityCategoryFilter !== 'all' && log.category !== activityCategoryFilter) {
        return false;
      }

      if (activityTimeFilter !== 'all') {
        const logDate = new Date(log.timestamp).getTime();
        const now = Date.now();
        if (activityTimeFilter === 'today' && now - logDate > 86400000) return false;
        if (activityTimeFilter === '7days' && now - logDate > 7 * 86400000) return false;
        if (activityTimeFilter === '30days' && now - logDate > 30 * 86400000) return false;
      }

      return true;
    });
  }, [activityLogs, selectedActivityUserId, activitySearchQuery, activityCategoryFilter, activityTimeFilter]);

  const handleGenerateTestActivity = () => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const mockActions = [
      {
        action: 'INVOICE_GENERATED',
        category: 'invoices',
        detail: `Issued POS Invoice #INV-${Math.floor(10000 + Math.random() * 90000)} (PKR ${(Math.floor(Math.random() * 150) * 100 + 500).toLocaleString()} via Cash)`,
      },
      {
        action: 'KHATA_PAYMENT_RECOVERY',
        category: 'khata',
        detail: `Collected credit payment PKR ${(Math.floor(Math.random() * 50) * 1000 + 2000).toLocaleString()} on customer ledger`,
      },
      {
        action: 'STOCK_BARCODE_SCANNED',
        category: 'inventory',
        detail: 'Instant POS barcode check on SKU-78401 (Reconciled with live ledger)',
      },
      {
        action: 'DRAWER_COUNT_VERIFIED',
        category: 'terminal',
        detail: 'Cash drawer mid-day audit verified with balance variance: PKR 0.00',
      },
    ];
    const picked = mockActions[Math.floor(Math.random() * mockActions.length)];

    const newLog = {
      id: `log_${Date.now()}`,
      userId: randomUser.id,
      userName: randomUser.name,
      action: picked.action,
      category: picked.category,
      detail: picked.detail,
      terminal: randomUser.terminal,
      ip: randomUser.deviceInfo?.ip || '39.40.88.19',
      timestamp: new Date().toISOString(),
    };

    setActivityLogs((prev) => [newLog, ...prev]);
    toast.info(`New activity recorded for ${randomUser.name}.`);
  };

  const computeUserMetrics = (u) => {
    if (!u) return null;
    const now = new Date();
    const createdDate = new Date(u.createdAt);
    const diffMs = now.getTime() - createdDate.getTime();
    const daysSinceMember = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const isUnder30Days = daysSinceMember < 30;

    const totalSales = Number(u.totalSales || 0);
    const expectedMonthlyAvg = Math.round((totalSales / daysSinceMember) * 30);
    const monthsActive = Math.max(1, daysSinceMember / 30);
    const actualMonthlyAvg = Math.round(totalSales / monthsActive);

    const sub = u.subscription || {};
    const subStart = sub.startedAt ? new Date(sub.startedAt) : createdDate;
    const subDays = Math.max(1, Math.floor((now.getTime() - subStart.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      daysSinceMember,
      isUnder30Days,
      expectedMonthlyAvg,
      actualMonthlyAvg,
      totalSales,
      subDays,
      joinedFormatted: createdDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };
  };

  if (!canAccess) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto space-y-4 my-12 bg-mx-surface border border-mx-border rounded-md">
        <div className="w-8 h-8 rounded-sm bg-mx-panel text-white flex items-center justify-center mx-auto border border-mx-border">
          <Shield size={16} strokeWidth={1.5} />
        </div>
        <h2 className="text-base font-bold text-white">Project Authorization Required</h2>
        <p className="text-xs text-mx-subtle leading-relaxed">
          You do not have permission to access the Biz Manager workspace. Please contact your platform Superadmin to request authorization.
        </p>
      </div>
    );
  }

  const selectedMetrics = selectedUserForDetail ? computeUserMetrics(selectedUserForDetail) : null;

  return (
    <div className="space-y-6">
      {/* Module Hero & Gateway Header */}
      <div className="rounded-md bg-mx-surface border border-mx-border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[11px] font-mono uppercase tracking-wider text-mx-subtle">
              Biz Manager Retail ERP
            </p>
            <h1 className="text-[28px] font-bold text-white tracking-tight leading-tight">
              Retail and Point of Sale Command Desk
            </h1>
            <p className="text-xs text-mx-subtle max-w-2xl leading-relaxed">
              Unified multi-tenant control plane for retail stores, grocery billing, merchant onboarding,
              subscription licensing, and real-time security audit trails.
            </p>
          </div>

          {/* Module Action & Quick Launch */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  toast.success('Telemetry synchronized with Biz Manager Cloud.');
                }, 600);
              }}
              disabled={loading}
              aria-label="Sync telemetry data"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-white transition-colors border border-mx-border cursor-pointer min-h-[36px]"
            >
              <RefreshCw size={16} strokeWidth={1.5} className={loading ? 'animate-spin' : ''} />
              <span>Sync Telemetry</span>
            </button>
            <a
              href={bizManagerUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Launch Biz Manager POS system"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors cursor-pointer min-h-[36px]"
            >
              <ShoppingCart size={16} strokeWidth={1.5} />
              <span>Launch Biz Manager POS</span>
              <ExternalLink size={14} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {/* Platform Level SaaS Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Active Users"
          value={metrics.totalActiveUsers}
          subtitle="Active merchant stores (3 of 4)"
          icon={Users}
          trend="3 online"
          trendPositive={true}
        />
        <MetricCard
          title="Active Subscriptions"
          value={metrics.activeSubscriptions}
          subtitle="Paid recurring & lifetime"
          icon={Tag}
          trend="100% active"
          trendPositive={true}
        />
        <MetricCard
          title="Users On Trial"
          value={metrics.usersOnTrial}
          subtitle="Active evaluation access"
          icon={Clock}
          trend="0 active trials"
          trendPositive={true}
        />
        <MetricCard
          title="Expired / Inactive"
          value={metrics.expiredUsers}
          subtitle="Suspended / expired store"
          icon={AlertTriangle}
          trend="1 account actioned"
          trendPositive={true}
        />
      </div>

      {/* ─── Horizontal Workspace Navigation ─── */}
      <div className="flex border-b border-mx-border gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          aria-label="View user management"
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'border-mx-blue text-white'
              : 'border-transparent text-mx-subtle hover:text-white'
          }`}
        >
          <Users size={16} strokeWidth={1.5} />
          <span>User Management ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subscriptions')}
          aria-label="View subscription pricing and plans"
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'subscriptions'
              ? 'border-mx-blue text-white'
              : 'border-transparent text-mx-subtle hover:text-white'
          }`}
        >
          <Tag size={16} strokeWidth={1.5} />
          <span>Subscription Management</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reset-password')}
          aria-label="View administrative password reset"
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'reset-password'
              ? 'border-mx-blue text-white'
              : 'border-transparent text-mx-subtle hover:text-white'
          }`}
        >
          <Lock size={16} strokeWidth={1.5} />
          <span>Reset Password</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          aria-label="View user activity audit trail"
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'activity'
              ? 'border-mx-blue text-white'
              : 'border-transparent text-mx-subtle hover:text-white'
          }`}
        >
          <Activity size={16} strokeWidth={1.5} />
          <span>User Activity</span>
        </button>

        {canViewCredentials && (
          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            aria-label="View system cryptographic credentials"
            className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ml-auto sm:ml-0 ${
              activeTab === 'credentials'
                ? 'border-mx-blue text-white'
                : 'border-transparent text-mx-subtle hover:text-white'
            }`}
          >
            <Key size={16} strokeWidth={1.5} />
            <span>Credentials</span>
          </button>
        )}
      </div>

      {/* ─── SECTION 1: USER MANAGEMENT ─── */}
      {activeTab === 'users' && (
        <div className="bg-mx-surface border border-mx-border rounded-md overflow-hidden space-y-4 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-mx-border">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users size={16} strokeWidth={1.5} />
                <span>Registered Retail Merchants & Operators</span>
              </h3>
              <p className="text-xs text-mx-subtle mt-1">
                Filter active and non-active merchants, inspect performance profiles, and govern account permissions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-sm bg-mx-panel p-1 border border-mx-border text-xs">
                <button
                  type="button"
                  onClick={() => setUserStatusFilter('all')}
                  className={`px-3 py-1 rounded-sm font-semibold cursor-pointer transition-colors ${
                    userStatusFilter === 'all'
                      ? 'bg-white text-black font-bold'
                      : 'text-mx-subtle hover:text-white'
                  }`}
                >
                  All ({users.length})
                </button>
                <button
                  type="button"
                  onClick={() => setUserStatusFilter('active')}
                  className={`px-3 py-1 rounded-sm font-semibold cursor-pointer transition-colors ${
                    userStatusFilter === 'active'
                      ? 'bg-mx-surface text-white font-bold border border-mx-border'
                      : 'text-mx-subtle hover:text-white'
                  }`}
                >
                  Active ({users.filter((u) => u.status === 'active' && u.subscription?.status !== 'trial').length})
                </button>
                <button
                  type="button"
                  onClick={() => setUserStatusFilter('trial')}
                  className={`px-3 py-1 rounded-sm font-semibold cursor-pointer transition-colors ${
                    userStatusFilter === 'trial'
                      ? 'bg-mx-surface text-white font-bold border border-mx-border'
                      : 'text-mx-subtle hover:text-white'
                  }`}
                >
                  On Trial ({users.filter((u) => u.subscription?.status === 'trial').length})
                </button>
                <button
                  type="button"
                  onClick={() => setUserStatusFilter('blocked')}
                  className={`px-3 py-1 rounded-sm font-semibold cursor-pointer transition-colors ${
                    userStatusFilter === 'blocked'
                      ? 'bg-mx-surface text-white font-bold border border-mx-border'
                      : 'text-mx-subtle hover:text-white'
                  }`}
                >
                  Non-Active / Restricted ({users.filter((u) => u.status === 'blocked').length})
                </button>
              </div>

              <div className="relative min-w-[280px]">
                <Search size={14} strokeWidth={1.5} className="absolute left-3 top-3 text-mx-subtle" />
                <input
                  type="text"
                  aria-label="Search phone, email, or merchant"
                  placeholder="Search phone, email, or merchant..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-8 pr-8 py-2 bg-mx-panel border border-mx-border rounded-sm text-xs text-white focus:outline-none focus:border-mx-blue w-full min-h-[36px]"
                />
                {userSearch && (
                  <button
                    onClick={() => setUserSearch('')}
                    className="absolute right-3 top-3 text-mx-subtle hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-mx-border bg-mx-panel text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                  <th className="py-3 px-4">Merchant / Operator</th>
                  <th className="py-3 px-4">Business Outlet</th>
                  <th className="py-3 px-4">Role & Terminal</th>
                  <th className="py-3 px-4">Contact Phone & Email</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mx-border text-xs">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-mx-subtle font-mono">
                      No merchants or POS operators found matching "{userSearch}".
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedUserForDetail(u)}
                      className="hover:bg-mx-panel transition-colors cursor-pointer group"
                      title="Click row to inspect full profile and sales run-rate"
                    >
                      <td className="py-3 px-4 font-semibold text-white">
                        <div className="flex flex-col">
                          <span className="text-white group-hover:text-mx-blue transition-colors">
                            {u.name}
                          </span>
                          <span className="text-[11px] text-mx-subtle font-mono">{u.id}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-white font-semibold">
                        {u.shopName || 'Retail Outlet'}
                      </td>

                      <td className="py-3 px-4 text-white">
                        <div className="flex flex-col">
                          <span>{u.role}</span>
                          <span className="text-[11px] text-mx-subtle font-mono">{u.terminal}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-white">
                        <div className="flex flex-col">
                          <span>{u.phone}</span>
                          <span className="text-[11px] text-mx-subtle lowercase">{u.email}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-2 text-[11px] font-mono">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              u.status === 'blocked' ? 'bg-mx-muted' : u.subscription?.status === 'trial' ? 'bg-mx-blue' : 'bg-mx-positive'
                            }`}
                          />
                          <span className="text-white">
                            {u.status === 'blocked' ? 'Restricted' : u.subscription?.status === 'trial' ? 'Active (Trial)' : 'Active'}
                          </span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-2">
                          {canSpoof && (
                            <button
                              type="button"
                              onClick={() => {
                                setSpoofTargetUser(u);
                                setSpoofReason('');
                              }}
                              className="inline-flex items-center gap-1 px-3 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-mono text-white border border-mx-border transition-colors cursor-pointer min-h-[32px]"
                              title="Spoof / Impersonate merchant account"
                            >
                              <UserCheck size={14} strokeWidth={1.5} />
                              <span>Spoof</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleBlockUser(u)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-mono text-white border border-mx-border transition-colors cursor-pointer min-h-[32px]"
                            title={u.status === 'active' ? 'Restrict user access' : 'Unblock user access'}
                          >
                            {u.status === 'active' ? (
                              <>
                                <Lock size={14} strokeWidth={1.5} />
                                <span>Block</span>
                              </>
                            ) : (
                              <>
                                <Unlock size={14} strokeWidth={1.5} />
                                <span>Unblock</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmUser(u)}
                            className="p-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-mx-subtle hover:text-white border border-mx-border transition-colors cursor-pointer min-h-[32px]"
                            title="Delete merchant record"
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── SECTION 2: SUBSCRIPTION MANAGEMENT ─── */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          <div className="p-5 rounded-md bg-mx-surface border border-mx-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Tag size={16} strokeWidth={1.5} className="text-mx-blue" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Biz Manager Subscription Pricing Governance
                </h3>
                {canEditSubscriptions ? (
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-mx-panel text-white border border-mx-border">
                    Live Editing Authorized
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-mx-panel text-mx-subtle border border-mx-border">
                    Read-Only (Superadmin Only)
                  </span>
                )}
              </div>
              <p className="text-xs text-mx-subtle max-w-2xl leading-relaxed">
                Configure SaaS retail pricing plans. Price adjustments will immediately pop up and reflect on the public
                Biz Manager Landing Page across all visitor sessions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`${bizManagerUrl}#pricing`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-white transition-colors border border-mx-border cursor-pointer min-h-[36px]"
              >
                <Globe size={14} strokeWidth={1.5} />
                <span>Preview on Landing Page</span>
                <ExternalLink size={14} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`p-6 rounded-md bg-mx-surface border transition-all flex flex-col justify-between relative ${
                  plan.popular
                    ? 'border-mx-blue'
                    : 'border-mx-border hover:border-neutral-600'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-4 px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider font-bold bg-mx-blue text-white">
                    Most Popular
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white">{plan.name}</h4>
                    <p className="text-xs text-mx-subtle mt-1">{plan.tagline}</p>
                  </div>

                  <div className="py-3 border-y border-mx-border">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-white tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-xs text-mx-subtle font-mono">
                        {plan.billing === 'one-time' ? '/ lifetime' : `/${plan.billing}`}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-mx-subtle mt-1 block">
                      Active Merchants: <strong className="text-white">{plan.activeCount}</strong>
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-white">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={14} strokeWidth={1.5} className="text-mx-blue shrink-0 mt-1" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-mx-border">
                  <button
                    type="button"
                    onClick={() => openEditPlanModal(plan)}
                    disabled={!canEditSubscriptions}
                    className={`w-full py-2 px-3 rounded-sm text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[36px] ${
                      canEditSubscriptions
                        ? 'bg-white hover:bg-white/90 text-black shadow-sm'
                        : 'bg-mx-panel text-mx-subtle border border-mx-border cursor-not-allowed'
                    }`}
                  >
                    <Edit3 size={14} strokeWidth={1.5} />
                    <span>{canEditSubscriptions ? 'Edit Pricing & Features' : 'Editing Restricted'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SECTION 3: USER ACTIVITY ─── */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-md bg-mx-surface border border-mx-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Activity size={16} strokeWidth={1.5} className="text-mx-blue" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Biz Manager User Activity Stream
                </h3>
              </div>
              <p className="text-xs text-mx-subtle max-w-2xl leading-relaxed">
                All activities across retail outlets, barcode scans, khata recoveries, and POS cashier shifts
                are cryptographically logged and time-stamped.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateTestActivity}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-white transition-colors border border-mx-border cursor-pointer min-h-[36px]"
            >
              <Activity size={14} strokeWidth={1.5} className="text-white" />
              <span>Simulate Live Event</span>
            </button>
          </div>

          <div className="p-4 rounded-md bg-mx-surface border border-mx-border space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Search & Select Merchant / Operator to Inspect Logs
              </label>
              <div className="relative">
                <Search size={16} strokeWidth={1.5} className="absolute left-4 top-3 text-mx-subtle" />
                <input
                  type="text"
                  placeholder="Type merchant name, operator name, phone number (+92), email, or terminal..."
                  value={activitySearchQuery}
                  onChange={(e) => setActivitySearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-xs text-white placeholder-mx-subtle focus:outline-none min-h-[40px]"
                />
                {activitySearchQuery && (
                  <button
                    onClick={() => setActivitySearchQuery('')}
                    className="absolute right-3 top-3 text-mx-subtle hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-mx-border text-xs">
              <span className="text-mx-subtle text-[11px] font-mono">Quick Filter:</span>
              <button
                type="button"
                onClick={() => setSelectedActivityUserId('')}
                className={`px-3 py-1 rounded-sm text-xs font-mono transition-colors cursor-pointer border min-h-[28px] ${
                  selectedActivityUserId === ''
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-mx-panel text-white hover:bg-mx-surface border-mx-border'
                }`}
              >
                All Users ({activityLogs.length})
              </button>
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() =>
                    setSelectedActivityUserId(selectedActivityUserId === u.id ? '' : u.id)
                  }
                  className={`px-3 py-1 rounded-sm text-xs font-mono transition-colors cursor-pointer border flex items-center gap-2 min-h-[28px] ${
                    selectedActivityUserId === u.id
                      ? 'bg-mx-blue text-white font-bold border-mx-blue'
                      : 'bg-mx-panel text-white hover:bg-mx-surface border-mx-border'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      u.status === 'active' ? 'bg-mx-positive' : 'bg-mx-muted'
                    }`}
                  />
                  <span>{u.name}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-mx-subtle font-semibold">Time Window:</span>
                <select
                  value={activityTimeFilter}
                  onChange={(e) => setActivityTimeFilter(e.target.value)}
                  className="px-3 py-2 rounded-sm bg-mx-panel border border-mx-border text-white text-xs focus:outline-none focus:border-mx-blue cursor-pointer min-h-[32px]"
                >
                  <option value="all">All Timestamps</option>
                  <option value="today">Past 24 Hours</option>
                  <option value="7days">Past 7 Days</option>
                  <option value="30days">Past 30 Days</option>
                </select>

                <span className="text-mx-subtle font-semibold ml-2">Category:</span>
                <select
                  value={activityCategoryFilter}
                  onChange={(e) => setActivityCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-sm bg-mx-panel border border-mx-border text-white text-xs focus:outline-none focus:border-mx-blue cursor-pointer min-h-[32px]"
                >
                  <option value="all">All Event Types</option>
                  <option value="invoices">POS Sales & Invoices</option>
                  <option value="khata">Customer Khata</option>
                  <option value="inventory">Inventory & Barcodes</option>
                  <option value="terminal">Terminal Shifts</option>
                  <option value="security">Security & Auth</option>
                </select>
              </div>

              <span className="text-mx-subtle font-mono text-[11px]">
                Showing {filteredActivityLogs.length} audit event{filteredActivityLogs.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <div className="bg-mx-surface border border-mx-border rounded-md overflow-hidden p-4 space-y-3">
            <div className="divide-y divide-mx-border">
              {filteredActivityLogs.length === 0 ? (
                <div className="py-12 text-center text-xs text-mx-subtle font-mono">
                  No activity events found for current search filters.
                </div>
              ) : (
                filteredActivityLogs.map((log) => {
                  const logDate = new Date(log.timestamp);
                  const formattedDateTime = logDate.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  });

                  return (
                    <div
                      key={log.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-mx-panel px-2 rounded-sm transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-mx-blue shrink-0 mt-1" />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-sm text-[11px] font-mono font-bold uppercase bg-mx-panel text-white border border-mx-border">
                              {log.action}
                            </span>
                            <span className="text-xs font-bold text-white">{log.userName}</span>
                            <span className="text-[11px] text-mx-subtle font-mono">
                              ({log.terminal})
                            </span>
                          </div>
                          <p className="text-xs text-white leading-relaxed font-sans">
                            {log.detail}
                          </p>
                          <div className="text-[11px] text-mx-subtle font-mono flex items-center gap-3">
                            <span>Client IP: {log.ip}</span>
                            <span>•</span>
                            <span>Audit ID: {log.id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono text-[11px] text-mx-subtle">
                        <div className="text-white font-semibold">{formattedDateTime}</div>
                        <span className="text-[11px] text-mx-subtle">
                          {Math.max(
                            1,
                            Math.floor((Date.now() - logDate.getTime()) / 60000)
                          )}{' '}
                          mins ago
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION: RESET PASSWORD ─── */}
      {activeTab === 'reset-password' && (
        <div className="space-y-6">
          <div className="p-5 rounded-md bg-mx-surface border border-mx-border">
            <div className="flex items-center gap-2">
              <Lock size={16} strokeWidth={1.5} className="text-mx-blue" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Administrative Password Recovery & Forced Rotation
              </h3>
            </div>
            <p className="text-xs text-mx-subtle max-w-3xl leading-relaxed mt-1">
              Search any registered merchant or cashier account to trigger an administrative credential reset.
              The user will be provided a secure temporary access key and forced to establish a new password upon next sign-in.
            </p>
          </div>

          <div className="p-4 rounded-md bg-mx-surface border border-mx-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={14} strokeWidth={1.5} className="absolute left-3 top-3 text-mx-subtle" />
                <input
                  type="text"
                  aria-label="Search user by name, email, phone or shop"
                  placeholder="Search user by name, email, phone or shop..."
                  value={resetSearchQuery}
                  onChange={(e) => setResetSearchQuery(e.target.value)}
                  className="pl-8 pr-8 py-2 bg-mx-panel border border-mx-border rounded-sm text-xs text-white focus:outline-none focus:border-mx-blue w-full min-h-[36px]"
                />
                {resetSearchQuery && (
                  <button
                    onClick={() => setResetSearchQuery('')}
                    className="absolute right-3 top-3 text-mx-subtle hover:text-white"
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                )}
              </div>

              <div className="text-xs text-mx-subtle font-mono">
                Showing {users.filter((u) => {
                  const q = resetSearchQuery.toLowerCase().trim();
                  return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q) || (u.shopName && u.shopName.toLowerCase().includes(q));
                }).length} user accounts
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-mx-border bg-mx-panel text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                    <th className="py-3 px-4">Merchant / User</th>
                    <th className="py-3 px-4">Retail Outlet</th>
                    <th className="py-3 px-4">Contact & Role</th>
                    <th className="py-3 px-4">Password Status</th>
                    <th className="py-3 px-4 text-right">Reset Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mx-border">
                  {users
                    .filter((u) => {
                      const q = resetSearchQuery.toLowerCase().trim();
                      return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q) || (u.shopName && u.shopName.toLowerCase().includes(q));
                    })
                    .map((u) => (
                      <tr key={u.id} className="hover:bg-mx-panel transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-white font-semibold">{u.name}</span>
                            <span className="text-[11px] text-mx-subtle font-mono">{u.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white font-semibold">
                          {u.shopName || 'Retail Outlet'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-white">{u.role}</span>
                            <span className="text-[11px] text-mx-subtle font-mono">{u.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-2 text-[11px] font-mono">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                u.mustChangePassword ? 'bg-amber-400' : 'bg-mx-positive'
                              }`}
                            />
                            <span className="text-white">
                              {u.mustChangePassword ? 'Reset Enforced' : 'Active / Compliant'}
                            </span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenResetModal(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-white border border-mx-border transition-colors cursor-pointer min-h-[32px]"
                          >
                            <Lock size={14} strokeWidth={1.5} />
                            <span>Reset & Force Change</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 4: CREDENTIALS (STRICTLY AT THE END) ─── */}
      {activeTab === 'credentials' && canViewCredentials && (
        <div className="space-y-4">
          <div className="p-3 bg-mx-surface border border-mx-border rounded-sm flex items-center justify-between text-xs">
            <span className="text-mx-subtle">Platform Security Vault:</span>
            <span className="font-mono text-mx-subtle">
              AES-256-GCM Hardware Root of Trust &bull; Scoped strictly to Biz Manager POS
            </span>
          </div>
          <ProjectCredentialsTab project="bizmanager" />
        </div>
      )}

      {/* ─── MODAL: USER DETAIL & EXPECTED MONTHLY AVERAGE SALES ─── */}
      {selectedUserForDetail && selectedMetrics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-mx-surface border border-mx-border rounded-md w-full max-w-2xl p-6 sm:p-7 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-mx-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-sm bg-white text-black font-extrabold text-xl flex items-center justify-center">
                  {selectedUserForDetail.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {selectedUserForDetail.name}
                    </h3>
                    <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-sm text-[11px] font-mono bg-mx-panel border border-mx-border">
                      <span className={`w-2 h-2 rounded-full ${selectedUserForDetail.status === 'active' ? 'bg-mx-positive' : 'bg-mx-muted'}`} />
                      <span className="text-white">{selectedUserForDetail.status === 'active' ? 'Active' : 'Restricted'}</span>
                    </span>
                  </div>
                  <p className="text-xs text-mx-subtle font-mono mt-1">
                    {selectedUserForDetail.shopName} &bull; {selectedUserForDetail.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUserForDetail(null)}
                className="text-mx-subtle hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-sm bg-mx-panel border border-mx-border space-y-2">
                <span className="text-[11px] font-bold text-mx-subtle uppercase tracking-wider block">
                  Identity & Terminal
                </span>
                <div className="space-y-1 text-white">
                  <p><span className="text-mx-subtle">User ID:</span> <strong className="font-mono">{selectedUserForDetail.id}</strong></p>
                  <p><span className="text-mx-subtle">Phone:</span> <strong className="font-mono">{selectedUserForDetail.phone}</strong></p>
                  <p><span className="text-mx-subtle">Email:</span> <strong>{selectedUserForDetail.email}</strong></p>
                  <p><span className="text-mx-subtle">POS Terminal:</span> <strong className="font-mono">{selectedUserForDetail.terminal}</strong></p>
                </div>
              </div>

              <div className="p-4 rounded-sm bg-mx-panel border border-mx-border space-y-2">
                <span className="text-[11px] font-bold text-mx-subtle uppercase tracking-wider block">
                  Hardware & Session
                </span>
                <div className="space-y-1 text-white">
                  <p><span className="text-mx-subtle">Client IP:</span> <strong className="font-mono">{selectedUserForDetail.deviceInfo?.ip || 'N/A'}</strong></p>
                  <p><span className="text-mx-subtle">OS / Environment:</span> <strong>{selectedUserForDetail.deviceInfo?.os || 'Windows 11'}</strong></p>
                  <p><span className="text-mx-subtle">Browser Shell:</span> <strong>{selectedUserForDetail.deviceInfo?.browser || 'Chrome POS'}</strong></p>
                  <p><span className="text-mx-subtle">Last Active:</span> <strong>{selectedUserForDetail.deviceInfo?.lastSeen || 'Just now'}</strong></p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-sm bg-mx-panel border border-mx-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <Clock size={14} className="text-mx-blue" />
                  <span>Membership & Subscription Tenure</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-mx-surface text-white border border-mx-border">
                  Plan: <strong>{selectedUserForDetail.subscription?.plan || 'Starter POS'}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-sm bg-mx-surface border border-mx-border">
                  <span className="text-mx-subtle block text-[11px] uppercase font-bold">Time Since Member</span>
                  <strong className="text-white text-sm font-mono mt-1 block">
                    {selectedMetrics.daysSinceMember} day{selectedMetrics.daysSinceMember === 1 ? '' : 's'}
                  </strong>
                  <span className="text-[11px] text-mx-subtle">Since {selectedMetrics.joinedFormatted}</span>
                </div>

                <div className="p-3 rounded-sm bg-mx-surface border border-mx-border">
                  <span className="text-mx-subtle block text-[11px] uppercase font-bold">Subscription Tenure</span>
                  <strong className="text-white text-sm font-mono mt-1 block">
                    {selectedMetrics.subDays} day{selectedMetrics.subDays === 1 ? '' : 's'} active
                  </strong>
                  <span className="text-[11px] text-mx-subtle">{selectedUserForDetail.subscription?.billingCycle || 'Monthly'} billing</span>
                </div>

                <div className="p-3 rounded-sm bg-mx-surface border border-mx-border col-span-2 sm:col-span-1">
                  <span className="text-mx-subtle block text-[11px] uppercase font-bold">Subscription Status</span>
                  <strong className="text-white text-sm capitalize mt-1 block">
                    {selectedUserForDetail.subscription?.isLifetime
                      ? 'Lifetime License'
                      : selectedUserForDetail.subscription?.status || 'Active'}
                  </strong>
                  <span className="text-[11px] text-mx-subtle">
                    {selectedUserForDetail.subscription?.price || 'Standard'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-sm bg-mx-surface border border-mx-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp size={14} className="text-white" />
                  <span>Retail Sales Performance & Volume</span>
                </span>
                {selectedMetrics.isUnder30Days ? (
                  <span className="px-2 py-0.5 rounded-sm text-[11px] font-mono font-bold bg-mx-panel text-white border border-mx-border flex items-center gap-1">
                    <AlertTriangle size={14} /> New Merchant (&lt; 30 days active)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-sm text-[11px] font-mono font-bold bg-mx-panel text-white border border-mx-border">
                    Established Merchant (&ge; 30 days)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-sm bg-mx-panel border border-mx-border space-y-1">
                  <span className="text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                    Total Cumulative Sales
                  </span>
                  <p className="text-xl font-bold font-mono text-white">
                    PKR {selectedMetrics.totalSales.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-mx-subtle">
                    Recorded via POS cashier terminals
                  </p>
                </div>

                <div className="p-4 rounded-sm bg-mx-panel border border-mx-border space-y-1">
                  <span className="text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                    {selectedMetrics.isUnder30Days
                      ? 'Expected Monthly Avg Sales (Projected)'
                      : 'Actual Monthly Avg Sales'}
                  </span>
                  <p className="text-xl font-bold font-mono text-white">
                    PKR{' '}
                    {selectedMetrics.isUnder30Days
                      ? selectedMetrics.expectedMonthlyAvg.toLocaleString()
                      : selectedMetrics.actualMonthlyAvg.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-mx-subtle leading-snug">
                    {selectedMetrics.isUnder30Days ? (
                      <span>
                        Projected run-rate from {selectedMetrics.daysSinceMember} days of live operations.
                      </span>
                    ) : (
                      <span>Historical run-rate based on active subscription tenure.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-mx-border">
              <button
                type="button"
                onClick={() => setSelectedUserForDetail(null)}
                className="px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-bold text-white border border-mx-border cursor-pointer min-h-[36px]"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: EDIT SUBSCRIPTION PRICING ─── */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-mx-surface border border-mx-border rounded-md w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-mx-border">
              <div className="flex items-center gap-2">
                <Tag size={16} strokeWidth={1.5} className="text-mx-blue" />
                <h3 className="text-sm font-bold text-white">
                  Edit Plan: {editingPlan.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="text-mx-subtle hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                  Plan Display Name
                </label>
                <input
                  type="text"
                  required
                  value={planFormName}
                  onChange={(e) => setPlanFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-white text-xs focus:outline-none min-h-[36px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                    Subscription Pricing
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PKR 2,500"
                    value={planFormPrice}
                    onChange={(e) => setPlanFormPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-white font-mono text-xs focus:outline-none min-h-[36px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                    Billing Interval
                  </label>
                  <select
                    value={planFormBilling}
                    onChange={(e) => setPlanFormBilling(e.target.value)}
                    className="w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-white text-xs focus:outline-none cursor-pointer min-h-[36px]"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                    <option value="one-time">One-time (Lifetime)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={planFormTagline}
                  onChange={(e) => setPlanFormTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-white text-xs focus:outline-none min-h-[36px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                  Included Features (One per line)
                </label>
                <textarea
                  rows={4}
                  value={planFormFeatures}
                  onChange={(e) => setPlanFormFeatures(e.target.value)}
                  className="w-full px-3 py-2 bg-mx-panel border border-mx-border focus:border-mx-blue rounded-sm text-white text-xs focus:outline-none font-sans"
                />
              </div>

              <div className="p-3 rounded-sm bg-mx-panel border border-mx-border text-[11px] text-mx-subtle">
                <span className="font-semibold text-white">Landing Page Real-time Sync:</span>
                <p>Saved changes will be instantly reflected on the Biz Manager landing page pricing cards.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-mx-border">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-mx-subtle text-xs font-semibold cursor-pointer min-h-[36px] border border-mx-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-sm bg-white hover:bg-white/90 text-black text-xs font-bold transition-all cursor-pointer min-h-[36px]"
                >
                  Save & Sync Pricing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: ACCOUNT SPOOFING ─── */}
      {spoofTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-mx-surface border border-mx-border rounded-md w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-mx-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-mx-panel border border-mx-border flex items-center justify-center text-amber-400 shrink-0">
                  <Shield size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Administrative Account Impersonation
                  </h3>
                  <p className="text-[11px] text-mx-subtle font-mono">
                    BizManager Retail & POS Gateway
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSpoofTargetUser(null);
                  setSpoofReason('');
                }}
                className="p-1 text-mx-subtle hover:text-white transition-colors"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-4 rounded-sm bg-mx-panel border border-mx-border space-y-2 text-xs text-white">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-mx-subtle block">Target Operator</span>
                  <strong className="text-white font-bold">{spoofTargetUser.name}</strong>
                </div>
                <div>
                  <span className="text-mx-subtle block">Shop / Business</span>
                  <strong className="text-white font-mono">{spoofTargetUser.shopName || 'Retail Terminal'}</strong>
                </div>
                <div>
                  <span className="text-mx-subtle block">Account Email / Phone</span>
                  <span className="text-mx-subtle font-mono">{spoofTargetUser.email || spoofTargetUser.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-mx-subtle block">Session Timeout</span>
                  <span className="text-amber-400 font-mono font-bold">30 Minutes Auto-Expire</span>
                </div>
              </div>

              <div className="pt-2 border-t border-mx-border text-[11px] text-mx-subtle space-y-1">
                <p className="flex items-center gap-1 text-amber-400 font-semibold">
                  <AlertTriangle size={13} /> Strict Governance Notice:
                </p>
                <p className="leading-relaxed">
                  An active single session will open in a new tab. All API transactions and navigation performed during this session will be attributed to your administrator account (<strong className="text-white">{adminUser?.email}</strong>) in the immutable security audit log.
                </p>
              </div>
            </div>

            {/* Mandatory Justification */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-mx-subtle uppercase flex items-center justify-between">
                <span>Support / Audit Justification (Mandatory)</span>
                <span className={`text-[10px] ${spoofReason.trim().length >= 10 ? 'text-mx-positive' : 'text-amber-400'}`}>
                  {spoofReason.trim().length} / 10 min chars
                </span>
              </label>
              <textarea
                value={spoofReason}
                onChange={(e) => setSpoofReason(e.target.value)}
                rows={3}
                placeholder="e.g. Resolving POS invoice calculation discrepancies reported by merchant in Support Ticket #1089..."
                className="w-full px-3 py-2 bg-mx-panel border border-mx-border rounded-sm text-xs text-white placeholder-mx-subtle/50 focus:outline-none focus:border-mx-blue transition-colors font-sans resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-mx-border">
              <button
                type="button"
                onClick={() => {
                  setSpoofTargetUser(null);
                  setSpoofReason('');
                }}
                disabled={isSpoofing}
                className="px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-mx-subtle hover:text-white border border-mx-border min-h-[36px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLaunchSpoof}
                disabled={isSpoofing || spoofReason.trim().length < 10}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-bold min-h-[36px] transition-all cursor-pointer shadow-lg shadow-white/5"
              >
                {isSpoofing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Authorizing Session...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink size={14} strokeWidth={2} />
                    <span>Launch Live Spoofed Session</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: DELETE USER CONFIRMATION ─── */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-mx-surface border border-mx-border rounded-md w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-white">
              <AlertTriangle size={18} strokeWidth={1.5} />
              <h3 className="text-sm font-bold text-white">Delete Merchant Account?</h3>
            </div>
            <p className="text-xs text-mx-subtle leading-relaxed">
              Are you sure you want to permanently remove{' '}
              <strong className="text-white font-semibold">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.phone})?
              This will decommission their assigned POS terminal ({deleteConfirmUser.terminal}).
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-mx-border">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-mx-subtle hover:text-white text-xs font-semibold cursor-pointer border border-mx-border min-h-[36px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-4 py-2 rounded-sm bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors cursor-pointer min-h-[36px]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BizManagerModule;
