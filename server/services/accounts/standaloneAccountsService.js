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
  calculateCommissions: (sales = [], users = []) => {
    // Collect all unique agents referenced in sales plus users with roles
    const agentMap = new Map();

    users.forEach((u) => {
      agentMap.set(u._id.toString(), {
        userId: u._id.toString(),
        name: u.name,
        email: u.email,
        roles: u.roles?.map((r) => (typeof r === 'string' ? r : r.name)) || ['Platform User'],
        commissionRates: { leadGenPercent: 10, closerPercent: 15, developerPercent: 20 },
        referralPercent: 5,
        directEarnings: 0,
        referralEarnings: 0,
        totalEarnings: 0,
        dealsCount: 0,
        referralsCount: 0,
        itemized: [],
      });
    });

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
            commissionRates: { leadGenPercent: 10, closerPercent: 0, developerPercent: 0 },
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
        const rate = s.commissionRates?.leadGenPercent || agent.commissionRates.leadGenPercent || 10;
        const earned = Math.round((tot * rate) / 100);
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
          dealEarnings: earned,
          isRealized: isComplete,
        });
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
            commissionRates: { leadGenPercent: 0, closerPercent: 15, developerPercent: 0 },
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
        const rate = s.commissionRates?.closerPercent || agent.commissionRates.closerPercent || 15;
        const earned = Math.round((tot * rate) / 100);
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
          dealEarnings: earned,
          isRealized: isComplete,
        });
      }

      // 3. Assigned Developers
      (s.assignedDevelopers || []).forEach((dev) => {
        if (!dev.name) return;
        const key = dev.id || dev.name;
        if (!agentMap.has(key)) {
          agentMap.set(key, {
            userId: key,
            name: dev.name,
            email: '',
            roles: ['Developer'],
            commissionRates: { leadGenPercent: 0, closerPercent: 0, developerPercent: 20 },
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
        const rate = s.commissionRates?.developerPercent || agent.commissionRates.developerPercent || 20;
        const earned = Math.round((tot * rate) / 100);
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
          percent: rate,
          dealEarnings: earned,
          isRealized: isComplete,
        });
      });
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

