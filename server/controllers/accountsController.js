import { AccountSale } from '../models/AccountSale.js';
import { AccountInflow } from '../models/AccountInflow.js';
import { AccountProject } from '../models/AccountProject.js';
import { CoreExpense } from '../models/CoreExpense.js';
import { AccountAdjustment } from '../models/AccountAdjustment.js';
import { AccountSnapshot } from '../models/AccountSnapshot.js';
import { AccountSyncLog } from '../models/AccountSyncLog.js';
import { AuditLog } from '../models/AuditLog.js';
import { AdminUser } from '../models/AdminUser.js';
import { standaloneAccountsService } from '../services/accounts/standaloneAccountsService.js';
import { financialCalculationService } from '../services/accounts/financialCalculationService.js';
import { accountExportService } from '../services/accounts/accountExportService.js';
import crypto from 'crypto';

/**
 * Helper to log financial actions to the immutable AuditLog
 */
const logFinancialAudit = async (req, action, targetType, targetId, details = {}) => {
  try {
    const actor = req.user || req.adminUser;
    const roleName =
      typeof actor?.role === 'string'
        ? actor.role
        : actor?.role?.name || (actor?.isSuperAdmin ? 'SUPERADMIN' : 'ADMIN');
    await AuditLog.create({
      actor: {
        id: actor?._id || null,
        name: actor?.name || 'Admin',
        email: actor?.email || 'admin@megatrix.internal',
        role: roleName,
      },
      action,
      target: {
        id: String(targetId || ''),
        type: targetType,
        name: details.title || details.name || details.saleNumber || '',
      },
      platform: 'global',
      details,
      ipAddress: req.ip || req.connection?.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'MegaTrix Core Client',
    });
  } catch (err) {
    console.warn('[accountsController] Could not write audit log:', err.message);
  }
};

