import { AccountSale } from '../../models/AccountSale.js';
import { AccountInflow } from '../../models/AccountInflow.js';
import { CoreExpense } from '../../models/CoreExpense.js';
import { AccountProject } from '../../models/AccountProject.js';
import { AccountAdjustment } from '../../models/AccountAdjustment.js';
import { AdminUser } from '../../models/AdminUser.js';
import { Role } from '../../models/Role.js';

export const standaloneAccountsService = {
  /**
   * Calculate commission liabilities natively from Core Admin sales & active users
   */
  calculateCommissions: (sales = [], users = [], crmAgents = []) => {
    // Collect all unique agents referenced in sales plus users with roles
    const agentMap = new Map();

    // 1. Pre-populate from CRM agents if available
    (crmAgents || []).forEach((ca) => {
      const key = ca.id || ca.name;
      agentMap.set(key, {
        userId: key,
        name: ca.name,
        email: ca.email || '',
        roles: Array.isArray(ca.roles) ? ca.roles : [ca.role || 'Sales Agent'],
        commissionRates: {
          leadGenPercent: Number(ca.commissionRates?.leadGenPercent) || 0,
          closerPercent: Number(ca.commissionRates?.closerPercent) || 0,
          developerPercent: Number(ca.commissionRates?.developerPercent) || 0,
          referralPercent: Number(ca.commissionRates?.referralPercent) || 0,
        },
        referralPercent: Number(ca.commissionRates?.referralPercent) || 0,
        directEarnings: 0,
        referralEarnings: 0,
        totalEarnings: 0,
        dealsCount: 0,
        referralsCount: 0,
        itemized: [],
      });
    });

    // 2. Pre-populate from admin users
    (users || []).forEach((u) => {
      const key = u._id.toString();
      if (!agentMap.has(key)) {
        agentMap.set(key, {
          userId: key,
          name: u.name,
          email: u.email,
          roles: u.roles?.map((r) => (typeof r === 'string' ? r : r.name)) || ['Platform User'],
          commissionRates: { leadGenPercent: 0, closerPercent: 0, developerPercent: 0, referralPercent: 0 },
          referralPercent: 0,
          directEarnings: 0,
          referralEarnings: 0,
          totalEarnings: 0,
          dealsCount: 0,
          referralsCount: 0,
          itemized: [],
        });
      }
    });

    // 3. Process deals and apply active rates
    sales.forEach((s) => {
      const tot = Number(s.totalAmount) || 0;
      const adv = Number(s.advanceAmount) || 0;
      const isComplete = s.status === 'payment_completed' || s.remainingAmount === 0;

      // 1. Lead Generator
      if (s.leadGeneratedBy?.name) {
        const key = s.leadGeneratedBy.id || s.leadGeneratedBy.name;
        if (!agentMap.has(key)) {
          agentMap.set(key, {
            userId: key,
            name: s.leadGeneratedBy.name,
            email: s.leadGeneratedBy.email || '',
            roles: ['Lead Generator'],
            commissionRates: { leadGenPercent: 0, closerPercent: 0, developerPercent: 0, referralPercent: 0 },
            referralPercent: 0,
            directEarnings: 0,
            referralEarnings: 0,
            totalEarnings: 0,
            dealsCount: 0,
            referralsCount: 0,
            itemized: [],
          });
        }
        const agent = agentMap.get(key);
        const rate =
          s.commissionRates?.leadGenPercent !== undefined
            ? Number(s.commissionRates.leadGenPercent)
            : (Number(agent.commissionRates?.leadGenPercent) || 0);
        if (rate > 0) {
          agent.commissionRates.leadGenPercent = rate;
        }
        const earned = Math.round((tot * rate) / 100);
        if (earned > 0 || rate > 0) {
          agent.dealsCount++;
          agent.directEarnings += earned;
          agent.totalEarnings += earned;
          agent.itemized.push({
            saleId: s._id,
            saleNumber: s.saleNumber,
            clientName: s.customer?.businessName || 'Client',
            totalSaleAmount: tot,
            closedAt: s.closedAt,
            role: 'Lead Generator',
            percent: rate,
            rolesEarned: [{ role: 'Lead Generator', percent: rate, amount: earned }],
            dealEarnings: earned,
            isRealized: isComplete,
          });
        }
      }

      // 2. Sales Closer
      if (s.closedBy?.name) {
        const key = s.closedBy.id || s.closedBy.name;
        if (!agentMap.has(key)) {
          agentMap.set(key, {
            userId: key,
            name: s.closedBy.name,
            email: s.closedBy.email || '',
            roles: ['Sales Closer'],
            commissionRates: { leadGenPercent: 0, closerPercent: 0, developerPercent: 0, referralPercent: 0 },
            referralPercent: 0,
            directEarnings: 0,
            referralEarnings: 0,
            totalEarnings: 0,
            dealsCount: 0,
            referralsCount: 0,
            itemized: [],
          });
        }
        const agent = agentMap.get(key);
        const rate =
          s.commissionRates?.closerPercent !== undefined
            ? Number(s.commissionRates.closerPercent)
            : (Number(agent.commissionRates?.closerPercent) || 0);
        if (rate > 0) {
          agent.commissionRates.closerPercent = rate;
        }
        const earned = Math.round((tot * rate) / 100);
        if (earned > 0 || rate > 0) {
          if (s.leadGeneratedBy?.name !== s.closedBy.name) {
            agent.dealsCount++;
          }
          agent.directEarnings += earned;
          agent.totalEarnings += earned;
          agent.itemized.push({
            saleId: s._id,
            saleNumber: s.saleNumber,
            clientName: s.customer?.businessName || 'Client',
            totalSaleAmount: tot,
            closedAt: s.closedAt,
            role: 'Sales Closer',
            percent: rate,
            rolesEarned: [{ role: 'Sales Closer', percent: rate, amount: earned }],
            dealEarnings: earned,
            isRealized: isComplete,
          });
        }
      }

      // 3. Assigned Developers (split equally across assigned developers)
      const validDevs = (s.assignedDevelopers || []).filter((d) => d.name);
      const devCount = validDevs.length;
      if (devCount > 0) {
        const totalDevRate =
          s.commissionRates?.developerPercent !== undefined
            ? Number(s.commissionRates.developerPercent)
            : 0;
        const perDevRate = devCount > 0 ? totalDevRate / devCount : 0;

        validDevs.forEach((dev) => {
          const key = dev.id || dev.name;
          if (!agentMap.has(key)) {
            agentMap.set(key, {
              userId: key,
              name: dev.name,
              email: dev.email || '',
              roles: ['Developer'],
              commissionRates: { leadGenPercent: 0, closerPercent: 0, developerPercent: 0, referralPercent: 0 },
              referralPercent: 0,
              directEarnings: 0,
              referralEarnings: 0,
              totalEarnings: 0,
              dealsCount: 0,
              referralsCount: 0,
              itemized: [],
            });
          }
          const agent = agentMap.get(key);
          if (perDevRate > 0) {
            agent.commissionRates.developerPercent = parseFloat(perDevRate.toFixed(2));
          }
          const earned = Math.round((tot * perDevRate) / 100);
          if (earned > 0 || perDevRate > 0) {
            agent.dealsCount++;
            agent.directEarnings += earned;
            agent.totalEarnings += earned;
            agent.itemized.push({
              saleId: s._id,
              saleNumber: s.saleNumber,
              clientName: s.customer?.businessName || 'Client',
              totalSaleAmount: tot,
              closedAt: s.closedAt,
              role: 'Developer',
              percent: parseFloat(perDevRate.toFixed(2)),
              rolesEarned: [{ role: 'Developer', percent: parseFloat(perDevRate.toFixed(2)), amount: earned }],
              dealEarnings: earned,
              isRealized: isComplete,
            });
          }
        });
      }

      // 4. Referral Partner
      if (s.referralPartner?.name) {
        const key = s.referralPartner.id || s.referralPartner.name;
        if (!agentMap.has(key)) {
          agentMap.set(key, {
            userId: key,
            name: s.referralPartner.name,
            email: s.referralPartner.email || '',
            roles: ['Referral Partner'],
            commissionRates: { leadGenPercent: 0, closerPercent: 0, developerPercent: 0, referralPercent: 0 },
            referralPercent: 0,
            directEarnings: 0,
            referralEarnings: 0,
            totalEarnings: 0,
            dealsCount: 0,
            referralsCount: 0,
            itemized: [],
          });
        }
        const agent = agentMap.get(key);
        const rate =
          s.commissionRates?.referralPercent !== undefined
            ? Number(s.commissionRates.referralPercent)
            : (Number(agent.referralPercent) || 0);
        if (rate > 0) {
          agent.commissionRates.referralPercent = rate;
          agent.referralPercent = rate;
        }
        const earned = Math.round((tot * rate) / 100);
        if (earned > 0 || rate > 0) {
          agent.referralsCount = (agent.referralsCount || 0) + 1;
          agent.referralEarnings = (agent.referralEarnings || 0) + earned;
          agent.totalEarnings += earned;
          agent.itemized.push({
            saleId: s._id,
            saleNumber: s.saleNumber,
            clientName: s.customer?.businessName || 'Client',
            totalSaleAmount: tot,
            closedAt: s.closedAt,
            role: 'Referral Partner',
            percent: rate,
            rolesEarned: [{ role: 'Referral Partner', percent: rate, amount: earned }],
            dealEarnings: earned,
            isRealized: isComplete,
          });
        }
      }
    });

    const list = Array.from(agentMap.values()).filter((a) => a.totalEarnings > 0 || a.dealsCount > 0);
    list.sort((a, b) => b.totalEarnings - a.totalEarnings);
    return list;
  },

  /**
   * Fetch all native collections concurrently
   */
  getFinancialData: async (options = {}) => {
    const [sales, inflows, coreExpenses, projects, adjustments, users] = await Promise.all([
      AccountSale.find().sort({ closedAt: -1 }).lean(),
      AccountInflow.find().sort({ date: -1 }).lean(),
      CoreExpense.find().sort({ expenseDate: -1 }).lean(),
      AccountProject.find().sort({ createdAt: -1 }).lean(),
      AccountAdjustment.find({ status: { $in: ['approved', 'applied'] } }).sort({ effectiveDate: -1 }).lean(),
      AdminUser.find({ status: 'active' }).populate('roles').lean(),
    ]);

    const commissions = standaloneAccountsService.calculateCommissions(sales, users);

    return {
      sales,
      inflows,
      coreExpenses,
      projects,
      adjustments,
      commissions,
      users,
    };
  },
};

export default standaloneAccountsService;

