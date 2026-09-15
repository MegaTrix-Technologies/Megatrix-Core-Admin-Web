/**
 * MegaTrix Autonomous Core Engine (Local Standalone Storage)
 * ═════════════════════════════════════════════════════════
 * Allows MegaTrix Admin Core to run 100% autonomously or seamlessly
 * integrate with Live Gateways (Ports 5000, 5001, 5173, 5174).
 *
 * CRITICAL ARCHITECTURAL ENFORCEMENT:
 * Each platform maintains its own strictly isolated users and subscriptions.
 * Biz Manager merchants cannot access School Manager without registering a school tenant.
 */

const STORAGE_KEY_USERS = 'megatrix_autonomous_users_v2';
const STORAGE_KEY_OUTBOX = 'megatrix_mailerx_outbox_v1';

// Initial pre-seeded accounts cleanly partitioned by platformId
const INITIAL_USERS = [
  // ─── BIZ MANAGER PLATFORM USERS (RETAIL & POS) ───────────────────────────
  {
    _id: 'usr_biz_001',
    platformId: 'bizmanager',
    name: 'Muhammad Bilal',
    email: 'bilal.electronics@gmail.com',
    phone: '+92 300 1234567',
    shopName: 'Bilal Electronics & Hardware',
    role: 'owner',
    accountStatus: 'active',
    subscription: {
      plan: 'pro',
      status: 'active',
      isLifetime: false,
      startedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 60 * 86400000).toISOString(),
      assignedBy: 'superadmin',
      history: [
        {
          plan: 'pro',
          changedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
          changedBy: 'admin.megatrixai@gmail.com',
          note: 'Annual Pro Subscription Activated via Bank Transfer',
        },
      ],
    },
    lastLoginIp: '182.185.132.40',
    lastActiveOS: 'Windows 11',
    lastActiveBrowser: 'Chrome 122',
    lastSeenAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 65 * 86400000).toISOString(),
  },
  {
    _id: 'usr_biz_002',
    platformId: 'bizmanager',
    name: 'Zubair Khan',
    email: 'zubair.mart@gmail.com',
    phone: '+92 321 9876543',
    shopName: 'Karachi Super Mart',
    role: 'owner',
    accountStatus: 'active',
    subscription: {
      plan: 'starter',
      status: 'active',
      isLifetime: false,
      startedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 24 * 86400000).toISOString(),
      assignedBy: 'system',
      history: [],
    },
    lastLoginIp: '39.40.88.19',
    lastActiveOS: 'Android 14',
    lastActiveBrowser: 'Chrome Mobile',
    lastSeenAt: new Date(Date.now() - 15 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    _id: 'usr_biz_003',
    platformId: 'bizmanager',
    name: 'Hamza Tariq',
    email: 'hamza@tariqautos.pk',
    phone: '+92 333 4455667',
    shopName: 'Tariq Auto Spares',
    role: 'owner',
    accountStatus: 'active',
    subscription: {
      plan: 'starter',
      status: 'active',
      isLifetime: false,
      startedAt: new Date(Date.now() - 28 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 2 * 86400000).toISOString(),
      assignedBy: 'superadmin',
      history: [],
    },
    lastLoginIp: '110.39.12.78',
    lastActiveOS: 'macOS Sonoma',
    lastActiveBrowser: 'Safari 17',
    lastSeenAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  {
    _id: 'usr_biz_004',
    platformId: 'bizmanager',
    name: 'Usman Farooq',
    email: 'usman.metro@gmail.com',
    phone: '+92 345 5566778',
    shopName: 'Metro Cash & Carry Partner',
    role: 'owner',
    accountStatus: 'suspended',
    subscription: {
      plan: 'pro',
      status: 'expired',
      isLifetime: false,
      startedAt: new Date(Date.now() - 120 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      assignedBy: 'system',
      history: [],
    },
    lastLoginIp: '175.107.199.12',
    lastActiveOS: 'Windows 10',
    lastActiveBrowser: 'Edge 121',
    lastSeenAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
  },
  {
    _id: 'usr_biz_005',
    platformId: 'bizmanager',
    name: 'Ali Raza',
    email: 'ali.raza@pharmacare.pk',
    phone: '+92 312 8899001',
    shopName: 'Raza Pharmacy & Wellness',
    role: 'owner',
    accountStatus: 'active',
    subscription: {
      plan: 'lifetime',
      status: 'active',
      isLifetime: true,
      startedAt: new Date(Date.now() - 200 * 86400000).toISOString(),
      expiresAt: null,
      assignedBy: 'superadmin',
      history: [],
    },
    lastLoginIp: '202.47.38.10',
    lastActiveOS: 'Windows 11',
    lastActiveBrowser: 'Chrome 122',
    lastSeenAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 200 * 86400000).toISOString(),
  },

  // ─── SCHOOL MANAGER PLATFORM USERS (INSTITUTIONAL SAAS) ───────────────────
  {
    _id: 'sch_usr_001',
    platformId: 'schoolmanager',
    name: 'Al-Noor Grammar School',
    email: 'admin@alnoor.edu.pk',
    phone: '+92 42 35889900',
    shopName: 'ANG Main Campus (Code: ANG001)',
    schoolCode: 'ANG001',
    principalName: 'Prof. Muhammad Usman',
    role: 'school_admin',
    accountStatus: 'active',
    subscription: {
      plan: 'campus_pro',
      status: 'active',
      isLifetime: false,
      startedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 320 * 86400000).toISOString(),
      assignedBy: 'superadmin',
      history: [
        {
          plan: 'campus_pro',
          changedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
          changedBy: 'admin.megatrixai@gmail.com',
          note: 'Annual Multi-Branch School License Activated',
        },
      ],
    },
    enrolledStudents: 850,
    activeFaculty: 30,
    lastLoginIp: '39.40.102.88',
    lastActiveOS: 'Windows 11',
    lastActiveBrowser: 'Chrome 122',
    lastSeenAt: new Date(Date.now() - 10 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    _id: 'sch_usr_002',
    platformId: 'schoolmanager',
    name: 'Sufi School System',
    email: 'ranasuffyan9@gmail.com',
    phone: '+92 300 9876543',
    shopName: 'Sufi Campus Lahore (Code: E001)',
    schoolCode: 'E001',
    principalName: 'Suffyan Rana',
    role: 'school_admin',
    accountStatus: 'active',
    subscription: {
      plan: 'campus_basic',
      status: 'active',
      isLifetime: false,
      startedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 160 * 86400000).toISOString(),
      assignedBy: 'superadmin',
      history: [],
    },
    enrolledStudents: 420,
    activeFaculty: 18,
    lastLoginIp: '182.185.110.22',
    lastActiveOS: 'macOS Sonoma',
    lastActiveBrowser: 'Chrome 122',
    lastSeenAt: new Date(Date.now() - 45 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    _id: 'sch_usr_003',
    platformId: 'schoolmanager',
    name: 'Crescent Model Higher Secondary',
    email: 'principal@crescent.edu.pk',
    phone: '+92 42 111 273 723',
    shopName: 'Shadman Campus (Code: CMS002)',
    schoolCode: 'CMS002',
    principalName: 'Dr. Tariq Mehmood',
    role: 'school_admin',
    accountStatus: 'active',
    subscription: {
      plan: 'campus_enterprise',
      status: 'active',
      isLifetime: false,
      startedAt: new Date(Date.now() - 180 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 185 * 86400000).toISOString(),
      assignedBy: 'superadmin',
      history: [],
    },
    enrolledStudents: 2200,
    activeFaculty: 72,
    lastLoginIp: '110.39.44.18',
    lastActiveOS: 'Windows 11',
    lastActiveBrowser: 'Edge 121',
    lastSeenAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
  },
  {
    _id: 'sch_usr_004',
    platformId: 'schoolmanager',
    name: 'Lahore Grammar School Phase 5',
    email: 'admin@lgs5.edu.pk',
    phone: '+92 42 35741234',
    shopName: 'DHA Phase 5 Campus (Code: LGS005)',
    schoolCode: 'LGS005',
    principalName: 'Mrs. Ayesha Malik',
    role: 'school_admin',
    accountStatus: 'active',
    subscription: {
      plan: 'campus_pro',
      status: 'active',
      isLifetime: false,
      startedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 275 * 86400000).toISOString(),
      assignedBy: 'superadmin',
      history: [],
    },
    enrolledStudents: 1450,
    activeFaculty: 52,
    lastLoginIp: '39.40.12.90',
    lastActiveOS: 'macOS Sequoia',
    lastActiveBrowser: 'Safari 17',
    lastSeenAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  {
    _id: 'sch_usr_005',
    platformId: 'schoolmanager',
    name: 'City Public Academy',
    email: 'cityacademy@gmail.com',
    phone: '+92 321 4455889',
    shopName: 'Model Town Campus (Code: CPA009)',
    schoolCode: 'CPA009',
    principalName: 'Hafiz Bilal Ahmed',
    role: 'school_admin',
    accountStatus: 'active',
    subscription: {
      plan: 'campus_basic',
      status: 'trial',
      isLifetime: false,
      startedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 25 * 86400000).toISOString(),
      assignedBy: 'system',
      history: [],
    },
    enrolledStudents: 310,
    activeFaculty: 14,
    lastLoginIp: '182.185.77.30',
    lastActiveOS: 'Android 14',
    lastActiveBrowser: 'Chrome Mobile',
    lastSeenAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

// Initial MailerX Outbox records
const INITIAL_OUTBOX = [
  {
    _id: 'mlx_001',
    source: 'School Manager',
    recipient: 'hashmi.parent@gmail.com',
    subject: 'Fee Challan Due Notification - Grade 1 (ANG001)',
    template: 'School Fee Challan Due Alert',
    status: 'delivered',
    sentAt: new Date(Date.now() - 15 * 60000).toISOString(),
    openRate: 'Opened (1m ago)',
    relayServer: 'smtp-relay.brevo.com:587',
  },
  {
    _id: 'mlx_002',
    source: 'Biz Manager',
    recipient: 'customer.tariq@gmail.com',
    subject: 'Sales Tax Invoice & Receipt #INV-2026-904',
    template: 'POS Sales Receipt',
    status: 'delivered',
    sentAt: new Date(Date.now() - 35 * 60000).toISOString(),
    openRate: 'Delivered',
    relayServer: 'smtp-relay.brevo.com:587',
  },
  {
    _id: 'mlx_003',
    source: 'Global Platform',
    recipient: 'admin.megatrixai@gmail.com',
    subject: 'SuperAdmin Session Security Alert - Port 5175 Access',
    template: 'Security Login Alert',
    status: 'delivered',
    sentAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    openRate: 'Opened',
    relayServer: 'smtp-relay.brevo.com:587',
  },
  {
    _id: 'mlx_004',
    source: 'School Manager',
    recipient: 'ranasuffyan9@gmail.com',
    subject: 'Welcome to SchoolHub Pro - Sufi School System Activated',
    template: 'New School Tenant Welcome',
    status: 'delivered',
    sentAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    openRate: 'Opened',
    relayServer: 'smtp-relay.brevo.com:587',
  },
  {
    _id: 'mlx_005',
    source: 'Biz Manager',
    recipient: 'bilal.electronics@gmail.com',
    subject: 'Monthly Ledger Khata Balance Statement',
    template: 'Khata Statement Digest',
    status: 'delivered',
    sentAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    openRate: 'Delivered',
    relayServer: 'smtp-relay.brevo.com:587',
  },
];

// Storage helpers
const getUsersStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
};

