import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export const accountExportService = {
  /**
   * Generate Multi-Tab Professional Financial Excel (.xlsx) Workbook
   */
  generateExcelWorkbook: async ({
    summary = {},
    sales = [],
    inflows = [],
    expenses = [],
    commissions = [],
    aging = {},
    projects = [],
    generatedBy = 'MegaTrix Core Admin',
  }) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = generatedBy;
    workbook.created = new Date();

    // Style Helpers
    const headerFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' }, // Dark slate
    };
    const headerFont = {
      name: 'Calibri',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
    const titleFont = {
      name: 'Calibri',
      size: 16,
      bold: true,
      color: { argb: 'FF0F172A' },
    };
    const currencyFormat = '"PKR " #,##0;("-PKR " #,##0);"-"';
    const percentFormat = '0.0%';

    // ==========================================
    // TAB 1: EXECUTIVE SUMMARY
    // ==========================================
    const summarySheet = workbook.addWorksheet('Executive Summary', { views: [{ showGridLines: true }] });
    summarySheet.columns = [
      { width: 35 },
      { width: 22 },
      { width: 35 },
      { width: 22 },
    ];

    summarySheet.addRow(['MEGATRIX GLOBAL FINANCIAL DOSSIER', '']);
    summarySheet.getCell('A1').font = titleFont;
    summarySheet.addRow([`Generated: ${new Date().toLocaleString()} | By: ${generatedBy}`, '']);
    summarySheet.addRow([]);

    summarySheet.addRow(['CASH BASIS (REALIZED FLOWS)', 'AMOUNT', 'ACCRUAL BASIS (CONTRACTED)', 'AMOUNT']);
    const hRow1 = summarySheet.getRow(4);
    hRow1.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const cash = summary.cashBasis || {};
    const accrual = summary.accrualBasis || {};
    const cost = summary.consolidatedCost || {};

    summarySheet.addRow(['Realized Sales Cash Inflow', cash.realizedSalesInflow || 0, 'Total Booked Sales Revenue', accrual.bookedSales || 0]);
    summarySheet.addRow(['Other Inflows & Income', cash.totalOtherIncome || 0, 'Other Income', accrual.totalOtherIncome || 0]);
    summarySheet.addRow(['Investment Capital Inflows', cash.totalInvestment || 0, 'Total Effective Revenue', accrual.totalBookedRevenue || 0]);
    summarySheet.addRow(['Direct Operating Expenses', cost.leadHunterExpenses || cost.coreExpenses || 0, 'Total Operating Expenses', accrual.totalOperatingExpenses || 0]);
    summarySheet.addRow(['MegaTrix Core Expenses', cost.coreExpenses || 0, 'Commission Liabilities', accrual.totalCommissionLiability || 0]);
    summarySheet.addRow(['Total Commission Costs', cash.totalCommissionCost || 0, 'Total Accrued Cost', accrual.totalAccruedCost || 0]);
    summarySheet.addRow(['Realized Net Operating Profit', cash.realizedNetProfit || 0, 'Projected / Accrual Net Profit', accrual.projectedNetProfit || 0]);
    summarySheet.addRow(['Realized Profit Margin %', (cash.realizedProfitMargin || 0) / 100, 'Projected Profit Margin %', (accrual.projectedProfitMargin || 0) / 100]);
    summarySheet.addRow(['Net Direct Cash Flow', cash.netCashFlow || 0, '', '']);

    // Format currency & percentage cells
    for (let r = 5; r <= 13; r++) {
      summarySheet.getCell(`B${r}`).numFmt = currencyFormat;
      if (r !== 13) summarySheet.getCell(`D${r}`).numFmt = currencyFormat;
    }
    summarySheet.getCell('B13').numFmt = percentFormat;
    summarySheet.getCell('D13').numFmt = percentFormat;
    summarySheet.getCell('B14').numFmt = currencyFormat;

    // Highlight key profit rows
    summarySheet.getRow(12).font = { bold: true };
    summarySheet.getRow(13).font = { bold: true };
    summarySheet.getRow(14).font = { bold: true };

    // ==========================================
    // TAB 2: CONSOLIDATED SALES LEDGER
    // ==========================================
    const salesSheet = workbook.addWorksheet('Sales Ledger', { views: [{ showGridLines: true }] });
    salesSheet.columns = [
      { header: 'Sale ID', key: 'id', width: 26 },
      { header: 'Customer / Business', key: 'customer', width: 30 },
      { header: 'Status', key: 'status', width: 18 },
      { header: 'Deal Value', key: 'total', width: 16 },
      { header: 'Advance / Paid', key: 'paid', width: 16 },
      { header: 'Remaining Balance', key: 'balance', width: 18 },
      { header: 'Lead Generator', key: 'leadGen', width: 22 },
      { header: 'Closer', key: 'closer', width: 22 },
      { header: 'Commission Liability', key: 'commission', width: 20 },
      { header: 'Closed Date', key: 'closedAt', width: 18 },
    ];
    salesSheet.getRow(1).eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
    });

    sales.forEach((s) => {
      salesSheet.addRow({
        id: String(s._id || ''),
        customer: s.customer?.businessName || s.customer?.name || 'Client',
        status: s.status || 'advance_paid',
        total: Number(s.totalAmount) || 0,
        paid: Number(s.advanceAmount) || 0,
        balance: s.remainingAmount !== undefined ? Number(s.remainingAmount) : Math.max(0, (s.totalAmount || 0) - (s.advanceAmount || 0)),
        leadGen: s.leadGeneratedByName || s.leadGeneratedBy?.name || 'N/A',
        closer: s.closedByName || s.closedBy?.name || 'N/A',
        commission: Number(s.estimatedCommission) || 0,
        closedAt: s.closedAt ? new Date(s.closedAt).toLocaleDateString() : '',
      });
    });

    salesSheet.getColumn('total').numFmt = currencyFormat;
    salesSheet.getColumn('paid').numFmt = currencyFormat;
    salesSheet.getColumn('balance').numFmt = currencyFormat;
    salesSheet.getColumn('commission').numFmt = currencyFormat;

    // ==========================================
    // TAB 3: COMMISSION LIABILITIES & AGENTS
    // ==========================================
    const commSheet = workbook.addWorksheet('Commissions', { views: [{ showGridLines: true }] });
    commSheet.columns = [
      { header: 'Agent Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Roles', key: 'roles', width: 22 },
      { header: 'Deals Closed', key: 'deals', width: 14 },
      { header: 'Direct Earnings', key: 'direct', width: 18 },
      { header: 'Referral Earnings', key: 'referral', width: 18 },
      { header: 'Total Earned', key: 'total', width: 18 },
    ];
    commSheet.getRow(1).eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
    });

    commissions.forEach((c) => {
      commSheet.addRow({
        name: c.name || 'Agent',
        email: c.email || '',
        roles: Array.isArray(c.roles) ? c.roles.join(', ') : '',
        deals: c.dealsCount || 0,
        direct: Number(c.directEarnings) || 0,
        referral: Number(c.referralEarnings) || 0,
        total: Number(c.totalEarnings) || 0,
      });
    });

    commSheet.getColumn('direct').numFmt = currencyFormat;
    commSheet.getColumn('referral').numFmt = currencyFormat;
    commSheet.getColumn('total').numFmt = currencyFormat;

    // ==========================================
    // TAB 4: RECEIVABLES AGING
    // ==========================================
    const agingSheet = workbook.addWorksheet('Receivables Aging', { views: [{ showGridLines: true }] });
    agingSheet.columns = [
      { header: 'Sale ID', key: 'saleId', width: 26 },
      { header: 'Customer', key: 'clientName', width: 28 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Area', key: 'area', width: 16 },
      { header: 'Total Deal', key: 'totalAmount', width: 16 },
      { header: 'Paid to Date', key: 'advanceAmount', width: 16 },
      { header: 'Outstanding Due', key: 'remainingAmount', width: 18 },
      { header: 'Days Overdue', key: 'daysOutstanding', width: 14 },
      { header: 'Risk Score', key: 'riskLevel', width: 14 },
      { header: 'Closer', key: 'closerName', width: 20 },
    ];
    agingSheet.getRow(1).eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
    });

    const buckets = aging.buckets || {};
    Object.keys(buckets).forEach((bKey) => {
      (buckets[bKey]?.items || []).forEach((item) => {
        agingSheet.addRow({
          saleId: String(item.saleId || ''),
          clientName: item.clientName || 'Client',
          phone: item.phone || '',
          area: item.area || '',
          totalAmount: Number(item.totalAmount) || 0,
          advanceAmount: Number(item.advanceAmount) || 0,
          remainingAmount: Number(item.remainingAmount) || 0,
          daysOutstanding: item.daysOutstanding || 0,
          riskLevel: item.riskLevel || 'Low',
          closerName: item.closerName || '',
        });
      });
    });

    agingSheet.getColumn('totalAmount').numFmt = currencyFormat;
    agingSheet.getColumn('advanceAmount').numFmt = currencyFormat;
    agingSheet.getColumn('remainingAmount').numFmt = currencyFormat;

    // ==========================================
    // TAB 5: CASH INFLOWS & DEPOSITS
    // ==========================================
    const inflowSheet = workbook.addWorksheet('Cash Inflows', { views: [{ showGridLines: true }] });
    inflowSheet.columns = [
      { header: 'TX ID', key: 'id', width: 26 },
      { header: 'Date', key: 'date', width: 16 },
      { header: 'Inflow Type', key: 'type', width: 20 },
      { header: 'Title / Description', key: 'title', width: 30 },
      { header: 'Payment Method', key: 'method', width: 18 },
      { header: 'Amount', key: 'amount', width: 16 },
      { header: 'Status', key: 'status', width: 14 },
    ];
    inflowSheet.getRow(1).eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
    });

    inflows.forEach((inf) => {
      inflowSheet.addRow({
        id: String(inf._id || ''),
        date: inf.date ? new Date(inf.date).toLocaleDateString() : '',
        type: inf.type || 'sales_advance',
        title: inf.title || inf.description || 'Cash Inflow',
        method: inf.paymentMethod || 'Bank',
        amount: Number(inf.amount) || 0,
        status: inf.status || 'completed',
      });
    });

    inflowSheet.getColumn('amount').numFmt = currencyFormat;

    // ==========================================
    // TAB 6: CONSOLIDATED EXPENSES
    // ==========================================
    const expSheet = workbook.addWorksheet('Operating Expenses', { views: [{ showGridLines: true }] });
    expSheet.columns = [
      { header: 'Expense ID', key: 'id', width: 26 },
      { header: 'Origin Source', key: 'source', width: 18 },
      { header: 'Category', key: 'category', width: 24 },
      { header: 'Title / Memo', key: 'title', width: 30 },
      { header: 'Vendor / Entity', key: 'vendor', width: 22 },
      { header: 'Payment Method', key: 'method', width: 18 },
      { header: 'Amount', key: 'amount', width: 16 },
      { header: 'Date', key: 'date', width: 16 },
      { header: 'Status', key: 'status', width: 14 },
    ];
    expSheet.getRow(1).eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
    });

    expenses.forEach((e) => {
      expSheet.addRow({
        id: String(e._id || ''),
        source: 'MegaTrix Core',
        category: e.categoryLabel || e.category || 'General',
        title: e.title || e.description || 'Expense',
        vendor: e.vendor || 'N/A',
        method: e.paymentMethod || 'Corporate',
        amount: Number(e.amount) || 0,
        date: e.date ? new Date(e.date).toLocaleDateString() : '',
        status: e.status || 'paid',
      });
    });

    expSheet.getColumn('amount').numFmt = currencyFormat;

    // ==========================================
    // TAB 7: PROJECT UNIT ECONOMICS
    // ==========================================
    const projSheet = workbook.addWorksheet('Project Financials', { views: [{ showGridLines: true }] });
    projSheet.columns = [
      { header: 'Project Name', key: 'title', width: 28 },
      { header: 'Client', key: 'client', width: 24 },
      { header: 'Status', key: 'status', width: 16 },
      { header: 'Contract Value', key: 'revenue', width: 16 },
      { header: 'Cash Collected', key: 'collected', width: 16 },
      { header: 'Receivables Due', key: 'receivables', width: 16 },
      { header: 'Direct Costs', key: 'costs', width: 16 },
      { header: 'Net Contribution', key: 'net', width: 16 },
      { header: 'Margin %', key: 'margin', width: 14 },
      { header: 'Health Score', key: 'health', width: 16 },
    ];
    projSheet.getRow(1).eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
    });

    projects.forEach((p) => {
      projSheet.addRow({
        title: p.title || 'Project',
        client: p.clientName || 'Client',
        status: p.status || 'in_progress',
        revenue: Number(p.contractRevenue) || 0,
        collected: Number(p.cashCollected) || 0,
        receivables: Number(p.receivables) || 0,
        costs: Number(p.totalProjectCost) || 0,
        net: Number(p.netContribution) || 0,
        margin: (p.netMarginPercent || 0) / 100,
        health: p.healthStatus || 'Healthy',
      });
    });

    projSheet.getColumn('revenue').numFmt = currencyFormat;
    projSheet.getColumn('collected').numFmt = currencyFormat;
    projSheet.getColumn('receivables').numFmt = currencyFormat;
    projSheet.getColumn('costs').numFmt = currencyFormat;
    projSheet.getColumn('net').numFmt = currencyFormat;
    projSheet.getColumn('margin').numFmt = percentFormat;

    return await workbook.xlsx.writeBuffer();
  },

  /**
   * Generate Executive Financial PDF Dossier using PDFKit
   */
  generatePdfDossier: async ({
    summary = {},
    aging = {},
    commissions = [],
    expenses = [],
    generatedBy = 'MegaTrix Core Admin',
  }) => {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        const buffers = [];

        doc.on('data', (buffer) => buffers.push(buffer));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err) => reject(err));

        const primaryColor = '#0F172A';
        const accentColor = '#3B82F6';
        const textMuted = '#64748B';
        const borderColor = '#CBD5E1';

        // Helper: Format Currency (PKR)
        const fmt = (num = 0) => {
          const val = Number(num) || 0;
          const formatted = Math.abs(val).toLocaleString('en-PK', { maximumFractionDigits: 0 });
          return val < 0 ? `-PKR ${formatted}` : `PKR ${formatted}`;
        };

        // ==========================================
        // HEADER BANNER
        // ==========================================
        doc.rect(40, 40, 515, 60).fill(primaryColor);
        doc.fillColor('#FFFFFF').fontSize(18).font('Helvetica-Bold').text('MEGATRIX GLOBAL COMMAND CENTER', 55, 52);
        doc.fontSize(10).font('Helvetica').fillColor('#94A3B8').text('Consolidated Financial Intelligence & Executive Audit Dossier', 55, 75);

        doc.fillColor(textMuted).fontSize(8).text(`Generated: ${new Date().toLocaleString()} | Operator: ${generatedBy}`, 55, 110);
        doc.moveTo(40, 122).lineTo(555, 122).stroke(borderColor);

        // ==========================================
        // SECTION 1: EXECUTIVE KPI SCORECARD
        // ==========================================
        let y = 135;
        doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('1. EXECUTIVE FINANCIAL SCORECARD', 40, y);
        y += 20;

        const cash = summary.cashBasis || {};
        const accrual = summary.accrualBasis || {};
        const cost = summary.consolidatedCost || {};

        // 4 KPI Cards
        const cardWidth = 120;
        const cardHeight = 50;
        const gap = 11;

        const cards = [
          { label: 'Realized Cash Inflow', val: fmt(cash.totalCashInflow), color: '#10B981' },
          { label: 'Booked Contract Value', val: fmt(accrual.bookedSales), color: '#3B82F6' },
          { label: 'Total Operating Costs', val: fmt(cost.totalCost), color: '#EF4444' },
          { label: 'Realized Net Profit', val: fmt(cash.realizedNetProfit), color: cash.realizedNetProfit >= 0 ? '#10B981' : '#EF4444' },
        ];

        cards.forEach((c, idx) => {
          const cx = 40 + idx * (cardWidth + gap);
          doc.rect(cx, y, cardWidth, cardHeight).fillAndStroke('#F8FAFC', borderColor);
          doc.fillColor(textMuted).fontSize(7).font('Helvetica-Bold').text(c.label.toUpperCase(), cx + 8, y + 8, { width: cardWidth - 16 });
          doc.fillColor(c.color).fontSize(12).font('Helvetica-Bold').text(c.val, cx + 8, y + 26);
        });

        y += cardHeight + 25;

        // ==========================================
        // SECTION 2: DUAL-BASIS COMPARISON TABLE
        // ==========================================
        doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('2. DUAL-BASIS ACCOUNTING COMPARISON', 40, y);
        y += 18;

        // Table Header
        doc.rect(40, y, 515, 20).fill('#1E293B');
        doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold');
        doc.text('FINANCIAL METRIC', 50, y + 6);
        doc.text('CASH BASIS (REALIZED)', 250, y + 6);
        doc.text('ACCRUAL BASIS (CONTRACTED)', 390, y + 6);
        y += 20;

        const rows = [
          ['Sales & Contract Revenue', fmt(cash.realizedSalesInflow), fmt(accrual.bookedSales)],
          ['Other Income & Capital', fmt(cash.totalOtherIncome + (cash.totalInvestment || 0)), fmt(accrual.totalOtherIncome)],
          ['Total Effective Inflow / Bookings', fmt(cash.totalCashInflow), fmt(accrual.totalBookedRevenue)],
          ['Operating Expenses', fmt(cost.leadHunterExpenses + cost.coreExpenses), fmt(accrual.totalOperatingExpenses)],
          ['Commission Liabilities & Cost', fmt(cash.totalCommissionCost), fmt(accrual.totalCommissionLiability)],
          ['Net Profit Before Adjustments', fmt(cash.realizedNetProfit), fmt(accrual.projectedNetProfit)],
          ['Operating Profit Margin %', `${cash.realizedProfitMargin || 0}%`, `${accrual.projectedProfitMargin || 0}%`],
        ];

        rows.forEach((r, idx) => {
          const bg = idx % 2 === 0 ? '#FFFFFF' : '#F1F5F9';
          doc.rect(40, y, 515, 18).fillAndStroke(bg, borderColor);
          doc.fillColor(primaryColor).fontSize(8).font(idx === 5 || idx === 6 ? 'Helvetica-Bold' : 'Helvetica');
          doc.text(r[0], 50, y + 5);
          doc.text(r[1], 250, y + 5);
          doc.text(r[2], 390, y + 5);
          y += 18;
        });

        y += 20;

        // ==========================================
        // SECTION 3: RECEIVABLES AGING SUMMARY
        // ==========================================
        doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('3. RECEIVABLES AGING BREAKDOWN', 40, y);
        y += 18;

        doc.rect(40, y, 515, 20).fill('#1E293B');
        doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold');
        doc.text('AGING BUCKET', 50, y + 6);
        doc.text('TOTAL DUE', 220, y + 6);
        doc.text('DEALS COUNT', 340, y + 6);
        doc.text('PORTFOLIO SHARE', 440, y + 6);
        y += 20;

        const buckets = aging.buckets || {};
        const bKeys = [
          { key: 'current', label: 'Current (On Schedule)' },
          { key: 'days1_30', label: '1 - 30 Days Overdue' },
          { key: 'days31_60', label: '31 - 60 Days Overdue' },
          { key: 'days61_90', label: '61 - 90 Days Overdue' },
          { key: 'days90_plus', label: '90+ Days (High Risk)' },
        ];

        bKeys.forEach((bk, idx) => {
          const b = buckets[bk.key] || { amount: 0, count: 0, percentage: 0 };
          const bg = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
          doc.rect(40, y, 515, 18).fillAndStroke(bg, borderColor);
          doc.fillColor(bk.key === 'days90_plus' && b.amount > 0 ? '#DC2626' : primaryColor).fontSize(8).font('Helvetica');
          doc.text(bk.label, 50, y + 5);
          doc.text(fmt(b.amount), 220, y + 5);
          doc.text(String(b.count), 340, y + 5);
          doc.text(`${b.percentage || 0}%`, 440, y + 5);
          y += 18;
        });

        y += 25;

        // ==========================================
        // SECTION 4: TOP AGENT COMMISSIONS & FOOTER
        // ==========================================
        doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('4. AGENT COMMISSION LIABILITIES (TOP EARNERS)', 40, y);
        y += 18;

        doc.rect(40, y, 515, 20).fill('#1E293B');
        doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold');
        doc.text('AGENT NAME', 50, y + 6);
        doc.text('DEALS', 220, y + 6);
        doc.text('DIRECT EARNINGS', 300, y + 6);
        doc.text('TOTAL EARNINGS', 430, y + 6);
        y += 20;

        const topAgents = commissions.slice(0, 4);
        if (topAgents.length === 0) {
          doc.rect(40, y, 515, 18).fillAndStroke('#FFFFFF', borderColor);
          doc.fillColor(textMuted).fontSize(8).text('No active commission earnings recorded.', 50, y + 5);
          y += 18;
        } else {
          topAgents.forEach((ag, idx) => {
            const bg = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
            doc.rect(40, y, 515, 18).fillAndStroke(bg, borderColor);
            doc.fillColor(primaryColor).fontSize(8).font('Helvetica');
            doc.text(ag.name || 'Agent', 50, y + 5);
            doc.text(String(ag.dealsCount || 0), 220, y + 5);
            doc.text(fmt(ag.directEarnings), 300, y + 5);
            doc.text(fmt(ag.totalEarnings), 430, y + 5);
            y += 18;
          });
        }

        // FOOTER
        doc.moveTo(40, 780).lineTo(555, 780).stroke(borderColor);
        doc.fillColor(textMuted).fontSize(8).text('MEGATRIX FINANCIAL COMMAND CENTER - STRICTLY CONFIDENTIAL - INTERNAL USE ONLY', 40, 790, {
          align: 'center',
          width: 515,
        });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  },
};

export default accountExportService;
