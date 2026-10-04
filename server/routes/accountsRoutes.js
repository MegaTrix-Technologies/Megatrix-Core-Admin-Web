import express from 'express';
import { accountsController } from '../controllers/accountsController.js';
import { verifyAdminToken, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Apply verifyAdminToken to all accounts routes
router.use(verifyAdminToken);

// 1. Overview & High-level Financial KPIs
router.get(
  '/overview',
  requirePermission('global:accounts:overview:view'),
  accountsController.getOverview
);

// 2. Sales & Contract Revenue Ledger
router.get(
  '/sales',
  requirePermission('global:accounts:sales:view'),
  accountsController.getSalesLedger
);
router.post(
  '/sales',
  requirePermission('global:accounts:sales:view'),
  accountsController.createSale
);
router.get(
  '/sales/:id',
  requirePermission('global:accounts:sales:view'),
  accountsController.getSaleDetail
);
router.put(
  '/sales/:id',
  requirePermission('global:accounts:sales:view'),
  accountsController.updateSale
);
router.post(
  '/sales/:id/payments',
  requirePermission('global:accounts:sales:view'),
  accountsController.recordSalePayment
);

// 3. Project Unit Economics & Profitability
router.get(
  '/projects',
  requirePermission('global:accounts:projects:view'),
  accountsController.getProjects
);

// 4. Commission Liabilities & Agent Leaderboard
router.get(
  '/commissions',
  requirePermission('global:accounts:commissions:view'),
  accountsController.getCommissions
);

// 5. Receivables Aging Buckets
router.get(
  '/receivables',
  requirePermission('global:accounts:receivables:view'),
  accountsController.getReceivables
);

// 6. Cash Inflows Ledger
router.get(
  '/inflows',
  requirePermission('global:accounts:inflows:view'),
  accountsController.getInflows
);
router.post(
  '/inflows',
  requirePermission('global:accounts:inflows:view'),
  accountsController.createInflow
);
router.delete(
  '/inflows/:id',
  requirePermission('global:accounts:inflows:view'),
  accountsController.deleteInflow
);

// 7. Consolidated Operating Expenses
router.get(
  '/expenses',
  requirePermission('global:accounts:expenses:view'),
  accountsController.getExpenses
);
router.post(
  '/expenses/core',
  requirePermission('global:accounts:expenses:create'),
  accountsController.createCoreExpense
);
router.put(
  '/expenses/core/:id',
  requirePermission('global:accounts:expenses:edit'),
  accountsController.updateCoreExpense
);
router.delete(
  '/expenses/core/:id',
  requirePermission('global:accounts:expenses:delete'),
  accountsController.deleteCoreExpense
);

// 8. Profit & Loss Statement (P&L)
router.get(
  '/pnl',
  requirePermission('global:accounts:pnl:view'),
  accountsController.getProfitLoss
);

// 9. Direct Cash Flow Statement
router.get(
  '/cash-flow',
  requirePermission('global:accounts:cash_flow:view'),
  accountsController.getCashFlow
);

// 10. Discrepancy Audits & Reconciliation
router.get(
  '/reconciliation',
  requirePermission('global:accounts:reconciliation:view'),
  accountsController.getReconciliation
);
router.get(
  '/adjustments',
  requirePermission('global:accounts:reconciliation:view'),
  accountsController.getAdjustments
);
router.post(
  '/adjustments',
  requirePermission('global:accounts:reconciliation:adjust'),
  accountsController.createAdjustment
);

// 11. CRM Sync Engine & Sales Agents Roster
router.get(
  '/sales-agents',
  requirePermission('global:accounts:sales:view'),
  accountsController.getSalesAgents
);
router.post(
  '/crm-sync/preview',
  requirePermission('global:accounts:sync:execute'),
  accountsController.previewCrmSync
);
router.post(
  '/crm-sync/execute',
  requirePermission('global:accounts:sync:execute'),
  accountsController.executeCrmSync
);
router.post(
  '/sync',
  requirePermission('global:accounts:sync:execute'),
  accountsController.triggerSync
);
router.get(
  '/sync/logs',
  requirePermission('global:accounts:sync:view'),
  accountsController.getSyncLogs
);

// 12. Executive Reports Export (Excel & PDF)
router.get(
  '/export/excel',
  requirePermission('global:accounts:reports:export'),
  accountsController.exportExcel
);
router.get(
  '/export/pdf',
  requirePermission('global:accounts:reports:export'),
  accountsController.exportPdf
);

export default router;
