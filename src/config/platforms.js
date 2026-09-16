/**
 * MegaTrix Multi-SaaS Platform Registry
 * Exclusively registers the TWO connected SaaS platforms:
 * 1. School Hub (SMS)
 * 2. Biz Manager (BIZ)
 */
export const PLATFORMS = [
  {
    id: 'schoolhub',
    aliasId: 'schoolmanager',
    name: 'School Hub',
    code: 'SHB',
    tagline: 'Institutional Multi-Campus School ERP',
    description: 'Unified multi-tenant school operating system with 3-copy bank challans, student directories, timetable clash audit, and campus governance.',
    apiUrl: import.meta.env.VITE_SCHOOLMANAGER_API_URL || 'https://api-schoolhub.megatrixai.com/api',
    appUrl: import.meta.env.VITE_SCHOOLMANAGER_APP_URL || 'https://schoolhub.megatrixai.com',
    color: 'sky',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    status: 'active',
    version: 'v3.0.0 Pro',
    isExposed: true,
    capabilities: {
      userManagement: true,
      subscriptionManagement: true,
      institutionalIsolation: true,
      threeCopyChallans: true,
      rolePortals: true,
      timetableAudit: true,
    },
    quickStats: {
      category: 'Education SaaS',
      defaultTrialDays: 30,
      currency: 'PKR',
      accountType: 'Institutional School Code',
    },
    subscriptionPlans: [
      { id: 'campus_basic', name: 'Single Campus', price: 'PKR 12,000/mo', features: ['Up to 500 Students', '3-Copy Challans', 'Admin & Teacher Portals'] },
      { id: 'campus_pro', name: 'Multi-Branch Pro', price: 'PKR 25,000/mo', features: ['Up to 2,500 Students', 'Parent App', 'Staff HR & Payroll', 'SMS Gateway'] },
      { id: 'campus_enterprise', name: 'Group of Schools', price: 'PKR 55,000/mo', features: ['Unlimited Campuses', 'Centralized Accounts', 'Custom Branding'] },
    ],
  },
  {
    id: 'bizmanager',
    aliasId: 'bizmanager',
    name: 'Biz Manager',
    code: 'BIZ',
    tagline: 'Retail POS & Grocery Billing ERP',
    description: 'Enterprise point of sale, inventory tracking, debtor khata, and cash/bank ledger management for retail stores.',
    apiUrl: import.meta.env.VITE_BIZMANAGER_API_URL || 'https://bizmanager.megatrixai.com',
    appUrl: import.meta.env.VITE_BIZMANAGER_APP_URL || 'https://bizmanager.megatrixai.com',
    color: 'emerald',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    status: 'active',
    version: 'v2.4.0',
    isExposed: true,
    capabilities: {
      userManagement: true,
      subscriptionManagement: true,
      deviceTracking: true,
      posInvoicing: true,
      khataLedgers: true,
      instantBlock: true,
    },
    quickStats: {
      category: 'Retail & POS ERP',
      defaultTrialDays: 14,
      currency: 'PKR',
      accountType: 'Merchant / Store Owner',
    },
    subscriptionPlans: [
      { id: 'starter', name: 'Starter POS', price: 'PKR 2,500/mo', features: ['1 Terminal', 'Up to 500 SKUs', 'Basic Khata'] },
      { id: 'pro', name: 'Pro Enterprise', price: 'PKR 6,500/mo', features: ['Unlimited Terminals', 'Barcode Scanner', 'Bank & Loan Ledgers'] },
      { id: 'lifetime', name: 'Lifetime License', price: 'PKR 45,000 once', features: ['Permanent Access', 'All Features', 'Priority Support'] },
    ],
  },
];

export const EXPOSED_PORTALS = PLATFORMS;

export const getDefaultPlatform = () => PLATFORMS[0];

export const getPlatformById = (id) => {
  if (!id) return getDefaultPlatform();
  const normalized = id.toLowerCase();
  return (
    PLATFORMS.find(
      (p) =>
        p.id.toLowerCase() === normalized ||
        (p.aliasId && p.aliasId.toLowerCase() === normalized)
    ) || getDefaultPlatform()
  );
};
