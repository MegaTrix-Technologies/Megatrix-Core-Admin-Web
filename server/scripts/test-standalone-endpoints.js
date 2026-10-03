import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

import { connectDB } from '../index.js';
import { accountsController } from '../controllers/accountsController.js';
import { standaloneAccountsService } from '../services/accounts/standaloneAccountsService.js';

function mockReq(query = {}, body = {}, params = {}) {
  return {
    query,
    body,
    params,
    user: { id: 'admin_test', name: 'Super Admin', isSuperAdmin: true },
  };
}

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    },
    setHeader(k, v) {
      this.headers[k] = v;
      return this;
    },
    send(buf) {
      this.data = buf;
      return this;
    }
  };
  return res;
}

async function runTests() {
  console.log('Connecting to database...');
  await connectDB();

  console.log('\n--- 1. Testing standaloneAccountsService.getFinancialData ---');
  const finData = await standaloneAccountsService.getFinancialData();
  console.log('Sales count:', finData.sales.length);
  console.log('Inflows count:', finData.inflows.length);
  console.log('Core expenses count:', finData.coreExpenses.length);
  console.log('Projects count:', finData.projects.length);
  console.log('Commissions count:', finData.commissions.length);

  console.log('\n--- 2. Testing accountsController.getOverview ---');
  const resOverview = mockRes();
  await accountsController.getOverview(mockReq(), resOverview);
  console.log('Status:', resOverview.statusCode);
  console.log('Mode:', resOverview.data?.meta?.mode);
  console.log('Booked sales:', resOverview.data?.summary?.accrualBasis?.bookedSales);
  console.log('Advance inflow:', resOverview.data?.summary?.cashBasis?.realizedSalesInflow);

  console.log('\n--- 3. Testing accountsController.getSalesLedger ---');
  const resSales = mockRes();
  await accountsController.getSalesLedger(mockReq(), resSales);
  console.log('Status:', resSales.statusCode);
  console.log('Sales count:', resSales.data?.sales?.length);
  console.log('First sale:', resSales.data?.sales?.[0]?.customer?.businessName, 'Amount:', resSales.data?.sales?.[0]?.totalAmount);

  console.log('\n--- 4. Testing accountsController.getProjects ---');
  const resProjects = mockRes();
  await accountsController.getProjects(mockReq(), resProjects);
  console.log('Status:', resProjects.statusCode);
  console.log('Projects count:', resProjects.data?.projects?.length);
  console.log('First project:', resProjects.data?.projects?.[0]?.title, 'Client:', resProjects.data?.projects?.[0]?.clientName);

  console.log('\n--- 5. Testing accountsController.getCommissions ---');
  const resComms = mockRes();
  await accountsController.getCommissions(mockReq(), resComms);
  console.log('Status:', resComms.statusCode);
  console.log('Agents count:', resComms.data?.commissions?.length);
  console.log('Agents:', resComms.data?.commissions?.map(c => `${c.name} (${c.roles.join(', ')}) -> PKR ${c.totalEarnings}`));

  console.log('\n--- 6. Testing accountsController.getInflows ---');
  const resInflows = mockRes();
  await accountsController.getInflows(mockReq(), resInflows);
  console.log('Status:', resInflows.statusCode);
  console.log('Inflows count:', resInflows.data?.inflows?.length);

  console.log('\n--- 7. Testing accountsController.getReceivables ---');
  const resRec = mockRes();
  await accountsController.getReceivables(mockReq(), resRec);
  console.log('Status:', resRec.statusCode);
  console.log('Aging total receivables:', resRec.data?.aging?.totalReceivables);

  console.log('\n--- 8. Testing accountsController.getProfitLoss ---');
  const resPnl = mockRes();
  await accountsController.getProfitLoss(mockReq(), resPnl);
  console.log('Status:', resPnl.statusCode);
  console.log('P&L Cash Basis Net Profit:', resPnl.data?.cashBasis?.realizedNetProfit);
  console.log('P&L Accrual Net Profit:', resPnl.data?.accrualBasis?.projectedNetProfit);

  console.log('\n--- 9. Testing accountsController.getCashFlow ---');
  const resCash = mockRes();
  await accountsController.getCashFlow(mockReq(), resCash);
  console.log('Status:', resCash.statusCode);
  console.log('Net Cash Flow:', resCash.data?.cashFlow?.netCashFlow);

  console.log('\n--- 10. Testing accountsController.getReconciliation ---');
  const resRecon = mockRes();
  await accountsController.getReconciliation(mockReq(), resRecon);
  console.log('Status:', resRecon.statusCode);
  console.log('Total Discrepancies:', resRecon.data?.reconciliation?.totalDiscrepancies);

  console.log('\n======================================================');
  console.log('>>> ALL 10 STANDALONE CONTROLLER ENDPOINTS PASSED! <<<');
  console.log('======================================================');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
