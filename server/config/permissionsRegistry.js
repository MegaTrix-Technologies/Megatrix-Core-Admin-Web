/**
 * MegaTrix Canonical Permission Registry
 * Defines all supported Platforms, Modules, Resources, and valid Actions.
 * Designed to be fully extensible for future MegaTrix products.
 */

export const PERMISSION_REGISTRY = {
  global: {
    id: 'global',
    name: 'Global Platform Admin',
    description: 'Central system administration, tenancy, security, and governance',
    modules: {
      users: {
        id: 'users',
        name: 'User Management',
        resources: {
          directory: {
            id: 'directory',
            name: 'User Directory & Profiles',
            actions: ['view', 'create', 'edit', 'suspend', 'disable', 'export', 'assign_permissions'],
          },
        },
      },
      roles: {
        id: 'roles',
        name: 'Roles & Permissions',
        resources: {
          role_matrix: {
            id: 'role_matrix',
            name: 'Role Definitions & Policies',
            actions: ['view', 'create', 'edit', 'delete'],
          },
        },
      },
      audit: {
        id: 'audit',
        name: 'Audit Trail & Compliance',
        resources: {
          logs: {
            id: 'logs',
            name: 'System Audit Logs',
            actions: ['view', 'export'],
          },
        },
      },
      settings: {
        id: 'settings',
        name: 'System Settings',
        resources: {
          configuration: {
            id: 'configuration',
            name: 'Global Configuration & Keys',
            actions: ['view', 'manage'],
          },
        },
      },
    },
  },

  bizmanager: {
    id: 'bizmanager',
    name: 'Biz Manager (Retail POS & ERP)',
    description: 'Retail point of sale, barcode billing, khata ledgers, and inventory',
    modules: {
      sales: {
        id: 'sales',
        name: 'Sales & POS Terminal',
        resources: {
          invoices: {
            id: 'invoices',
            name: 'Sales Invoices & Receipts',
            actions: ['view', 'create', 'edit', 'delete', 'export'],
          },
        },
      },
      customers: {
        id: 'customers',
        name: 'Customer Khata (Udhaar)',
        resources: {
          khata: {
            id: 'khata',
            name: 'Customer Ledger Accounts',
            actions: ['view', 'create', 'edit', 'delete', 'export'],
          },
        },
      },
      inventory: {
        id: 'inventory',
        name: 'Inventory & Stock Management',
        resources: {
          products: {
            id: 'products',
            name: 'Product Catalog & Barcodes',
            actions: ['view', 'create', 'edit', 'delete'],
          },
        },
      },
      loans: {
        id: 'loans',
        name: 'Loans & Cash Register',
        resources: {
          cash_desk: {
            id: 'cash_desk',
            name: 'Cash In Hand & Bank Ledgers',
            actions: ['view', 'create', 'approve', 'delete'],
          },
        },
      },
    },
  },

  schoolmanager: {
    id: 'schoolmanager',
    name: 'School Manager (Educational ERP)',
    description: 'Institutional multi-campus management, 4-role portals, and 3-copy fee challans',
    modules: {
      schools: {
        id: 'schools',
        name: 'School & Tenant Lifecycle',
        resources: {
          directory: {
            id: 'directory',
            name: 'Institutional Directory & Tenancy',
            actions: ['view', 'create', 'edit', 'block', 'reactivate', 'delete', 'export'],
          },
        },
      },
      users: {
        id: 'users',
        name: 'Global School Users',
        resources: {
          directory: {
            id: 'directory',
            name: 'Cross-School User Directory',
            actions: ['view', 'create', 'edit', 'block', 'reactivate', 'reset_password', 'export'],
          },
        },
      },
      activity: {
        id: 'activity',
        name: 'Activity & Audit Monitoring',
        resources: {
          logs: {
            id: 'logs',
            name: 'Cross-School Security & Operations Trail',
            actions: ['view', 'export'],
          },
        },
      },
      metrics: {
        id: 'metrics',
        name: 'Telemetry & Usage',
        resources: {
          telemetry: {
            id: 'telemetry',
            name: 'Cross-School Metrics & Capacity',
            actions: ['view', 'export'],
          },
        },
      },
      students: {
        id: 'students',
        name: 'Students & Admissions',
        resources: {
          student_records: {
            id: 'student_records',
            name: 'Student Profiles & Enrollment',
            actions: ['view', 'create', 'edit', 'delete', 'export'],
          },
        },
      },
      faculty: {
        id: 'faculty',
        name: 'Faculty & Staff HR',
        resources: {
          staff_roster: {
            id: 'staff_roster',
            name: 'Teacher & Staff Profiles',
            actions: ['view', 'create', 'edit', 'delete'],
          },
        },
      },
      challans: {
        id: 'challans',
        name: '3-Copy Bank Fee Challans',
        resources: {
          fee_bills: {
            id: 'fee_bills',
            name: 'Fee Challans & Vouchers',
            actions: ['view', 'create', 'edit', 'print'],
          },
        },
      },
      academics: {
        id: 'academics',
        name: 'Academics & Timetables',
        resources: {
          classes: {
            id: 'classes',
            name: 'Class Wings & Grading',
            actions: ['view', 'create', 'edit'],
          },
        },
      },
    },
  },

  mailerx: {
    id: 'mailerx',
    name: 'MailerX Communication Relay',
    description: 'Shared high-deliverability transactional email dispatcher and templates',
    modules: {
      outbox: {
        id: 'outbox',
        name: 'Outbox & Delivery Logs',
        resources: {
          messages: {
            id: 'messages',
            name: 'Dispatched Email Logs',
            actions: ['view', 'export'],
          },
        },
      },
      templates: {
        id: 'templates',
        name: 'Transactional Templates',
        resources: {
          blueprints: {
            id: 'blueprints',
            name: 'Email HTML Templates',
            actions: ['view', 'edit'],
          },
        },
      },
      relay: {
        id: 'relay',
        name: 'SMTP Relay Dispatcher',
        resources: {
          engine: {
            id: 'engine',
            name: 'Live Brevo Dispatcher',
            actions: ['dispatch'],
          },
        },
      },
    },
  },
};

/**
 * Returns a flat array of all valid permission strings in the form:
 * "platform:module:resource:action"
 */
export function getAllPermissionKeys() {
  const keys = [];
  for (const plat of Object.values(PERMISSION_REGISTRY)) {
    for (const mod of Object.values(plat.modules)) {
      for (const res of Object.values(mod.resources)) {
        for (const act of res.actions) {
          keys.push(`${plat.id}:${mod.id}:${res.id}:${act}`);
        }
      }
    }
  }
  return keys;
}

export const ALL_PERMISSION_KEYS = getAllPermissionKeys();
export const PERMISSIONS_REGISTRY = PERMISSION_REGISTRY;
