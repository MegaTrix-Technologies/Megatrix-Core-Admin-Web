import axios from 'axios';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { AccountSnapshot } from '../../models/AccountSnapshot.js';
import { AccountSyncLog } from '../../models/AccountSyncLog.js';

const LEADHUNTER_API_URL = process.env.LEADHUNTER_API_URL || 'http://localhost:5000';
const SERVICE_KEY = process.env.MEGATRIX_SERVICE_SECRET || 'megatrix_core_internal_service_key_2026';

const apiClient = axios.create({
  baseURL: LEADHUNTER_API_URL.replace(/\/$/, ''),
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'x-megatrix-service-key': SERVICE_KEY,
  },
});

/**
 * Accesses live LeadHunter database directly on the shared MongoDB Atlas cluster
 */
const getLeadHunterDb = () => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      return mongoose.connection.useDb('leadhunter', { useCache: true });
    }
  } catch (err) {
    console.warn('[leadHunterService] Error resolving leadhunter database:', err.message);
  }
  return null;
};

export const leadHunterService = {
  /**
   * Health Check of LeadHunter integration
   */
  getHealth: async () => {
    try {
      const res = await apiClient.get('/api/admin-integration/health');
      if (res.data && res.data.success) {
        return {
          success: true,
          status: 'operational',
          mode: 'api_gateway',
          service: res.data.service || 'LeadHunter Admin Gateway',
          timestamp: new Date().toISOString(),
        };
      }
    } catch {
      // Fallback: Check direct MongoDB Atlas database
      const db = getLeadHunterDb();
      if (db) {
        return {
          success: true,
          status: 'operational',
          mode: 'atlas_direct_fallback',
          service: 'LeadHunter Live Atlas Database',
          timestamp: new Date().toISOString(),
        };
      }
    }

    return {
      success: false,
      status: 'offline',
      mode: 'disconnected',
      message: 'LeadHunter service and database are currently unreachable.',
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Fetch live or cached financial telemetry
   */
  getTelemetry: async (options = {}) => {
    const startTime = Date.now();
    const syncId = `sync_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    let mode = 'api_gateway';
    let dataPayload = null;

    // 1. Try Primary: LeadHunter API Gateway
    try {
      const res = await apiClient.get('/api/admin-integration/accounts-telemetry', {
        params: options.params || {},
      });

      if (res.data && res.data.success) {
        dataPayload = res.data;
        mode = 'api_gateway';
      }
    } catch (apiErr) {
      console.warn(`[leadHunterService] API Gateway unavailable (${apiErr.message}). Engaging Atlas Direct Fallback...`);
    }

    // 2. Fallback: Query MongoDB Atlas Directly
    if (!dataPayload) {
      const db = getLeadHunterDb();
      if (db) {
        try {
          mode = 'atlas_direct_fallback';
          const [sales, inflows, expenses, projects, users] = await Promise.all([
            db.collection('sales').find().sort({ closedAt: -1 }).toArray(),
            db.collection('inflows').find().sort({ date: -1 }).toArray(),
            db.collection('expenses').find().sort({ date: -1 }).toArray(),
            db.collection('projects').find().sort({ createdAt: -1 }).toArray(),
            db.collection('users').find({ status: 'active' }).toArray(),
          ]);

          // Compute commissions from raw records
          const userCommissionSummary = users.map((u) => {
            const rates = u.commissionRates || { leadGenPercent: 0, closerPercent: 0, developerPercent: 0 };
            const completedSales = sales.filter(
              (s) =>
                s.status === 'payment_completed' &&
                (s.remainingAmount === 0 || s.remainingAmount === undefined) &&
                s.isProjectDelivered === true &&
                ((s.leadGeneratedBy && s.leadGeneratedBy.toString() === u._id.toString()) ||
                  (s.closedBy && s.closedBy.toString() === u._id.toString()) ||
                  (s.assignedDevelopers && s.assignedDevelopers.some((d) => d.toString() === u._id.toString())))
            );

            let directEarnings = 0;
            const itemized = [];

            completedSales.forEach((s) => {
              let dealEarnings = 0;
              const rolesEarned = [];

              if (s.leadGeneratedBy && s.leadGeneratedBy.toString() === u._id.toString()) {
                const amt = Math.round(((s.totalAmount || 0) * (rates.leadGenPercent || 0)) / 100);
                if (amt > 0) {
                  dealEarnings += amt;
                  rolesEarned.push({ role: 'Lead Generator', percent: rates.leadGenPercent, amount: amt });
                }
              }

              if (s.closedBy && s.closedBy.toString() === u._id.toString()) {
                const amt = Math.round(((s.totalAmount || 0) * (rates.closerPercent || 0)) / 100);
                if (amt > 0) {
                  dealEarnings += amt;
                  rolesEarned.push({ role: 'Sales Closer', percent: rates.closerPercent, amount: amt });
                }
              }

              if (s.assignedDevelopers && s.assignedDevelopers.some((d) => d.toString() === u._id.toString())) {
                const amt = Math.round(((s.totalAmount || 0) * (rates.developerPercent || 0)) / 100);
                if (amt > 0) {
                  dealEarnings += amt;
                  rolesEarned.push({ role: 'Developer', percent: rates.developerPercent, amount: amt });
                }
              }

              directEarnings += dealEarnings;
              itemized.push({
                saleId: s._id,
                clientName: s.customer?.businessName || 'Client',
                totalSaleAmount: s.totalAmount || 0,
                closedAt: s.closedAt,
                rolesEarned,
                dealEarnings,
              });
            });

            // Referral earnings
            const referredUsers = users.filter((ru) => ru.referredBy && ru.referredBy.toString() === u._id.toString());
            let referralEarnings = 0;

            referredUsers.forEach((refUser) => {
              const refPercent = refUser.referralPercent || 0;
              const refSales = sales.filter(
                (s) =>
                  s.status === 'payment_completed' &&
                  (s.remainingAmount === 0 || s.remainingAmount === undefined) &&
                  s.isProjectDelivered === true &&
                  ((s.leadGeneratedBy && s.leadGeneratedBy.toString() === refUser._id.toString()) ||
                    (s.closedBy && s.closedBy.toString() === refUser._id.toString()))
              );

              refSales.forEach((rs) => {
                const comm = Math.round(((rs.totalAmount || 0) * refPercent) / 100);
                referralEarnings += comm;
              });
            });

            return {
              userId: u._id,
              name: u.name,
              email: u.email,
              roles: u.roles,
              commissionRates: rates,
              referralPercent: u.referralPercent || 0,
              directEarnings,
              referralEarnings,
              totalEarnings: directEarnings + referralEarnings,
              dealsCount: completedSales.length,
              referralsCount: referredUsers.length,
              itemized,
            };
          });

          const totalCommissionLiability = userCommissionSummary.reduce((sum, c) => sum + c.totalEarnings, 0);

          let bookedSales = 0;
          let realizedSales = 0;
          let pendingReceivables = 0;

          const formattedSales = sales.map((s) => {
            const tot = Number(s.totalAmount) || 0;
            const adv = Number(s.advanceAmount) || 0;
            const rem = s.remainingAmount !== undefined ? Number(s.remainingAmount) : Math.max(0, tot - adv);

            bookedSales += tot;
            realizedSales += adv;
            pendingReceivables += rem;

            const rep = users.find((u) => u._id.toString() === s.leadGeneratedBy?.toString());
            const closer = users.find((u) => u._id.toString() === s.closedBy?.toString());
            let dealComm = 0;
            if (rep?.commissionRates?.leadGenPercent) {
              dealComm += Math.round((tot * rep.commissionRates.leadGenPercent) / 100);
            }
            if (closer?.commissionRates?.closerPercent) {
              dealComm += Math.round((tot * closer.commissionRates.closerPercent) / 100);
            }

            const daysOutstanding = Math.max(0, Math.floor((Date.now() - new Date(s.closedAt || s.createdAt).getTime()) / (1000 * 60 * 60 * 24)));

            return {
              _id: s._id,
              customer: s.customer || { businessName: 'Client', area: 'Lahore', category: 'General' },
              products: s.products || [],
              totalAmount: tot,
              advanceAmount: adv,
              remainingAmount: rem,
              status: s.status || 'advance_paid',
              leadGeneratedBy: rep ? { _id: rep._id, name: rep.name, email: rep.email } : null,
              leadGeneratedByName: s.leadGeneratedByName || rep?.name || 'Sales Desk',
              closedBy: closer ? { _id: closer._id, name: closer.name, email: closer.email } : null,
              closedByName: s.closedByName || closer?.name || 'Super Admin',
              assignedDeveloperNames: s.assignedDeveloperNames || [],
              projectId: s.projectId || null,
              isProjectDelivered: Boolean(s.isProjectDelivered),
              paymentMethod: s.paymentMethod || 'Bank Transfer',
              closedAt: s.closedAt || s.createdAt || new Date(),
              estimatedCommission: dealComm,
              daysOutstanding,
            };
          });

          let totalOtherIncome = 0;
          let totalInvestment = 0;
          let totalProjectPayments = 0;

          inflows.forEach((i) => {
            const amt = Number(i.amount) || 0;
            if (i.type === 'other_income') totalOtherIncome += amt;
            else if (i.type === 'investment') totalInvestment += amt;
            else if (i.type === 'project_payment') totalProjectPayments += amt;
          });

          const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

          const totalCashInflow = realizedSales + totalOtherIncome + totalInvestment;
          const realizedOperatingInflow = realizedSales + totalOtherIncome;
          const realizedNetProfit = realizedOperatingInflow - totalExpenses - totalCommissionLiability;
          const realizedProfitMargin = realizedOperatingInflow > 0
            ? parseFloat(((realizedNetProfit / realizedOperatingInflow) * 100).toFixed(1))
            : 0;
          const netCashFlow = totalCashInflow - totalExpenses - totalCommissionLiability;

          const effectiveBookedRevenue = bookedSales + totalOtherIncome;
          const projectedNetProfit = effectiveBookedRevenue - totalExpenses - totalCommissionLiability;
          const projectedProfitMargin = effectiveBookedRevenue > 0
            ? parseFloat(((projectedNetProfit / effectiveBookedRevenue) * 100).toFixed(1))
            : 0;

          dataPayload = {
            success: true,
            source: 'leadhunter',
            timestamp: new Date().toISOString(),
            summary: {
              realizedSales,
              totalOtherIncome,
              totalInvestment,
              totalProjectPayments,
              totalCashInflow,
              realizedNetProfit,
              realizedProfitMargin,
              netCashFlow,
              bookedSales,
              projectedNetProfit,
              projectedProfitMargin,
              pendingReceivables,
              totalExpenses,
              totalCommissionLiability,
              totalCost: totalExpenses + totalCommissionLiability,
              salesCount: formattedSales.length,
              projectsCount: projects.length,
              activeProjectsCount: projects.filter((p) => p.status === 'in_progress' || p.status === 'review').length,
              completedProjectsCount: projects.filter((p) => p.status === 'completed' || p.status === 'delivered').length,
              inflowsCount: inflows.length,
              expensesCount: expenses.length,
              agentsCount: users.length,
            },
            data: {
              sales: formattedSales,
              inflows,
              expenses,
              projects,
              commissions: userCommissionSummary,
              users,
            },
          };
        } catch (dbErr) {
          console.error('[leadHunterService] Direct Atlas query fallback failed:', dbErr.message);
        }
      }
    }

    const durationMs = Date.now() - startTime;

    // Record Sync Log if successful
    if (dataPayload) {
      try {
        await AccountSyncLog.create({
          sourcePlatform: 'leadhunter',
          syncId,
          startedAt: new Date(startTime),
          completedAt: new Date(),
          durationMs,
          status: 'success',
          mode,
          recordsFetched: {
            sales: dataPayload.data?.sales?.length || 0,
            projects: dataPayload.data?.projects?.length || 0,
            inflows: dataPayload.data?.inflows?.length || 0,
            expenses: dataPayload.data?.expenses?.length || 0,
            commissions: dataPayload.data?.commissions?.length || 0,
            total:
              (dataPayload.data?.sales?.length || 0) +
              (dataPayload.data?.inflows?.length || 0) +
              (dataPayload.data?.expenses?.length || 0),
          },
          triggeredBy: options.actor
            ? { id: options.actor._id, name: options.actor.name, email: options.actor.email }
            : { name: 'Automated Sync Engine' },
        });

        // Save fresh snapshot
        await AccountSnapshot.create({
          sourcePlatform: 'leadhunter',
          snapshotType: options.isManual ? 'manual_sync' : 'live_aggregate',
          period: {
            preset: options.preset || 'all_time',
            label: options.periodLabel || 'All Time',
          },
          metrics: dataPayload.summary,
          recordCounts: {
            salesCount: dataPayload.summary?.salesCount || 0,
            projectsCount: dataPayload.summary?.projectsCount || 0,
            inflowsCount: dataPayload.summary?.inflowsCount || 0,
            expensesCount: dataPayload.summary?.expensesCount || 0,
            agentsCount: dataPayload.summary?.agentsCount || 0,
          },
          syncId,
        });
      } catch (logErr) {
        console.warn('[leadHunterService] Could not persist sync log:', logErr.message);
      }

      return {
        ...dataPayload,
        meta: {
          source: 'leadhunter',
          mode,
          syncId,
          durationMs,
          lastSync: new Date().toISOString(),
          isStale: false,
        },
      };
    }

    // 3. If completely unreachable, return last cached snapshot with stale flag
    const lastSnapshot = await AccountSnapshot.findOne({ sourcePlatform: 'leadhunter' }).sort({ createdAt: -1 }).lean();
    if (lastSnapshot) {
      return {
        success: true,
        source: 'leadhunter_cached_snapshot',
        timestamp: lastSnapshot.createdAt,
        summary: lastSnapshot.metrics,
        data: {
          sales: [],
          inflows: [],
          expenses: [],
          projects: [],
          commissions: [],
          users: [],
        },
        meta: {
          source: 'leadhunter',
          mode: 'stale_snapshot',
          syncId: lastSnapshot.syncId,
          lastSync: lastSnapshot.createdAt,
          isStale: true,
          staleWarning: 'LeadHunter source API is unreachable. Displaying last synchronized historical snapshot.',
        },
      };
    }

    throw new Error('LeadHunter financial service is unavailable and no historical snapshot exists.');
  },

  /**
   * Get latest synchronization metadata
   */
  getLastSyncStatus: async () => {
    const lastLog = await AccountSyncLog.findOne({ sourcePlatform: 'leadhunter' }).sort({ startedAt: -1 }).lean();
    return {
      sourcePlatform: 'leadhunter',
      lastSync: lastLog?.completedAt || lastLog?.startedAt || null,
      status: lastLog?.status || 'idle',
      mode: lastLog?.mode || 'api_gateway',
      durationMs: lastLog?.durationMs || 0,
      recordsTotal: lastLog?.recordsFetched?.total || 0,
      syncId: lastLog?.syncId || null,
    };
  },
};

export default leadHunterService;
