import React, { useState, useEffect } from 'react';
import {
  FiChevronDown,
  FiChevronRight,
  FiCheckSquare,
  FiSquare,
  FiShield,
  FiSearch,
  FiLayers,
} from 'react-icons/fi';
import adminApi from '../services/adminApi';

const DEFAULT_REGISTRY = {
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
          entries: {
            id: 'entries',
            name: 'Cash Register Ledger',
            actions: ['view', 'create', 'edit'],
          },
        },
      },
    },
  },
  schoolmanager: {
    id: 'schoolmanager',
    name: 'School Manager (Campus ERP)',
    description: 'Multi-campus SIS, student enrollment, fee collections, and governance',
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
        name: 'Student Information System',
        resources: {
          profiles: {
            id: 'profiles',
            name: 'Student Roster & Admissions',
            actions: ['view', 'create', 'edit', 'delete', 'export'],
          },
        },
      },
      fees: {
        id: 'fees',
        name: 'Fee Management & Billing',
        resources: {
          challans: {
            id: 'challans',
            name: 'Fee Challans & Receipts',
            actions: ['view', 'create', 'edit', 'collect', 'export'],
          },
        },
      },
      staff: {
        id: 'staff',
        name: 'Staff & Faculty Management',
        resources: {
          teachers: {
            id: 'teachers',
            name: 'Teacher Records & Payroll',
            actions: ['view', 'create', 'edit', 'delete'],
          },
        },
      },
      exams: {
        id: 'exams',
        name: 'Exams & Gradebook',
        resources: {
          results: {
            id: 'results',
            name: 'Exam Marks & Report Cards',
            actions: ['view', 'create', 'edit', 'publish'],
          },
        },
      },
    },
  },
  mailerx: {
    id: 'mailerx',
    name: 'MailerX Delivery Relay',
    description: 'Brevo transactional email routing, telemetry, and deliverability tracking',
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
 * GranularPermissionBuilder
 * Meta Business Manager-style permission hierarchy selector.
 * 
 * Props:
 * - selectedPermissions: Array of strings ("platform:module:resource:action")
 * - onChange: Function(newArrayOfStrings)
 * - allowedPlatforms: Optional Array of allowed platforms (e.g. ['bizmanager'])
 * - readOnly: Boolean
 */
const GranularPermissionBuilder = ({
  selectedPermissions = [],
  onChange,
  allowedPlatforms = null,
  readOnly = false,
}) => {
  const [registry, setRegistry] = useState(DEFAULT_REGISTRY);
  const [openPlatforms, setOpenPlatforms] = useState({ global: true, bizmanager: true });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRegistry = async () => {
      try {
        const res = await adminApi.getPermissionsRegistry();
        if (res.success && res.registry) {
          setRegistry(res.registry);
        }
      } catch (err) {
        console.warn('[PermissionBuilder] Using default canonical registry:', err.message);
      }
    };
    fetchRegistry();
  }, []);

  const selectedSet = new Set(selectedPermissions || []);

  const togglePlatformAccordion = (platId) => {
    setOpenPlatforms((prev) => ({ ...prev, [platId]: !prev[platId] }));
  };

  const isChecked = (key) => selectedSet.has(key) || selectedSet.has('*');

  const toggleAction = (key) => {
    if (readOnly) return;
    const nextSet = new Set(selectedSet);
    if (nextSet.has(key)) {
      nextSet.delete(key);
    } else {
      nextSet.add(key);
    }
    onChange && onChange(Array.from(nextSet));
  };

  const toggleAllInResource = (platId, modId, resId, actions) => {
    if (readOnly) return;
    const keys = actions.map((act) => `${platId}:${modId}:${resId}:${act}`);
    const allSelected = keys.every((k) => selectedSet.has(k));
    const nextSet = new Set(selectedSet);

    if (allSelected) {
      keys.forEach((k) => nextSet.delete(k));
    } else {
      keys.forEach((k) => nextSet.add(k));
    }
    onChange && onChange(Array.from(nextSet));
  };

  const toggleAllInPlatform = (platId) => {
    if (readOnly) return;
    const plat = registry[platId];
    if (!plat) return;

    const allKeys = [];
    for (const mod of Object.values(plat.modules)) {
      for (const res of Object.values(mod.resources)) {
        for (const act of res.actions) {
          allKeys.push(`${platId}:${mod.id}:${res.id}:${act}`);
        }
      }
    }

    const allSelected = allKeys.every((k) => selectedSet.has(k));
    const nextSet = new Set(selectedSet);

    if (allSelected) {
      allKeys.forEach((k) => nextSet.delete(k));
    } else {
      allKeys.forEach((k) => nextSet.add(k));
    }
    onChange && onChange(Array.from(nextSet));
  };

  // Filter platforms based on allowedPlatforms prop
  const platformEntries = Object.entries(registry).filter(([platId]) => {
    if (!allowedPlatforms || allowedPlatforms.length === 0) return true;
    if (allowedPlatforms.includes('global')) return true;
    return allowedPlatforms.includes(platId);
  });

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <FiShield className="w-5 h-5 text-emerald-400" />
          <div>
            <h4 className="text-sm font-bold text-white">Granular Permission Matrix</h4>
            <p className="text-xs text-white/50">
              {selectedSet.has('*')
                ? 'Full Root Access (All Permissions Granted)'
                : `${selectedSet.size} active permissions assigned`}
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs" />
          <input
            type="text"
            placeholder="Search capabilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Platform Accordions */}
      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
        {platformEntries.map(([platId, plat]) => {
          const isOpen = openPlatforms[platId] ?? false;

          // Count selected in platform
          let platTotal = 0;
          let platSelected = 0;
          for (const mod of Object.values(plat.modules)) {
            for (const res of Object.values(mod.resources)) {
              for (const act of res.actions) {
                platTotal++;
                if (selectedSet.has(`${platId}:${mod.id}:${res.id}:${act}`) || selectedSet.has('*')) {
                  platSelected++;
                }
              }
            }
          }

          return (
            <div
              key={platId}
              className="bg-black/40 border border-white/10 rounded-xl overflow-hidden transition-colors"
            >
              {/* Platform Header */}
              <div
                className="flex items-center justify-between px-4 py-3 bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer border-b border-white/5"
                onClick={() => togglePlatformAccordion(platId)}
              >
                <div className="flex items-center gap-2.5">
                  {isOpen ? (
                    <FiChevronDown className="text-white/60 text-sm" />
                  ) : (
                    <FiChevronRight className="text-white/60 text-sm" />
                  )}
                  <FiLayers className="text-emerald-400 text-sm" />
                  <span className="text-sm font-semibold text-white">{plat.name}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                    {platSelected}/{platTotal} granted
                  </span>
                </div>

                {!readOnly && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAllInPlatform(platId);
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 transition-all"
                  >
                    {platSelected === platTotal ? 'Deselect Platform' : 'Select All'}
                  </button>
                )}
              </div>

              {/* Modules & Resources */}
              {isOpen && (
                <div className="p-4 space-y-4 bg-black/20">
                  {Object.entries(plat.modules).map(([modId, mod]) => {
                    return (
                      <div
                        key={modId}
                        className="bg-white/[0.02] border border-white/5 rounded-lg p-3 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400/90">
                            {mod.name}
                          </h5>
                        </div>

                        {/* Resources */}
                        <div className="space-y-2.5">
                          {Object.entries(mod.resources).map(([resId, res]) => {
                            const resKeys = res.actions.map(
                              (act) => `${platId}:${modId}:${resId}:${act}`
                            );
                            const allResSelected =
                              resKeys.every((k) => selectedSet.has(k)) || selectedSet.has('*');

                            // Search filter
                            const visibleActions = res.actions.filter((act) => {
                              if (!searchQuery.trim()) return true;
                              const q = searchQuery.toLowerCase();
                              return (
                                act.toLowerCase().includes(q) ||
                                res.name.toLowerCase().includes(q) ||
                                mod.name.toLowerCase().includes(q) ||
                                plat.name.toLowerCase().includes(q)
                              );
                            });

                            if (visibleActions.length === 0) return null;

                            return (
                              <div
                                key={resId}
                                className="bg-black/30 border border-white/5 rounded-lg p-2.5 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-white/80">
                                    {res.name}
                                  </span>
                                  {!readOnly && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleAllInResource(platId, modId, resId, res.actions)
                                      }
                                      className="text-[10px] text-white/40 hover:text-white/80 font-medium"
                                    >
                                      {allResSelected ? 'Clear' : 'Select All'}
                                    </button>
                                  )}
                                </div>

                                {/* Action Chips / Checkboxes */}
                                <div className="flex flex-wrap gap-2">
                                  {visibleActions.map((act) => {
                                    const key = `${platId}:${modId}:${resId}:${act}`;
                                    const active = isChecked(key);

                                    return (
                                      <button
                                        key={act}
                                        type="button"
                                        disabled={readOnly}
                                        onClick={() => toggleAction(key)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                                          active
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950'
                                            : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/20'
                                        } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                                      >
                                        {active ? (
                                          <FiCheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                                        ) : (
                                          <FiSquare className="w-3.5 h-3.5 text-white/30" />
                                        )}
                                        <span className="capitalize">{act}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GranularPermissionBuilder;
