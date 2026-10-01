import { CoreExpense } from '../models/CoreExpense.js';
import { AccountAdjustment } from '../models/AccountAdjustment.js';
import { AccountSyncLog } from '../models/AccountSyncLog.js';
import { AuditLog } from '../models/AuditLog.js';
import { leadHunterService } from '../services/leadhunter/leadHunterService.js';
import { financialCalculationService } from '../services/accounts/financialCalculationService.js';
import { accountExportService } from '../services/accounts/accountExportService.js';

/**
 * Helper to log financial actions to the immutable AuditLog
 */
const logFinancialAudit = async (req, action, targetType, targetId, details = {}) => {
  try {
    const actor = req.user || req.adminUser;
    const roleName = typeof actor?.role === 'string' ? actor.role : actor?.role?.name || (actor?.isSuperAdmin ? 'SUPERADMIN' : 'ADMIN');
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
        name: details.title || details.name || '',
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
   * Consolidated Executive Financial Dashboard
   */
  getOverview: async (req, res) => {
    try {
      const { startDate, endDate, preset } = req.query;

      // 1. Fetch live telemetry from LeadHunter
      const telemetry = await leadHunterService.getTelemetry({
        params: { startDate, endDate, preset },
        actor: (req.user || req.adminUser),
      });

      // 2. Fetch Core expenses and active adjustments
      const [coreExpenses, adjustments] = await Promise.all([
        CoreExpense.find().sort({ expenseDate: -1 }).lean(),
        AccountAdjustment.find({ status: { $in: ['approved', 'applied'] } }).sort({ effectiveDate: -1 }).lean(),
      ]);

      const rawSales = telemetry.data?.sales || [];
      const rawInflows = telemetry.data?.inflows || [];
      const rawLhExpenses = telemetry.data?.expenses || [];
      const rawProjects = telemetry.data?.projects || [];
      const rawCommissions = telemetry.data?.commissions || [];

      // 3. Compute Dual-Basis Financial Summary
      const summary = financialCalculationService.computeFinancialSummary({
        sales: rawSales,
        inflows: rawInflows,
        leadHunterExpenses: rawLhExpenses,
        coreExpenses,
        commissions: rawCommissions,
        adjustments,
        startDate,
        endDate,
      });

      // 4. Compute Receivables Aging
      const aging = financialCalculationService.computeReceivablesAging(rawSales);

      // 5. Compute Consolidated Expense Breakdown
      const expenseBreakdown = financialCalculationService.computeExpenseBreakdown(rawLhExpenses, coreExpenses);

      // 6. Compute Project Profitability Summary
      const projectFinancials = financialCalculationService.computeProjectFinancials(rawProjects, rawSales, rawLhExpenses);

      // 7. Compute Reconciliation Audit
      const reconciliation = financialCalculationService.auditReconciliation({
        sales: rawSales,
        inflows: rawInflows,
        expenses: rawLhExpenses,
        commissions: rawCommissions,
        adjustments,
      });

      // 8. Commission Liabilities Summary
      const commissionSummary = financialCalculationService.computeCommissionSummary(rawCommissions, rawSales);

      return res.json({
        success: true,
        summary,
        aging,
        expenseBreakdown: {
          totalExpenses: expenseBreakdown.totalExpenses,
          categorySummary: expenseBreakdown.categorySummary,
          leadHunterShare: expenseBreakdown.leadHunterShare,
          coreAdminShare: expenseBreakdown.coreAdminShare,
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
        meta: telemetry.meta,
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

      const telemetry = await leadHunterService.getTelemetry({ actor: (req.user || req.adminUser) });
      let sales = telemetry.data?.sales || [];

      // Date filtering
      if (startDate || endDate) {
        sales = financialCalculationService.filterByDateRange(sales, 'closedAt', startDate, endDate);
      }

      // Search filter (customer business name, phone, closer, setter)
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        sales = sales.filter((s) => {
          const client = (s.customer?.businessName || s.customer?.name || '').toLowerCase();
          const phone = (s.customer?.phone || '').toLowerCase();
          const closer = (s.closedByName || '').toLowerCase();
          const leadGen = (s.leadGeneratedByName || '').toLowerCase();
          const id = String(s._id || '').toLowerCase();
          return client.includes(q) || phone.includes(q) || closer.includes(q) || leadGen.includes(q) || id.includes(q);
        });
      }

      // Status filter
      if (status !== 'all') {
        sales = sales.filter((s) => s.status === status);
      }

      // Agent filter
      if (agent !== 'all') {
        sales = sales.filter(
          (s) =>
            s.closedBy?._id?.toString() === agent ||
            s.leadGeneratedBy?._id?.toString() === agent ||
            s.closedByName === agent ||
            s.leadGeneratedByName === agent
        );
      }

      // Sorting
      sales.sort((a, b) => {
        let valA = a[sortBy] || a.closedAt || a.createdAt;
        let valB = b[sortBy] || b.closedAt || b.createdAt;
        if (sortBy === 'totalAmount' || sortBy === 'advanceAmount' || sortBy === 'remainingAmount') {
          valA = Number(valA) || 0;
          valB = Number(valB) || 0;
        } else {
          valA = new Date(valA).getTime() || 0;
          valB = new Date(valB).getTime() || 0;
        }
        return sortOrder === 'asc' ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
      });

      // Totals
      const totalBooked = sales.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);
      const totalPaid = sales.reduce((sum, s) => sum + (Number(s.advanceAmount) || 0), 0);
      const totalBalance = sales.reduce((sum, s) => {
        const rem = s.remainingAmount !== undefined ? Number(s.remainingAmount) : Math.max(0, (s.totalAmount || 0) - (s.advanceAmount || 0));
        return sum + rem;
      }, 0);
      const totalCommission = sales.reduce((sum, s) => sum + (Number(s.estimatedCommission) || 0), 0);

      // Pagination
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 50;
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedSales = sales.slice(startIndex, startIndex + limitNum);

      return res.json({
        success: true,
        sales: paginatedSales,
        pagination: {
          total: sales.length,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(sales.length / limitNum),
        },
        summary: {
          totalBooked,
          totalPaid,
          totalBalance,
          totalCommission,
          count: sales.length,
        },
      });
    } catch (err) {
      console.error('[accountsController:getSalesLedger] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/sales/:id
   * Deep-dive for a single sale
   */
  getSaleDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const telemetry = await leadHunterService.getTelemetry({ actor: (req.user || req.adminUser) });
      const sale = (telemetry.data?.sales || []).find((s) => s._id?.toString() === id);

      if (!sale) {
        return res.status(404).json({ success: false, message: 'Sale record not found' });
      }

      // Find linked inflows
      const linkedInflows = (telemetry.data?.inflows || []).filter(
        (i) => i.saleId?.toString() === id || i.description?.includes(id)
      );

      // Find linked project
      const linkedProject = (telemetry.data?.projects || []).find(
        (p) => p._id?.toString() === sale.projectId?.toString() || p.saleId?.toString() === id
      );

      return res.json({
        success: true,
        sale,
        inflows: linkedInflows,
        project: linkedProject || null,
      });
    } catch (err) {
      console.error('[accountsController:getSaleDetail] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/projects
   * Project Unit Economics & Profitability
   */
  getProjects: async (req, res) => {
    try {
      const telemetry = await leadHunterService.getTelemetry({ actor: (req.user || req.adminUser) });
      const projects = telemetry.data?.projects || [];
      const sales = telemetry.data?.sales || [];
      const expenses = telemetry.data?.expenses || [];

      const projectFinancials = financialCalculationService.computeProjectFinancials(projects, sales, expenses);

      const totalRevenue = projectFinancials.reduce((sum, p) => sum + p.contractRevenue, 0);
      const totalCost = projectFinancials.reduce((sum, p) => sum + p.totalProjectCost, 0);
      const totalNetContribution = projectFinancials.reduce((sum, p) => sum + p.netContribution, 0);
      const avgMargin = totalRevenue > 0 ? parseFloat(((totalNetContribution / totalRevenue) * 100).toFixed(1)) : 0;

      return res.json({
        success: true,
        projects: projectFinancials,
        summary: {
          totalProjects: projectFinancials.length,
          totalRevenue,
          totalCost,
          totalNetContribution,
          avgMargin,
        },
      });
    } catch (err) {
      console.error('[accountsController:getProjects] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/commissions
   * Agent Commission Ledger & Payout Liabilities
   */
  getCommissions: async (req, res) => {
    try {
      const telemetry = await leadHunterService.getTelemetry({ actor: (req.user || req.adminUser) });
      const commissions = telemetry.data?.commissions || [];
      const sales = telemetry.data?.sales || [];

      const summary = financialCalculationService.computeCommissionSummary(commissions, sales);

      return res.json({
        success: true,
        ...summary,
      });
    } catch (err) {
      console.error('[accountsController:getCommissions] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/receivables
   * Receivables Aging Buckets & Debtor Ledger
   */
  getReceivables: async (req, res) => {
    try {
      const telemetry = await leadHunterService.getTelemetry({ actor: (req.user || req.adminUser) });
      const sales = telemetry.data?.sales || [];

      const aging = financialCalculationService.computeReceivablesAging(sales);

      return res.json({
        success: true,
        ...aging,
      });
    } catch (err) {
      console.error('[accountsController:getReceivables] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/inflows
   * Cash Inflows Ledger
   */
  getInflows: async (req, res) => {
    try {
      const { type = 'all', startDate, endDate } = req.query;
      const telemetry = await leadHunterService.getTelemetry({ actor: (req.user || req.adminUser) });
      let inflows = telemetry.data?.inflows || [];

      if (startDate || endDate) {
        inflows = financialCalculationService.filterByDateRange(inflows, 'date', startDate, endDate);
      }

      if (type !== 'all') {
        inflows = inflows.filter((i) => i.type === type);
      }

      const totalAmount = inflows.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

      // Payment method distribution
      const methodDistribution = {};
      inflows.forEach((i) => {
        const m = i.paymentMethod || 'Bank Transfer';
        methodDistribution[m] = (methodDistribution[m] || 0) + (Number(i.amount) || 0);
      });

      return res.json({
        success: true,
        inflows,
        totalAmount,
        count: inflows.length,
        methodDistribution,
      });
    } catch (err) {
      console.error('[accountsController:getInflows] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/expenses
   * Consolidated Operating Expenses (LeadHunter + MegaTrix Core)
   */
  getExpenses: async (req, res) => {
    try {
      const { category = 'all', source = 'all', startDate, endDate } = req.query;
      const telemetry = await leadHunterService.getTelemetry({ actor: (req.user || req.adminUser) });
      const lhExpenses = telemetry.data?.expenses || [];
      const coreExpenses = await CoreExpense.find().sort({ expenseDate: -1 }).lean();

      let breakdown = financialCalculationService.computeExpenseBreakdown(lhExpenses, coreExpenses);
      let unified = breakdown.unifiedList;

      if (startDate || endDate) {
        unified = financialCalculationService.filterByDateRange(unified, 'date', startDate, endDate);
      }

      if (category !== 'all') {
        unified = unified.filter((e) => e.category === category);
      }

      if (source !== 'all') {
        unified = unified.filter((e) => (source === 'core' ? e.isCore : !e.isCore));
      }

      const totalAmount = unified.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      return res.json({
        success: true,
        expenses: unified,
        totalAmount,
        totalCount: unified.length,
        categorySummary: breakdown.categorySummary,
        leadHunterShare: breakdown.leadHunterShare,
        coreAdminShare: breakdown.coreAdminShare,
      });
    } catch (err) {
      console.error('[accountsController:getExpenses] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/accounts/expenses/core
   * Create a new MegaTrix Core Operating Expense
   */
  createCoreExpense: async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        amount,
        expenseDate,
        paymentMethod,
        vendor,
        referenceNumber,
        isRecurring,
        recurringInterval,
        tags,
      } = req.body;

      if (!title || !category || amount === undefined || Number(amount) <= 0) {
        return res.status(400).json({ success: false, message: 'Valid title, category, and positive amount are required.' });
      }

      const newExpense = await CoreExpense.create({
        title: title.trim(),
        description: description?.trim() || '',
        category,
        amount: Number(amount),
        expenseDate: expenseDate ? new Date(expenseDate) : new Date(),
        paymentMethod: paymentMethod || 'Corporate Account',
        vendor: vendor?.trim() || '',
        referenceNumber: referenceNumber?.trim() || '',
        isRecurring: Boolean(isRecurring),
        recurringInterval: recurringInterval || 'monthly',
        tags: Array.isArray(tags) ? tags : [],
        createdBy: {
          id: (req.user || req.adminUser)?._id,
          name: (req.user || req.adminUser)?.name || 'Admin',
          email: (req.user || req.adminUser)?.email || 'admin@megatrix.internal',
        },
      });

      await logFinancialAudit(req, 'CREATE_CORE_EXPENSE', 'EXPENSE', newExpense._id, {
        title: newExpense.title,
        amount: newExpense.amount,
        category: newExpense.category,
      });

      return res.status(201).json({
        success: true,
        message: 'Core Operating Expense created successfully.',
        expense: newExpense,
      });
    } catch (err) {
      console.error('[accountsController:createCoreExpense] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * PUT /api/accounts/expenses/core/:id
   * Update MegaTrix Core Operating Expense
   */
  updateCoreExpense: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const expense = await CoreExpense.findById(id);
      if (!expense) {
        return res.status(404).json({ success: false, message: 'Core Expense not found' });
      }

      if (updates.title) expense.title = updates.title.trim();
      if (updates.description !== undefined) expense.description = updates.description.trim();
      if (updates.category) expense.category = updates.category;
      if (updates.amount !== undefined) expense.amount = Number(updates.amount);
      if (updates.expenseDate) expense.expenseDate = new Date(updates.expenseDate);
      if (updates.paymentMethod) expense.paymentMethod = updates.paymentMethod;
      if (updates.vendor !== undefined) expense.vendor = updates.vendor.trim();
      if (updates.referenceNumber !== undefined) expense.referenceNumber = updates.referenceNumber.trim();
      if (updates.status) expense.status = updates.status;
      if (updates.isRecurring !== undefined) expense.isRecurring = Boolean(updates.isRecurring);

      await expense.save();

      await logFinancialAudit(req, 'UPDATE_CORE_EXPENSE', 'EXPENSE', expense._id, {
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
      });

      return res.json({
        success: true,
        message: 'Core Expense updated successfully.',
        expense,
      });
    } catch (err) {
      console.error('[accountsController:updateCoreExpense] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * DELETE /api/accounts/expenses/core/:id
   * Delete MegaTrix Core Operating Expense
   */
  deleteCoreExpense: async (req, res) => {
    try {
      const { id } = req.params;
      const expense = await CoreExpense.findByIdAndDelete(id);
      if (!expense) {
        return res.status(404).json({ success: false, message: 'Core Expense not found' });
      }

      await logFinancialAudit(req, 'DELETE_CORE_EXPENSE', 'EXPENSE', id, {
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
      });

      return res.json({
        success: true,
        message: 'Core Expense removed successfully.',
      });
    } catch (err) {
      console.error('[accountsController:deleteCoreExpense] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/pnl
   * Detailed Profit & Loss Statement (P&L)
   */
  getProfitLoss: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const telemetry = await leadHunterService.getTelemetry({ actor: (req.user || req.adminUser) });
      const coreExpenses = await CoreExpense.find().lean();
      const adjustments = await AccountAdjustment.find({ status: { $in: ['approved', 'applied'] } }).lean();

      const summary = financialCalculationService.computeFinancialSummary({
        sales: telemetry.data?.sales || [],
        inflows: telemetry.data?.inflows || [],
        leadHunterExpenses: telemetry.data?.expenses || [],
        coreExpenses,
        commissions: telemetry.data?.commissions || [],
        adjustments,
        startDate,
        endDate,
      });

      const expenseBreakdown = financialCalculationService.computeExpenseBreakdown(
        telemetry.data?.expenses || [],
        coreExpenses
      );

      // Statement formatting
      const statement = {
        revenue: {
          realizedSales: summary.cashBasis.realizedSalesInflow,
          projectPayments: summary.cashBasis.totalProjectPaymentsInflow,
          otherIncome: summary.cashBasis.totalOtherIncome,
          totalRevenue: summary.cashBasis.totalOperatingInflow,
        },
        costOfDelivery: {
          commissionLiabilities: summary.cashBasis.totalCommissionCost,
          totalCOGS: summary.cashBasis.totalCommissionCost,
        },
        grossProfit: summary.cashBasis.totalOperatingInflow - summary.cashBasis.totalCommissionCost,
        grossMarginPercent: summary.cashBasis.totalOperatingInflow > 0
          ? parseFloat((((summary.cashBasis.totalOperatingInflow - summary.cashBasis.totalCommissionCost) / summary.cashBasis.totalOperatingInflow) * 100).toFixed(2))
          : 0,
        operatingExpenses: expenseBreakdown.categorySummary,
        totalOperatingExpenses: summary.cashBasis.totalOperatingExpenses,
        operatingProfit: summary.cashBasis.realizedNetProfit,
        netProfitMarginPercent: summary.cashBasis.realizedProfitMargin,
        accrualComparison: {
          totalBookedRevenue: summary.accrualBasis.totalBookedRevenue,
          projectedNetProfit: summary.accrualBasis.projectedNetProfit,
          projectedProfitMargin: summary.accrualBasis.projectedProfitMargin,
          uncollectedReceivables: summary.accrualBasis.pendingReceivables,
        },
      };

      return res.json({
        success: true,
        statement,
        period: summary.period,
      });
    } catch (err) {
      console.error('[accountsController:getProfitLoss] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/cash-flow
   * Direct Cash Flow Statement
   */
  getCashFlow: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const telemetry = await leadHunterService.getTelemetry({ actor: (req.user || req.adminUser) });
      const coreExpenses = await CoreExpense.find().lean();
      const adjustments = await AccountAdjustment.find({ status: { $in: ['approved', 'applied'] } }).lean();

      const summary = financialCalculationService.computeFinancialSummary({
        sales: telemetry.data?.sales || [],
        inflows: telemetry.data?.inflows || [],
        leadHunterExpenses: telemetry.data?.expenses || [],
        coreExpenses,
        commissions: telemetry.data?.commissions || [],
        adjustments,
        startDate,
        endDate,
      });

      const cashFlow = {
        operatingActivities: {
          salesAdvancesReceived: summary.cashBasis.realizedSalesInflow,
          otherOperatingInflows: summary.cashBasis.totalOtherIncome,
          operatingExpensesPaid: -summary.cashBasis.totalOperatingExpenses,
          commissionsPaid: -summary.cashBasis.totalCommissionCost,
          netOperatingCashFlow: summary.cashBasis.realizedNetProfit,
        },
        financingActivities: {
          investmentCapitalInflows: summary.cashBasis.totalInvestment,
          administrativeAdjustments: adjustments.reduce((s, a) => s + (Number(a.amount) || 0), 0),
          netFinancingCashFlow: summary.cashBasis.totalInvestment,
        },
        netCashChange: summary.cashBasis.netCashFlow,
      };

      return res.json({
        success: true,
        cashFlow,
        period: summary.period,
      });
    } catch (err) {
      console.error('[accountsController:getCashFlow] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/reconciliation
   * Discrepancy Audits and Adjustments
   */
  getReconciliation: async (req, res) => {
    try {
      const telemetry = await leadHunterService.getTelemetry({ actor: (req.user || req.adminUser) });
      const adjustments = await AccountAdjustment.find().sort({ createdAt: -1 }).lean();

      const audit = financialCalculationService.auditReconciliation({
        sales: telemetry.data?.sales || [],
        inflows: telemetry.data?.inflows || [],
        expenses: telemetry.data?.expenses || [],
        commissions: telemetry.data?.commissions || [],
        adjustments,
      });

      return res.json({
        success: true,
        ...audit,
        adjustments,
      });
    } catch (err) {
      console.error('[accountsController:getReconciliation] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/adjustments
   * Administrative Adjustments
   */
  getAdjustments: async (req, res) => {
    try {
      const adjustments = await AccountAdjustment.find().sort({ createdAt: -1 }).lean();
      return res.json({ success: true, adjustments });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/accounts/adjustments
   * Post Controlled Administrative Adjustment
   */
  createAdjustment: async (req, res) => {
    try {
      const {
        title,
        adjustmentType,
        amount,
        reason,
        effectiveDate,
        targetEntity,
        targetId,
        impactCategory,
      } = req.body;

      if (!title || !adjustmentType || amount === undefined || Number(amount) === 0 || !reason) {
        return res.status(400).json({ success: false, message: 'Title, adjustment type, non-zero amount, and reason are required.' });
      }

      const adjustment = await AccountAdjustment.create({
        title: title.trim(),
        adjustmentType,
        amount: Number(amount),
        reason: reason.trim(),
        effectiveDate: effectiveDate ? new Date(effectiveDate) : new Date(),
        targetEntity: targetEntity || 'general',
        targetId: targetId || null,
        impactCategory: impactCategory || 'cash_flow',
        status: 'applied',
        createdBy: {
          id: (req.user || req.adminUser)?._id,
          name: (req.user || req.adminUser)?.name || 'Admin',
          email: (req.user || req.adminUser)?.email || 'admin@megatrix.internal',
        },
        approvedBy: {
          id: (req.user || req.adminUser)?._id,
          name: (req.user || req.adminUser)?.name || 'Admin',
          email: (req.user || req.adminUser)?.email || 'admin@megatrix.internal',
        },
      });

      await logFinancialAudit(req, 'CREATE_ACCOUNT_ADJUSTMENT', 'ADJUSTMENT', adjustment._id, {
        title: adjustment.title,
        amount: adjustment.amount,
        type: adjustment.adjustmentType,
        reason: adjustment.reason,
      });

      return res.status(201).json({
        success: true,
        message: 'Administrative adjustment recorded and applied.',
        adjustment,
      });
    } catch (err) {
      console.error('[accountsController:createAdjustment] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/accounts/sync
   * Trigger Manual Live Sync with LeadHunter
   */
  triggerSync: async (req, res) => {
    try {
      const telemetry = await leadHunterService.getTelemetry({
        isManual: true,
        actor: (req.user || req.adminUser),
      });

      await logFinancialAudit(req, 'TRIGGER_ACCOUNTS_SYNC', 'SYSTEM', telemetry.meta?.syncId, {
        mode: telemetry.meta?.mode,
        durationMs: telemetry.meta?.durationMs,
      });

      return res.json({
        success: true,
        message: 'Synchronized successfully with LeadHunter.',
        meta: telemetry.meta,
        summary: telemetry.summary,
      });
    } catch (err) {
      console.error('[accountsController:triggerSync] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/sync/logs
   * Synchronization Audit History
   */
  getSyncLogs: async (req, res) => {
    try {
      const logs = await AccountSyncLog.find().sort({ startedAt: -1 }).limit(30).lean();
      const lastStatus = await leadHunterService.getLastSyncStatus();

      return res.json({
        success: true,
        logs,
        lastStatus,
      });
    } catch (err) {
      console.error('[accountsController:getSyncLogs] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/export/excel
   * Export Multi-Tab Financial Excel Workbook
   */
  exportExcel: async (req, res) => {
    try {
      const telemetry = await leadHunterService.getTelemetry({ actor: (req.user || req.adminUser) });
      const coreExpenses = await CoreExpense.find().lean();
      const adjustments = await AccountAdjustment.find({ status: { $in: ['approved', 'applied'] } }).lean();

      const rawSales = telemetry.data?.sales || [];
      const rawInflows = telemetry.data?.inflows || [];
      const rawLhExpenses = telemetry.data?.expenses || [];
      const rawProjects = telemetry.data?.projects || [];
      const rawCommissions = telemetry.data?.commissions || [];

      const summary = financialCalculationService.computeFinancialSummary({
        sales: rawSales,
        inflows: rawInflows,
        leadHunterExpenses: rawLhExpenses,
        coreExpenses,
        commissions: rawCommissions,
        adjustments,
      });

      const aging = financialCalculationService.computeReceivablesAging(rawSales);
      const expenseBreakdown = financialCalculationService.computeExpenseBreakdown(rawLhExpenses, coreExpenses);
      const projectFinancials = financialCalculationService.computeProjectFinancials(rawProjects, rawSales, rawLhExpenses);

      const buffer = await accountExportService.generateExcelWorkbook({
        summary,
        sales: rawSales,
        inflows: rawInflows,
        expenses: expenseBreakdown.unifiedList,
        commissions: rawCommissions,
        aging,
        projects: projectFinancials,
        generatedBy: (req.user || req.adminUser)?.name || 'MegaTrix Core Admin',
      });

      await logFinancialAudit(req, 'EXPORT_FINANCIAL_EXCEL', 'REPORT', 'EXCEL', {
        salesCount: rawSales.length,
        inflowCount: rawInflows.length,
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=MegaTrix_Financial_Dossier_${new Date().toISOString().slice(0, 10)}.xlsx`);
      return res.send(buffer);
    } catch (err) {
      console.error('[accountsController:exportExcel] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/accounts/export/pdf
   * Export Executive PDF Financial Report Dossier
   */
  exportPdf: async (req, res) => {
    try {
      const telemetry = await leadHunterService.getTelemetry({ actor: (req.user || req.adminUser) });
      const coreExpenses = await CoreExpense.find().lean();
      const adjustments = await AccountAdjustment.find({ status: { $in: ['approved', 'applied'] } }).lean();

      const rawSales = telemetry.data?.sales || [];
      const rawInflows = telemetry.data?.inflows || [];
      const rawLhExpenses = telemetry.data?.expenses || [];
      const rawCommissions = telemetry.data?.commissions || [];

      const summary = financialCalculationService.computeFinancialSummary({
        sales: rawSales,
        inflows: rawInflows,
        leadHunterExpenses: rawLhExpenses,
        coreExpenses,
        commissions: rawCommissions,
        adjustments,
      });

      const aging = financialCalculationService.computeReceivablesAging(rawSales);
      const expenseBreakdown = financialCalculationService.computeExpenseBreakdown(rawLhExpenses, coreExpenses);

      const buffer = await accountExportService.generatePdfDossier({
        summary,
        aging,
        commissions: rawCommissions,
        expenses: expenseBreakdown.unifiedList,
        generatedBy: (req.user || req.adminUser)?.name || 'MegaTrix Core Admin',
      });

      await logFinancialAudit(req, 'EXPORT_FINANCIAL_PDF', 'REPORT', 'PDF', {
        generatedAt: new Date().toISOString(),
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

export default accountsController;