const saveUsersStore = (users) => {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to persist users store:', e);
  }
};

const getOutboxStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OUTBOX);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_OUTBOX, JSON.stringify(INITIAL_OUTBOX));
      return INITIAL_OUTBOX;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_OUTBOX;
  }
};

const saveOutboxStore = (records) => {
  try {
    localStorage.setItem(STORAGE_KEY_OUTBOX, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to persist outbox store:', e);
  }
};

export const autonomousEngine = {
  // 1. Authentication
  login: async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // Master SuperAdmin credentials verification
    const isMaster =
      (cleanEmail === 'admin.megatrixai@gmail.com' ||
        cleanEmail === 'admin.megatrix@gmail.com' ||
        cleanEmail === 'admin@megatrixai.com') &&
      password === 'Orangeman235!';

    if (!isMaster) {
      throw new Error('Invalid SuperAdmin credentials. Access rejected.');
    }

    return {
      token: 'megatrix_auth_jwt_superadmin_autonomous_session_' + Date.now(),
      refreshToken: 'megatrix_refresh_token_' + Date.now(),
      user: {
        id: 'master_superadmin_core',
        name: 'Master SuperAdmin',
        email: cleanEmail,
        role: 'superadmin',
        shopName: 'MegaTrix HQ Command',
        createdAt: new Date('2026-01-01').toISOString(),
      },
    };
  },

  // 2. Dashboard Overview (Platform-Scoped or Aggregate)
  getOverview: async (platformId = null) => {
    const allUsers = getUsersStore();
    const users = platformId ? allUsers.filter((u) => u.platformId === platformId) : allUsers;
    const now = Date.now();
    const oneDayAgo = now - 86400000;
    const sevenDaysFuture = now + 7 * 86400000;

    let activeToday = 0;
    let activePaidSubs = 0;
    let activeTrials = 0;
    let expiringSoon = 0;
    let suspendedUsers = 0;

    users.forEach((u) => {
      if (u.accountStatus === 'suspended') {
        suspendedUsers++;
      }

      if (u.lastSeenAt && new Date(u.lastSeenAt).getTime() > oneDayAgo) {
        activeToday++;
      }

      const sub = u.subscription || {};
      if (sub.isLifetime) {
        activePaidSubs++;
      } else if (sub.status === 'trial') {
        activeTrials++;
      } else if (sub.status === 'active' && sub.plan !== 'trial') {
        activePaidSubs++;
      }

      if (
        !sub.isLifetime &&
        sub.expiresAt &&
        new Date(sub.expiresAt).getTime() > now &&
        new Date(sub.expiresAt).getTime() <= sevenDaysFuture
      ) {
        expiringSoon++;
      }
    });

    return {
      success: true,
      stats: {
        totalUsers: users.length,
        activeToday,
        activePaidSubs,
        activeTrials,
        expiringSoon,
        suspendedUsers,
      },
      recentUsers: users.slice(0, 5),
    };
  },

  // 3. Platform-Scoped User Management (Strict Isolation)
  getUsers: async (params = {}) => {
    const allUsers = getUsersStore();
    let filtered = [...allUsers];

    // Filter strictly by active platform if requested
    if (params.platformId && params.platformId !== 'all') {
      filtered = filtered.filter((u) => u.platformId === params.platformId);
    }

    // Search filter
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.shopName && u.shopName.toLowerCase().includes(q)) ||
          (u.schoolCode && u.schoolCode.toLowerCase().includes(q)) ||
          (u.phone && u.phone.includes(q))
      );
    }

    // Account status filter
    if (params.accountStatus && params.accountStatus !== 'all') {
      filtered = filtered.filter((u) => u.accountStatus === params.accountStatus);
    }

    // Subscription status filter
    if (params.subscriptionStatus && params.subscriptionStatus !== 'all') {
      filtered = filtered.filter((u) => {
        if (params.subscriptionStatus === 'lifetime') return u.subscription?.isLifetime;
        return u.subscription?.status === params.subscriptionStatus;
      });
    }

    const page = parseInt(params.page, 10) || 1;
    const limit = parseInt(params.limit, 10) || 15;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      users: paginated,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
      },
    };
  },

  // 4. Toggle User Status (Block / Unblock)
  toggleUserStatus: async (userId, status, reason) => {
    const users = getUsersStore();
    const idx = users.findIndex((u) => u._id === userId);
    if (idx === -1) throw new Error('User not found.');

    users[idx].accountStatus = status;
    if (reason) {
      users[idx].statusReason = reason;
    }
    saveUsersStore(users);

    return {
      success: true,
      message: `User status changed to ${status}`,
      user: users[idx],
    };
  },

  // 5. Update Subscription
  updateSubscription: async (userId, data) => {
    const users = getUsersStore();
    const idx = users.findIndex((u) => u._id === userId);
    if (idx === -1) throw new Error('User not found.');

    const currentSub = users[idx].subscription || {};
    const newPlan = data.plan || currentSub.plan || 'starter';
    const isLifetime = Boolean(data.isLifetime);
    const expiresAt = isLifetime ? null : data.expiresAt || currentSub.expiresAt;

    users[idx].subscription = {
      ...currentSub,
      plan: newPlan,
      status: 'active',
      isLifetime,
      expiresAt,
      assignedBy: 'superadmin',
      history: [
        ...(currentSub.history || []),
        {
          plan: newPlan,
          changedAt: new Date().toISOString(),
          changedBy: 'admin.megatrixai@gmail.com',
          note: data.note || 'Subscription adjusted by SuperAdmin',
        },
      ],
    };

    saveUsersStore(users);

    return {
      success: true,
      message: 'Subscription updated successfully',
      user: users[idx],
    };
  },

  // 6. Delete User
  deleteUser: async (userId) => {
    const users = getUsersStore();
    const filtered = users.filter((u) => u._id !== userId);
    saveUsersStore(filtered);

    return {
      success: true,
      message: 'User deleted permanently',
    };
  },

  // 7. Integrated Biz Manager Module Summary
  getBizManagerSummary: async () => {
    return {
      success: true,
      metrics: {
        todaySales: 'PKR 342,850',
        activeCustomers: 480,
        inventorySkus: 1420,
        khataReceivables: 'PKR 184,200',
        cashInHand: 'PKR 95,400',
        terminalsOnline: 3,
      },
      recentInvoices: [
        { id: 'INV-1092', customer: 'Haji Aslam Grocers', amount: 14800, payment: 'Cash', date: 'Just now' },
        { id: 'INV-1091', customer: 'Walk-in Retailer', amount: 3200, payment: 'Cash', date: '12m ago' },
        { id: 'INV-1090', customer: 'Chaudhry Akram Store', amount: 48500, payment: 'Credit (Khata)', date: '35m ago' },
        { id: 'INV-1089', customer: 'Bismillah General Store', amount: 21000, payment: 'Bank Transfer', date: '1h ago' },
      ],
      khataDebtors: [
        { name: 'Chaudhry Akram Store', phone: '0300-8811223', balance: 'PKR 64,500', status: 'Pending Due' },
        { name: 'Al-Madina Milk Shop', phone: '0321-9922334', balance: 'PKR 32,800', status: 'Follow Up' },
        { name: 'Rana Brothers Mart', phone: '0333-7744112', balance: 'PKR 48,000', status: 'Due Today' },
      ],
      lowStockAlerts: [
        { item: 'Basmati Rice 25kg (Grade A)', current: 4, min: 20, unit: 'Bags' },
        { item: 'Cooking Oil 5L Tin', current: 6, min: 25, unit: 'Tins' },
        { item: 'White Sugar 50kg Sack', current: 2, min: 10, unit: 'Sacks' },
      ],
    };
  },

  // 8. Integrated School Manager Module Summary
  getSchoolManagerSummary: async () => {
    return {
      success: true,
      metrics: {
        registeredCampuses: 5,
        totalStudentsEnrolled: 5230,
        activeFaculty: 186,
        monthlyFeeRecovery: '96.2%',
        totalChallansIssued: 'PKR 16.4M',
        pendingAdmissions: 24,
      },
      campuses: [
        { code: 'ANG001', name: 'Al-Noor Grammar School', principal: 'Prof. Muhammad Usman', students: 850, faculty: 30, status: 'Active' },
        { code: 'E001', name: 'Sufi School System', principal: 'Suffyan Rana', students: 420, faculty: 18, status: 'Active' },
        { code: 'CMS002', name: 'Crescent Model Higher Secondary', principal: 'Dr. Tariq Mehmood', students: 2200, faculty: 72, status: 'Active' },
        { code: 'LGS005', name: 'Lahore Grammar School Phase 5', principal: 'Mrs. Ayesha Malik', students: 1450, faculty: 52, status: 'Active' },
        { code: 'CPA009', name: 'City Public Academy', principal: 'Hafiz Bilal Ahmed', students: 310, faculty: 14, status: 'Trial' },
      ],
      academicLevels: [
        { grade: 'Pre-Nursery to Prep', sections: 6, students: 680, incharge: 'Mrs. Saira Bano' },
        { grade: 'Primary (Grade 1 - 5)', sections: 15, students: 1840, incharge: 'Mrs. Maryam Khan' },
        { grade: 'Middle (Grade 6 - 8)', sections: 9, students: 1420, incharge: 'Mr. Tariq Mehmood' },
        { grade: 'Matric / High (Grade 9 - 10)', sections: 6, students: 1290, incharge: 'Mr. Muhammad Usman' },
      ],
    };
  },

  // 9. Shared MailerX Service Methods
  getMailerXTelemetry: async () => {
    const outbox = getOutboxStore();
    return {
      success: true,
      telemetry: {
        totalDispatched: 14890 + outbox.length,
        inFlightQueue: 4,
        deliveredRate: '99.4%',
        bouncedCount: 14,
        spamComplaintRate: '< 0.01%',
        activeSmtpHost: 'smtp-relay.brevo.com:587',
        senderIdentity: 'sales@megatrixai.com',
      },
      templates: [
        { id: 'tpl_otp', name: 'Password Reset OTP Verification', category: 'Authentication', variables: ['name', 'code', 'expiry'] },
        { id: 'tpl_challan', name: 'School Fee Challan Due Reminder', category: 'School Manager', variables: ['studentName', 'challanNo', 'amount', 'dueDate'] },
        { id: 'tpl_receipt', name: 'POS Retail Invoice Receipt', category: 'Biz Manager', variables: ['storeName', 'invoiceNo', 'total', 'date'] },
        { id: 'tpl_welcome', name: 'New Tenant Welcome Onboarding', category: 'Global Core', variables: ['tenantName', 'adminEmail', 'portalUrl'] },
        { id: 'tpl_alert', name: 'SuperAdmin Security Login Alert', category: 'Global Security', variables: ['ip', 'browser', 'os', 'timestamp'] },
      ],
      outbox: outbox.slice(0, 15),
    };
  },

  sendMailerXTest: async (payload) => {
    const outbox = getOutboxStore();
    const newRecord = {
      _id: 'mlx_' + Date.now().toString().slice(-5),
      source: payload.source || 'Global Core',
      recipient: payload.recipient,
      subject: payload.subject || 'MailerX Relay Verification',
      template: payload.template || 'Custom Direct Dispatch',
      status: 'delivered',
      sentAt: new Date().toISOString(),
      openRate: 'Delivered',
      relayServer: 'smtp-relay.brevo.com:587',
    };

    outbox.unshift(newRecord);
    saveOutboxStore(outbox);

    return {
      success: true,
      message: `Test email successfully routed through MailerX Relay to ${payload.recipient}`,
      record: newRecord,
    };
  },
};