export const accountsController = {
  /**
   * GET /api/accounts/overview
   * Consolidated Executive Financial Dashboard (100% Standalone Native)
   */
  getOverview: async (req, res) => {
    try {
      const { startDate, endDate, preset } = req.query;

      // 1. Fetch native Core Admin financial datasets
      const data = await standaloneAccountsService.getFinancialData();

      // 2. Compute Dual-Basis Financial Summary
      const summary = financialCalculationService.computeFinancialSummary({
        sales: data.sales,
        inflows: data.inflows,
        leadHunterExpenses: [], // Deprecated external CRM expenses
        coreExpenses: data.coreExpenses,
        commissions: data.commissions,
        adjustments: data.adjustments,
        startDate,
        endDate,
      });

      // 3. Compute Receivables Aging
      const aging = financialCalculationService.computeReceivablesAging(data.sales);

      // 4. Compute Consolidated Expense Breakdown
      const expenseBreakdown = financialCalculationService.computeExpenseBreakdown([], data.coreExpenses);

      // 5. Compute Project Profitability Summary
      const projectFinancials = financialCalculationService.computeProjectFinancials(
        data.projects,
        data.sales,
        []
      );

      // 6. Compute Reconciliation Audit
      const reconciliation = financialCalculationService.auditReconciliation({
        sales: data.sales,
        inflows: data.inflows,
        expenses: data.coreExpenses,
        commissions: data.commissions,
        adjustments: data.adjustments,
      });

      // 7. Commission Liabilities Summary
      const commissionSummary = financialCalculationService.computeCommissionSummary(
        data.commissions,
        data.sales
      );

      const meta = {
        source: 'core_admin_native',
        mode: 'standalone_native',
        syncId: `native_${Date.now()}`,
        durationMs: 12,
        lastSync: new Date().toISOString(),
        isStale: false,
      };

      return res.json({
        success: true,
        summary,
        aging,
        expenseBreakdown: {
          totalExpenses: expenseBreakdown.totalExpenses,
          categorySummary: expenseBreakdown.categorySummary,
          leadHunterShare: 0,
          coreAdminShare: 100,
        },
        commissionSummary: {
          totalLiability: commissionSummary.totalCommissionLiability,
          pendingPayouts: commissionSummary.totalPendingPayouts,
          topAgents: commissionSummary.agents.slice(0, 5),
        },
        projectsSummary: {
          totalProjects: projectFinancials.length,
          healthyCount: projectFinancials.filter((p) => p.healthStatus === 'Healthy').length,
          atRiskCount: projectFinancials.filter((p) => p.healthStatus !== 'Healthy').length,
        },
        reconciliationSummary: {
          totalDiscrepancies: reconciliation.totalDiscrepancies,
          criticalCount: reconciliation.criticalCount,
          warningCount: reconciliation.warningCount,
        },
        meta,
      });
    } catch (err) {
      console.error('[accountsController:getOverview] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/sales
   * Filterable Sales & Contract Revenue Ledger
   */
  getSalesLedger: async (req, res) => {
    try {
      const {
        search = '',
        status = 'all',
        agent = 'all',
        startDate,
        endDate,
        sortBy = 'closedAt',
        sortOrder = 'desc',
        page = 1,
        limit = 50,
      } = req.query;

      const filter = {};

      if (status !== 'all') {
        filter.status = status;
      }

      if (startDate || endDate) {
        filter.closedAt = {};
        if (startDate) filter.closedAt.$gte = new Date(startDate);
        if (endDate) filter.closedAt.$lte = new Date(endDate);
      }

      if (search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { saleNumber: regex },
          { 'customer.businessName': regex },
          { 'customer.phone': regex },
          { 'leadGeneratedBy.name': regex },
          { 'closedBy.name': regex },
          { projectName: regex },
        ];
      }

      if (agent !== 'all') {
        const agentRegex = new RegExp(agent.trim(), 'i');
        filter.$or = filter.$or || [];
        filter.$or.push({ 'leadGeneratedBy.name': agentRegex }, { 'closedBy.name': agentRegex });
      }

      const sortDir = sortOrder === 'asc' ? 1 : -1;
      const sortObj = { [sortBy]: sortDir };

      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.max(1, parseInt(limit, 10));
      const skip = (pageNum - 1) * limitNum;

      const [sales, total] = await Promise.all([
        AccountSale.find(filter).sort(sortObj).skip(skip).limit(limitNum).lean(),
        AccountSale.countDocuments(filter),
      ]);

      // Calculate totals
      let bookedSales = 0;
      let realizedSales = 0;
      let pendingReceivables = 0;

      const allFiltered = await AccountSale.find(filter, { totalAmount: 1, advanceAmount: 1, remainingAmount: 1 }).lean();
      allFiltered.forEach((s) => {
        bookedSales += s.totalAmount || 0;
        realizedSales += s.advanceAmount || 0;
        pendingReceivables += s.remainingAmount || 0;
      });

      return res.json({
        success: true,
        sales,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
        summary: {
          bookedSales,
          realizedSales,
          pendingReceivables,
          dealCount: total,
        },
      });
    } catch (err) {
      console.error('[accountsController:getSalesLedger] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/sales/:id
   */
  getSaleDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const sale = await AccountSale.findOne({
        $or: [{ _id: id }, { saleNumber: id }, { sourceLegacyId: id }],
      }).lean();

      if (!sale) {
        return res.status(404).json({ success: false, message: 'Sale record not found.' });
      }

      // Fetch linked inflows and project
      const [inflows, project] = await Promise.all([
        AccountInflow.find({ saleId: sale._id }).sort({ date: -1 }).lean(),
        AccountProject.findOne({ saleId: sale._id }).lean(),
      ]);

      return res.json({
        success: true,
        sale,
        inflows,
        project,
      });
    } catch (err) {
      console.error('[accountsController:getSaleDetail] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/accounts/sales
   * Create a new Sale / Contract
   */
  createSale: async (req, res) => {
    try {
      const {
        customer,
        products = [],
        totalAmount,
        advanceAmount = 0,
        paymentMethod = 'Bank Transfer',
        leadGeneratedByName = 'Sales Desk',
        closedByName = 'Super Admin',
        assignedDeveloperNames = [],
        notes = '',
        closedAt = new Date(),
        commissionRates = {},
      } = req.body;

      if (!customer?.businessName || totalAmount === undefined) {
        return res.status(400).json({ success: false, message: 'Customer business name and totalAmount are required.' });
      }

      const tot = Number(totalAmount) || 0;
      const adv = Number(advanceAmount) || 0;
      const rem = Math.max(0, tot - adv);
      const saleCount = await AccountSale.countDocuments();
      const saleNumber = `MT-SALE-${1000 + saleCount + 1}`;

      const sale = await AccountSale.create({
        saleNumber,
        customer,
        products: products.length > 0 ? products : [{ name: 'Digital Services Contract', quantity: 1, unitPrice: tot, subtotal: tot }],
        totalAmount: tot,
        advanceAmount: adv,
        remainingAmount: rem,
        status: rem === 0 ? 'payment_completed' : adv > 0 ? 'advance_paid' : 'draft',
        paymentMethod,
        payments: adv > 0 ? [{ amount: adv, date: new Date(), paymentMethod, referenceNote: 'Initial Advance', recordedBy: req.user?.name || 'Admin' }] : [],
        leadGeneratedBy: { name: leadGeneratedByName },
        closedBy: { name: closedByName },
        assignedDevelopers: assignedDeveloperNames.map((name) => ({ name, role: 'Developer' })),
        commissionRates,
        closedAt: new Date(closedAt),
        notes,
      });

      // Record Inflow for advance
      if (adv > 0) {
        await AccountInflow.create({
          inflowNumber: `MT-INF-${1000 + saleCount + 1}-ADV`,
          title: `Advance: ${customer.businessName}`,
          amount: adv,
          type: 'sale_payment',
          source: customer.businessName,
          saleId: sale._id,
          paymentMethod,
          reference: 'Initial Advance Payment',
          date: new Date(closedAt),
          recordedBy: req.user?.name || 'Admin',
        });
      }

      await logFinancialAudit(req, 'SALE_CREATED', 'ACCOUNT_SALE', sale._id, {
        saleNumber,
        totalAmount: tot,
        businessName: customer.businessName,
      });

      return res.status(201).json({ success: true, sale });
    } catch (err) {
      console.error('[accountsController:createSale] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * PUT /api/accounts/sales/:id
   * Update Sale Details
   */
  updateSale: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const sale = await AccountSale.findById(id);
      if (!sale) {
        return res.status(404).json({ success: false, message: 'Sale not found.' });
      }

      if (updates.customer) sale.customer = { ...sale.customer.toObject(), ...updates.customer };
      if (updates.isProjectDelivered !== undefined) {
        sale.isProjectDelivered = Boolean(updates.isProjectDelivered);
        if (sale.isProjectDelivered && !sale.deliveredAt) sale.deliveredAt = new Date();
      }
      if (updates.notes !== undefined) sale.notes = updates.notes;
      if (updates.status) sale.status = updates.status;

      await sale.save();
      await logFinancialAudit(req, 'SALE_UPDATED', 'ACCOUNT_SALE', sale._id, updates);

      return res.json({ success: true, sale });
    } catch (err) {
      console.error('[accountsController:updateSale] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/accounts/sales/:id/payments
   * Record installment or balance payment on a sale
   */
  recordSalePayment: async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, paymentMethod = 'Bank Transfer', referenceNote = '', date = new Date() } = req.body;

      const paymentAmt = Number(amount);
      if (!paymentAmt || paymentAmt <= 0) {
        return res.status(400).json({ success: false, message: 'Valid payment amount is required.' });
      }

      const sale = await AccountSale.findById(id);
      if (!sale) {
        return res.status(404).json({ success: false, message: 'Sale record not found.' });
      }

      sale.advanceAmount = (sale.advanceAmount || 0) + paymentAmt;
      sale.remainingAmount = Math.max(0, (sale.totalAmount || 0) - sale.advanceAmount);
      if (sale.remainingAmount === 0) {
        sale.status = 'payment_completed';
      }

      sale.payments.push({
        amount: paymentAmt,
        date: new Date(date),
        paymentMethod,
        referenceNote,
        recordedBy: req.user?.name || 'Admin',
      });

      await sale.save();

      // Log Inflow
      const inflowCount = await AccountInflow.countDocuments();
      await AccountInflow.create({
        inflowNumber: `MT-INF-${1000 + inflowCount + 1}`,
        title: `Payment: ${sale.customer?.businessName || sale.saleNumber}`,
        amount: paymentAmt,
        type: 'sale_payment',
        source: sale.customer?.businessName || 'Client',
        saleId: sale._id,
        paymentMethod,
        reference: referenceNote,
        date: new Date(date),
        recordedBy: req.user?.name || 'Admin',
      });

      await logFinancialAudit(req, 'PAYMENT_RECORDED', 'ACCOUNT_SALE', sale._id, {
        paymentAmount: paymentAmt,
        newRemaining: sale.remainingAmount,
      });

      return res.json({ success: true, sale });
    } catch (err) {
      console.error('[accountsController:recordSalePayment] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/projects
   */
  getProjects: async (req, res) => {
    try {
      const [projects, sales] = await Promise.all([
        AccountProject.find().sort({ createdAt: -1 }).lean(),
        AccountSale.find().lean(),
      ]);

      const projectFinancials = financialCalculationService.computeProjectFinancials(projects, sales, []);

      return res.json({
        success: true,
        projects: projectFinancials,
        summary: {
          totalProjects: projectFinancials.length,
          deliveredCount: projectFinancials.filter((p) => p.isDelivered).length,
          activeCount: projectFinancials.filter((p) => !p.isDelivered).length,
        },
      });
    } catch (err) {
      console.error('[accountsController:getProjects] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/commissions
   */
  getCommissions: async (req, res) => {
    try {
      const [sales, users] = await Promise.all([
        AccountSale.find().lean(),
        AdminUser.find({ status: 'active' }).populate('roles').lean(),
      ]);

      const commissions = standaloneAccountsService.calculateCommissions(sales, users);
      const summary = financialCalculationService.computeCommissionSummary(commissions, sales);

      return res.json({
        success: true,
        commissions,
        summary,
      });
    } catch (err) {
      console.error('[accountsController:getCommissions] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/receivables
   */
  getReceivables: async (req, res) => {
    try {
      const sales = await AccountSale.find().sort({ closedAt: -1 }).lean();
      const aging = financialCalculationService.computeReceivablesAging(sales);

      return res.json({
        success: true,
        aging,
      });
    } catch (err) {
      console.error('[accountsController:getReceivables] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/inflows
   */
  getInflows: async (req, res) => {
    try {
      const { search = '', type = 'all', startDate, endDate, page = 1, limit = 50 } = req.query;

      const filter = {};
      if (type !== 'all') filter.type = type;
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }
      if (search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [{ title: regex }, { source: regex }, { reference: regex }, { inflowNumber: regex }];
      }

      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.max(1, parseInt(limit, 10));
      const skip = (pageNum - 1) * limitNum;

      const [inflows, total] = await Promise.all([
        AccountInflow.find(filter).sort({ date: -1 }).skip(skip).limit(limitNum).lean(),
        AccountInflow.countDocuments(filter),
      ]);

      const all = await AccountInflow.find(filter, { amount: 1 }).lean();
      const totalAmount = all.reduce((sum, i) => sum + (i.amount || 0), 0);

      return res.json({
        success: true,
        inflows,
        pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) || 1 },
        summary: { totalAmount, count: total },
      });
    } catch (err) {
      console.error('[accountsController:getInflows] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/accounts/inflows
   */
  createInflow: async (req, res) => {
    try {
      const { title, amount, type = 'other_income', source = 'General', paymentMethod = 'Bank Transfer', reference = '', date = new Date() } = req.body;

      if (!title || !amount) {
        return res.status(400).json({ success: false, message: 'Title and amount are required.' });
      }

      const count = await AccountInflow.countDocuments();
      const inflowNumber = `MT-INF-${1000 + count + 1}`;

      const inflow = await AccountInflow.create({
        inflowNumber,
        title,
        amount: Number(amount),
        type,
        source,
        paymentMethod,
        reference,
        date: new Date(date),
        recordedBy: req.user?.name || 'Admin',
      });

      await logFinancialAudit(req, 'INFLOW_RECORDED', 'ACCOUNT_INFLOW', inflow._id, { title, amount });
      return res.status(201).json({ success: true, inflow });
    } catch (err) {
      console.error('[accountsController:createInflow] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * DELETE /api/accounts/inflows/:id
   */
  deleteInflow: async (req, res) => {
    try {
      const { id } = req.params;
      const inflow = await AccountInflow.findByIdAndDelete(id);
      if (!inflow) {
        return res.status(404).json({ success: false, message: 'Inflow record not found.' });
      }

      await logFinancialAudit(req, 'INFLOW_DELETED', 'ACCOUNT_INFLOW', id, { title: inflow.title, amount: inflow.amount });
      return res.json({ success: true, message: 'Inflow removed successfully.' });
    } catch (err) {
      console.error('[accountsController:deleteInflow] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/expenses
   */
  getExpenses: async (req, res) => {
    try {
      const { search = '', category = 'all', startDate, endDate, page = 1, limit = 50 } = req.query;

      const filter = {};
      if (category !== 'all') filter.category = category;
      if (startDate || endDate) {
        filter.expenseDate = {};
        if (startDate) filter.expenseDate.$gte = new Date(startDate);
        if (endDate) filter.expenseDate.$lte = new Date(endDate);
      }
      if (search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [{ title: regex }, { reason: regex }, { vendor: regex }, { description: regex }];
      }

      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.max(1, parseInt(limit, 10));
      const skip = (pageNum - 1) * limitNum;

      const [expenses, total] = await Promise.all([
        CoreExpense.find(filter).sort({ expenseDate: -1 }).skip(skip).limit(limitNum).lean(),
        CoreExpense.countDocuments(filter),
      ]);

      const all = await CoreExpense.find(filter, { amount: 1 }).lean();
      const totalAmount = all.reduce((sum, e) => sum + (e.amount || 0), 0);

      return res.json({
        success: true,
        expenses,
        pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) || 1 },
        summary: { totalAmount, count: total },
      });
    } catch (err) {
      console.error('[accountsController:getExpenses] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/accounts/expenses/core
   */
  createCoreExpense: async (req, res) => {
    try {
      const { title, reason, category, amount, currency = 'USD', expenseDate = new Date(), vendor, paymentMethod, description, isRecurring, recurringInterval } = req.body;

      if (!title || !amount) {
        return res.status(400).json({ success: false, message: 'Title and amount are required.' });
      }

      const expense = await CoreExpense.create({
        title,
        reason: reason || title,
        category: category || 'general_administrative',
        amount: Number(amount),
        currency,
        expenseDate: new Date(expenseDate),
        date: new Date(expenseDate),
        vendor: vendor || '',
        paymentMethod: paymentMethod || 'Corporate Account',
        description: description || '',
        isRecurring: Boolean(isRecurring),
        recurringInterval: recurringInterval || 'one_time',
        status: 'approved',
        sourcePlatform: 'core',
        createdBy: {
          id: req.user?._id,
          name: req.user?.name || 'Admin',
          email: req.user?.email,
        },
      });

      await logFinancialAudit(req, 'EXPENSE_CREATED', 'CORE_EXPENSE', expense._id, { title, amount });
      return res.status(201).json({ success: true, expense });
    } catch (err) {
      console.error('[accountsController:createCoreExpense] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * PUT /api/accounts/expenses/core/:id
   */
  updateCoreExpense: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const expense = await CoreExpense.findByIdAndUpdate(id, updates, { new: true });
      if (!expense) {
        return res.status(404).json({ success: false, message: 'Expense record not found.' });
      }

      await logFinancialAudit(req, 'EXPENSE_UPDATED', 'CORE_EXPENSE', id, updates);
      return res.json({ success: true, expense });
    } catch (err) {
      console.error('[accountsController:updateCoreExpense] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * DELETE /api/accounts/expenses/core/:id
   */
  deleteCoreExpense: async (req, res) => {
    try {
      const { id } = req.params;
      const expense = await CoreExpense.findByIdAndDelete(id);
      if (!expense) {
        return res.status(404).json({ success: false, message: 'Expense record not found.' });
      }

      await logFinancialAudit(req, 'EXPENSE_DELETED', 'CORE_EXPENSE', id, { title: expense.title, amount: expense.amount });
      return res.json({ success: true, message: 'Expense removed successfully.' });
    } catch (err) {
      console.error('[accountsController:deleteCoreExpense] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/pnl
   */
  getProfitLoss: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const data = await standaloneAccountsService.getFinancialData();

      const summary = financialCalculationService.computeFinancialSummary({
        sales: data.sales,
        inflows: data.inflows,
        coreExpenses: data.coreExpenses,
        commissions: data.commissions,
        adjustments: data.adjustments,
        startDate,
        endDate,
      });

      return res.json({
        success: true,
        cashBasis: summary.cashBasis,
        accrualBasis: summary.accrualBasis,
        consolidatedCost: summary.consolidatedCost,
        period: { startDate, endDate },
      });
    } catch (err) {
      console.error('[accountsController:getProfitLoss] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/cash-flow
   */
  getCashFlow: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const data = await standaloneAccountsService.getFinancialData();

      const summary = financialCalculationService.computeFinancialSummary({
        sales: data.sales,
        inflows: data.inflows,
        coreExpenses: data.coreExpenses,
        commissions: data.commissions,
        adjustments: data.adjustments,
        startDate,
        endDate,
      });

      return res.json({
        success: true,
        cashFlow: summary.cashBasis,
        inflows: data.inflows,
        expenses: data.coreExpenses,
      });
    } catch (err) {
      console.error('[accountsController:getCashFlow] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/reconciliation
   */
  getReconciliation: async (req, res) => {
    try {
      const data = await standaloneAccountsService.getFinancialData();
      const reconciliation = financialCalculationService.auditReconciliation({
        sales: data.sales,
        inflows: data.inflows,
        expenses: data.coreExpenses,
        commissions: data.commissions,
        adjustments: data.adjustments,
      });

      return res.json({
        success: true,
        reconciliation,
      });
    } catch (err) {
      console.error('[accountsController:getReconciliation] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/adjustments
   */
  getAdjustments: async (req, res) => {
    try {
      const adjustments = await AccountAdjustment.find().sort({ effectiveDate: -1 }).lean();
      return res.json({ success: true, adjustments });
    } catch (err) {
      console.error('[accountsController:getAdjustments] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/accounts/adjustments
   */
  createAdjustment: async (req, res) => {
    try {
      const { title, reason, type, amount, targetType, targetId, note, effectiveDate = new Date() } = req.body;

      if (!title || amount === undefined) {
        return res.status(400).json({ success: false, message: 'Title and amount are required.' });
      }

      const adjustment = await AccountAdjustment.create({
        title,
        reason: reason || title,
        type: type || 'manual_adjustment',
        amount: Number(amount),
        targetType: targetType || 'general',
        targetId: targetId || null,
        note: note || '',
        effectiveDate: new Date(effectiveDate),
        status: 'approved',
        approvedBy: {
          id: req.user?._id,
          name: req.user?.name || 'Admin',
          email: req.user?.email,
        },
      });

      await logFinancialAudit(req, 'ADJUSTMENT_POSTED', 'ACCOUNT_ADJUSTMENT', adjustment._id, { title, amount });
      return res.status(201).json({ success: true, adjustment });
    } catch (err) {
      console.error('[accountsController:createAdjustment] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/accounts/sync
   * Native Snapshot Generator & Ledger Refresh
   */
  triggerSync: async (req, res) => {
    const startTime = Date.now();
    try {
      const data = await standaloneAccountsService.getFinancialData();
      const summary = financialCalculationService.computeFinancialSummary({
        sales: data.sales,
        inflows: data.inflows,
        coreExpenses: data.coreExpenses,
        commissions: data.commissions,
        adjustments: data.adjustments,
      });

      const syncId = `native_sync_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
      const durationMs = Date.now() - startTime;

      await AccountSnapshot.create({
        sourcePlatform: 'core_admin',
        snapshotType: 'manual_sync',
        period: { preset: 'all_time', label: 'All Time' },
        metrics: summary,
        recordCounts: {
          salesCount: data.sales.length,
          projectsCount: data.projects.length,
          inflowsCount: data.inflows.length,
          expensesCount: data.coreExpenses.length,
          agentsCount: data.commissions.length,
        },
        syncId,
      });

      await AccountSyncLog.create({
        sourcePlatform: 'core_admin',
        syncId,
        startedAt: new Date(startTime),
        completedAt: new Date(),
        durationMs,
        status: 'success',
        mode: 'standalone_native',
        recordsFetched: {
          sales: data.sales.length,
          projects: data.projects.length,
          inflows: data.inflows.length,
          expenses: data.coreExpenses.length,
          commissions: data.commissions.length,
          total: data.sales.length + data.inflows.length + data.coreExpenses.length,
        },
        triggeredBy: req.user ? { id: req.user._id, name: req.user.name, email: req.user.email } : { name: 'Admin' },
      });

      return res.json({
        success: true,
        message: 'Native accounts telemetry synchronized and snapshot created.',
        meta: {
          mode: 'standalone_native',
          durationMs,
          syncId,
          lastSync: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error('[accountsController:triggerSync] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/sync/logs
   */
  getSyncLogs: async (req, res) => {
    try {
      const logs = await AccountSyncLog.find().sort({ startedAt: -1 }).limit(50).lean();
      return res.json({ success: true, logs });
    } catch (err) {
      console.error('[accountsController:getSyncLogs] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/export/excel
   */
  exportExcel: async (req, res) => {
    try {
      const data = await standaloneAccountsService.getFinancialData();
      const summary = financialCalculationService.computeFinancialSummary({
        sales: data.sales,
        inflows: data.inflows,
        coreExpenses: data.coreExpenses,
        commissions: data.commissions,
        adjustments: data.adjustments,
      });

      const aging = financialCalculationService.computeReceivablesAging(data.sales);
      const projectFinancials = financialCalculationService.computeProjectFinancials(data.projects, data.sales, []);

      const buffer = await accountExportService.generateExcelWorkbook({
        summary,
        sales: data.sales,
        inflows: data.inflows,
        expenses: data.coreExpenses,
        commissions: data.commissions,
        aging,
        projects: projectFinancials,
        generatedBy: req.user?.name || 'MegaTrix Core Admin',
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=MegaTrix_Financial_Ledger_${new Date().toISOString().slice(0, 10)}.xlsx`);
      return res.send(buffer);
    } catch (err) {
      console.error('[accountsController:exportExcel] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/export/pdf
   */
  exportPdf: async (req, res) => {
    try {
      const data = await standaloneAccountsService.getFinancialData();
      const summary = financialCalculationService.computeFinancialSummary({
        sales: data.sales,
        inflows: data.inflows,
        coreExpenses: data.coreExpenses,
        commissions: data.commissions,
        adjustments: data.adjustments,
      });

      const aging = financialCalculationService.computeReceivablesAging(data.sales);
      const expenseBreakdown = financialCalculationService.computeExpenseBreakdown([], data.coreExpenses);

      const buffer = await accountExportService.generatePdfDossier({
        summary,
        aging,
        expenseBreakdown,
        salesCount: data.sales.length,
        projectsCount: data.projects.length,
        generatedBy: req.user?.name || 'MegaTrix Core Admin',
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=MegaTrix_Executive_Dossier_${new Date().toISOString().slice(0, 10)}.pdf`);
      return res.send(buffer);
    } catch (err) {
      console.error('[accountsController:exportPdf] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};
