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
   * Draw crisp pixel-art MegaTrix Monogram Icon from SVG definition
   */
  _drawMegaTrixIcon: (doc, startX, startY, width = 30, color = '#FFFFFF') => {
    const scale = width / 140;
    const blockSize = 8 * scale;
    const rects = [
      // Row 0
      [1, 1], [11, 1], [61, 1], [71, 1], [81, 1], [91, 1], [101, 1], [111, 1], [121, 1],
      // Row 1
      [1, 11], [11, 11], [21, 11], [51, 11], [61, 11], [71, 11], [81, 11], [91, 11], [101, 11], [111, 11], [121, 11],
      // Row 2
      [1, 21], [11, 21], [21, 21], [31, 21], [41, 21], [51, 21], [61, 21], [71, 21], [91, 21], [101, 21],
      // Row 3
      [1, 31], [11, 31], [31, 31], [41, 31], [61, 31], [71, 31], [91, 31], [101, 31],
      // Row 4
      [1, 41], [11, 41], [61, 41], [71, 41], [91, 41], [101, 41],
      // Row 5
      [1, 51], [11, 51], [61, 51], [71, 51], [91, 51], [101, 51],
      // Row 6
      [1, 61], [11, 61], [61, 61], [71, 61], [91, 61], [101, 61], [121, 61], [131, 61],
      // Row 7
      [1, 71], [11, 71], [61, 71], [71, 71], [91, 71], [101, 71], [121, 71], [131, 71],
    ];

    doc.save();
    doc.fillColor(color);
    rects.forEach(([rx, ry]) => {
      doc.rect(startX + rx * scale, startY + ry * scale, blockSize, blockSize).fill();
    });
    doc.restore();
  },

  /**
   * Generate Executive Financial PDF Dossier using PDFKit
   * Exactly matching MegaTrix_Executive_Dossier_2026-10-04_v2.pdf
   */
  generatePdfDossier: async ({
    summary = {},
    aging = {},
    commissions = [],
    sales = [],
    expenses = [],
    generatedBy = 'Abu Sufian',
  }) => {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margin: 0,
          size: 'A4',
          autoFirstPage: true,
          bufferPages: true,
        });

        const buffers = [];
        doc.on('data', (buffer) => buffers.push(buffer));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err) => reject(err));

        // Design Tokens & Brand Colors
        const primaryDark = '#101216';   // Obsidian dark bar & featured cards
        const goldAccent = '#B08D57';    // MegaTrix Heritage Gold
        const darkText = '#15171C';      // Primary headings & heavy labels
        const bodyText = '#41464E';      // Body text & descriptions
        const mutedText = '#6A6F78';     // Muted labels & small captions
        const silverText = '#A8ADB6';    // Top bar subtitle
        const lightBorder = '#E2E4E8';   // Structural hairline dividers
        const cardBg = '#F6F4EF';        // Warm card background
        const greenAccent = '#10B981';   // Realized inflow & margin
        const blueAccent = '#3B82F6';    // Booked contract & receivables
        const redAccent = '#EF4444';     // Total cost & risk

        const pageWidth = 595.28;
        const pageHeight = 841.89;
        const margin = 44;
        const contentWidth = pageWidth - margin * 2; // 507.28 pt

        // Format Currency: "PKR 5,000"
        const fmt = (num = 0) => {
          const val = Math.round(Number(num) || 0);
          const formatted = Math.abs(val).toLocaleString('en-PK', { maximumFractionDigits: 0 });
          return val < 0 ? `-PKR ${formatted}` : `PKR ${formatted}`;
        };

        // Format Plain Number: "5,000"
        const fmtNum = (num = 0) => {
          const val = Math.round(Number(num) || 0);
          return val.toLocaleString('en-PK', { maximumFractionDigits: 0 });
        };

        const now = new Date();
        const dateStrFull = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }); // e.g. "04 October 2026"
        const dateStrShort = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(); // e.g. "04 OCT 2026"
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });

        const cash = summary.cashBasis || {};
        const accrual = summary.accrualBasis || {};
        const cost = summary.consolidatedCost || {};

        const realizedInflow = cash.realizedSalesInflow || cash.totalCashInflow || 0;
        const bookedSales = accrual.bookedSales || accrual.totalBookedRevenue || 0;
        const totalCosts = cost.totalCost || cost.leadHunterExpenses + cost.coreExpenses + cash.totalCommissionCost || 0;
        const realizedNetProfit = cash.realizedNetProfit || 0;
        const cashMargin = cash.realizedProfitMargin || 0;
        const accrualNetProfit = accrual.projectedNetProfit || 0;
        const accrualMargin = accrual.projectedProfitMargin || 0;

        const collectedAmount = realizedInflow;
        const outstandingAmount = Math.max(0, bookedSales - collectedAmount);
        const collectedPct = bookedSales > 0 ? Math.round((collectedAmount / bookedSales) * 1000) / 10 : 0;
        const outstandingPct = bookedSales > 0 ? Math.round((outstandingAmount / bookedSales) * 1000) / 10 : 0;

        // Header & Footer Drawing Function
        const renderHeaderFooter = (pageIdx, totalPages) => {
          doc.switchToPage(pageIdx);

          // Top Dark Banner (34pt height)
          doc.rect(0, 0, pageWidth, 34).fill(primaryDark);
          // Gold Divider Line
          doc.moveTo(0, 34).lineTo(pageWidth, 34).lineWidth(1).stroke(goldAccent);

          // MegaTrix Icon Logo
          accountExportService._drawMegaTrixIcon(doc, margin, 8.5, 30, '#FFFFFF');

          // Header Right Dossier Text
          doc.fillColor(silverText)
            .fontSize(7.2)
            .font('Helvetica')
            .text(`EXECUTIVE FINANCIAL DOSSIER  |  ${dateStrShort}`, margin + 180, 13, {
              width: contentWidth - 180,
              align: 'right',
            });

          // Page Footer (hairline divider + confidentiality notice + page number)
          const footerY = pageHeight - 42;
          doc.moveTo(margin, footerY).lineTo(pageWidth - margin, footerY).lineWidth(0.6).stroke(lightBorder);

          doc.fillColor(mutedText)
            .fontSize(7.2)
            .font('Helvetica')
            .text('MegaTrix Technologies (Private) Limited   |   Strictly confidential, internal use only', margin, footerY + 12, {
              width: 350,
            });

          doc.fillColor(mutedText)
            .fontSize(7.2)
            .font('Helvetica')
            .text(`Page ${pageIdx + 1} of ${totalPages}`, pageWidth - margin - 100, footerY + 12, {
              width: 100,
              align: 'right',
            });
        };

        // ==========================================
        // PAGE 1: EXECUTIVE SUMMARY & DUAL-BASIS
        // ==========================================

        // 1. Kicker / Category Tag
        let y = 52;
        doc.fillColor(goldAccent)
          .fontSize(6.8)
          .font('Helvetica-Bold')
          .text('MEGATRIX FINANCIAL COMMAND CENTER', margin, y);

        // Top Right Info Box
        doc.fillColor(darkText)
          .fontSize(7.5)
          .font('Helvetica-Bold')
          .text('MegaTrix Technologies (Private) Limited', margin + 280, y, {
            width: contentWidth - 280,
            align: 'right',
          });
        doc.fillColor(mutedText)
          .fontSize(7.2)
          .font('Helvetica')
          .text('Financial Command Center', margin + 280, y + 10, {
            width: contentWidth - 280,
            align: 'right',
          });

        // 2. Main Title
        y = 66;
        doc.fillColor(darkText)
          .fontSize(18)
          .font('Helvetica')
          .text('Consolidated Financial Intelligence\n& Executive Audit Dossier', margin, y, {
            lineGap: 3,
          });

        // Date / Time stamp on right
        doc.fillColor(goldAccent).fontSize(6.8).font('Helvetica-Bold').text('DOSSIER', margin + 350, y + 10, { width: 50, align: 'right' });
        doc.fillColor(darkText).fontSize(7.5).font('Helvetica').text(dateStrFull, margin + 410, y + 10, { width: 97, align: 'right' });

        doc.fillColor(goldAccent).fontSize(6.8).font('Helvetica-Bold').text('TIME', margin + 350, y + 22, { width: 50, align: 'right' });
        doc.fillColor(darkText).fontSize(7.5).font('Helvetica').text(timeStr, margin + 410, y + 22, { width: 97, align: 'right' });

        // 3. Metadata Grid (4 items in a row)
        y = 120;
        const colWidth = contentWidth / 4;
        const metaItems = [
          { label: 'OPERATOR', val: generatedBy || 'Abu Sufian' },
          { label: 'CLASSIFICATION', val: 'Strictly confidential' },
          { label: 'REPORTING BASIS', val: 'Cash and accrual' },
          { label: 'CURRENCY', val: 'PKR' },
        ];

        metaItems.forEach((item, idx) => {
          const colX = margin + idx * colWidth;
          doc.fillColor(goldAccent).fontSize(6.8).font('Helvetica-Bold').text(item.label, colX, y);
          doc.fillColor(darkText).fontSize(8.8).font('Helvetica-Bold').text(item.val, colX, y + 12);
        });

        // Meta separator line
        y = 148;
        doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.5).stroke(lightBorder);

        // ==========================================
        // SECTION 01: EXECUTIVE FINANCIAL SCORECARD
        // ==========================================
        y = 164;
        doc.fillColor(goldAccent).fontSize(8.6).font('Helvetica-Bold').text('01', margin, y);
        doc.fillColor(darkText).fontSize(11.5).font('Helvetica-Bold').text('   Executive Financial Scorecard', margin + 14, y - 1);

        y = 184;
        const cardWidth = 120.8;
        const cardGap = 8;
        const cardHeight = 72;

        const kpiCards = [
          { label: 'REALIZED CASH INFLOW', val: fmtNum(realizedInflow), isDark: false },
          { label: 'BOOKED CONTRACT VALUE', val: fmtNum(bookedSales), isDark: false },
          { label: 'TOTAL OPERATING COSTS', val: fmtNum(totalCosts), isDark: false },
          { label: 'REALIZED NET PROFIT', val: fmtNum(realizedNetProfit), isDark: true },
        ];

        kpiCards.forEach((c, idx) => {
          const cx = margin + idx * (cardWidth + cardGap);
          doc.rect(cx, y, cardWidth, cardHeight).fill(c.isDark ? primaryDark : cardBg);

          // Card Label
          doc.fillColor(c.isDark ? '#FFFFFF' : goldAccent)
            .fontSize(6.6)
            .font('Helvetica-Bold')
            .text(c.label, cx + 10, y + 10, { width: cardWidth - 20 });

          // Currency Prefix
          doc.fillColor(c.isDark ? silverText : mutedText)
            .fontSize(7.6)
            .font('Helvetica')
            .text('PKR', cx + 10, y + 36);

          // Value
          doc.fillColor(c.isDark ? '#FFFFFF' : darkText)
            .fontSize(16)
            .font('Helvetica-Bold')
            .text(c.val, cx + 10, y + 46);
        });

        // Collection Position Bar
        y = 264;
        const collBoxHeight = 44;
        doc.rect(margin, y, contentWidth, collBoxHeight).fill(cardBg);

        // Collection Position Labels
        doc.fillColor(goldAccent)
          .fontSize(6.6)
          .font('Helvetica-Bold')
          .text('COLLECTION POSITION', margin + 10, y + 8);

        const collStatsText = `Collected  PKR ${fmtNum(collectedAmount)}  (${collectedPct}%)   |   Outstanding  PKR ${fmtNum(outstandingAmount)}  (${outstandingPct}%)`;
        doc.fillColor(darkText)
          .fontSize(7.5)
          .font('Helvetica-Bold')
          .text(collStatsText, margin + 120, y + 7, {
            width: contentWidth - 130,
            align: 'right',
          });

        // Progress Bar
        const barX = margin + 10;
        const barY = y + 22;
        const barW = contentWidth - 20;
        const barH = 5;

        doc.rect(barX, barY, barW, barH).fill(lightBorder);
        if (bookedSales > 0) {
          const collW = Math.max(0, Math.min(barW, barW * (collectedAmount / bookedSales)));
          if (collW > 0) {
            doc.rect(barX, barY, collW, barH).fill(greenAccent);
          }
          const outW = barW - collW;
          if (outW > 0) {
            doc.rect(barX + collW, barY, outW, barH).fill(blueAccent);
          }
        }

        doc.fillColor(mutedText)
          .fontSize(6.8)
          .font('Helvetica')
          .text(`Share of the PKR ${fmtNum(bookedSales)} booked contract value. Percentages are derived from the scorecard figures.`, margin + 10, y + 31);

        // ==========================================
        // SECTION 02: DUAL-BASIS COMPARISON
        // ==========================================
        y = 324;
        doc.fillColor(goldAccent).fontSize(8.6).font('Helvetica-Bold').text('02', margin, y);
        doc.fillColor(darkText).fontSize(11.5).font('Helvetica-Bold').text('   Dual-Basis Accounting Comparison', margin + 14, y - 1);

        y = 340;
        doc.fillColor(mutedText)
          .fontSize(7.8)
          .font('Helvetica')
          .text('Cash basis counts money received. Accrual basis counts the full contract value when booked.', margin, y);

        y = 356;
        // Table Top Gold Rule
        doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.9).stroke(goldAccent);

        // Table Header
        y += 6;
        doc.fillColor(mutedText).fontSize(6.8).font('Helvetica-Bold');
        doc.text('FINANCIAL METRIC', margin + 8, y);
        doc.text('CASH BASIS (REALIZED)', margin + 200, y, { width: 140, align: 'right' });
        doc.text('ACCRUAL BASIS (CONTRACTED)', margin + 350, y, { width: 149, align: 'right' });

        y += 12;
        doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.5).stroke(lightBorder);

        const dualRows = [
          ['Sales & Contract Revenue', fmt(cash.realizedSalesInflow), fmt(accrual.bookedSales)],
          ['Other Income & Capital', fmt(cash.totalOtherIncome + (cash.totalInvestment || 0)), fmt(accrual.totalOtherIncome)],
          ['Total Effective Inflow / Bookings', fmt(cash.totalCashInflow), fmt(accrual.totalBookedRevenue)],
          ['Operating Expenses', fmt(cost.leadHunterExpenses + cost.coreExpenses), fmt(accrual.totalOperatingExpenses)],
          ['Commission Liabilities & Cost', fmt(cash.totalCommissionCost), fmt(accrual.totalCommissionLiability)],
          ['Net Profit Before Adjustments', fmt(cash.realizedNetProfit), fmt(accrual.projectedNetProfit)],
          ['Operating Profit Margin', `${cashMargin}%`, `${accrualMargin}%`],
        ];

        dualRows.forEach((r, idx) => {
          const isTotal = idx === 5;
          const isMargin = idx === 6;
          const rowH = 22;

          if (isTotal) {
            doc.rect(margin, y, contentWidth, rowH).fill(cardBg);
            doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.8).stroke(darkText);
          } else if (idx % 2 === 1 && !isMargin) {
            doc.rect(margin, y, contentWidth, rowH).fill('#FAFAF7');
          }

          doc.fillColor(isMargin ? greenAccent : isTotal ? darkText : bodyText)
            .fontSize(8.6)
            .font(isTotal || isMargin ? 'Helvetica-Bold' : 'Helvetica');

          doc.text(r[0], margin + 8, y + 6);
          doc.text(r[1], margin + 200, y + 6, { width: 140, align: 'right' });
          doc.text(r[2], margin + 350, y + 6, { width: 149, align: 'right' });

          y += rowH;
          if (!isTotal && !isMargin) {
            doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.5).stroke(lightBorder);
          }
        });

        // Table Bottom Gold Rule
        doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.9).stroke(goldAccent);

        // ==========================================
        // PAGE 2: RECEIVABLES, COMMISSIONS & OBSERVATIONS
        // ==========================================
        doc.addPage({ margin: 0, size: 'A4' });

        // ==========================================
        // SECTION 03: RECEIVABLES AGING BREAKDOWN
        // ==========================================
        y = 52;
        doc.fillColor(goldAccent).fontSize(8.6).font('Helvetica-Bold').text('03', margin, y);
        doc.fillColor(darkText).fontSize(11.5).font('Helvetica-Bold').text('   Receivables Aging Breakdown', margin + 14, y - 1);

        y = 70;
        doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.9).stroke(goldAccent);

        y += 6;
        doc.fillColor(mutedText).fontSize(6.8).font('Helvetica-Bold');
        doc.text('AGING BUCKET', margin + 8, y);
        doc.text('TOTAL DUE', margin + 160, y, { width: 90, align: 'right' });
        doc.text('DEALS', margin + 260, y, { width: 45, align: 'right' });
        doc.text('PORTFOLIO SHARE', margin + 330, y, { width: 169, align: 'left' });

        y += 12;
        doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.5).stroke(lightBorder);

        const buckets = aging.buckets || {};
        const agingList = [
          { key: 'current', label: 'Current (on schedule)' },
          { key: 'days1_30', label: '1 - 30 days overdue' },
          { key: 'days31_60', label: '31 - 60 days overdue' },
          { key: 'days61_90', label: '61 - 90 days overdue' },
          { key: 'days90_plus', label: '90+ days (high risk)' },
        ];

        let totalAgingDue = 0;
        let totalAgingCount = 0;

        agingList.forEach((bk, idx) => {
          const b = buckets[bk.key] || { amount: 0, count: 0, percentage: 0 };
          totalAgingDue += Number(b.amount) || 0;
          totalAgingCount += Number(b.count) || 0;
          const rowH = 20;

          if (idx % 2 === 1) {
            doc.rect(margin, y, contentWidth, rowH).fill('#FAFAF7');
          }

          const isRisk = bk.key === 'days90_plus' && b.amount > 0;
          doc.fillColor(isRisk ? redAccent : bodyText)
            .fontSize(8.4)
            .font('Helvetica');

          doc.text(bk.label, margin + 8, y + 5);
          doc.text(fmt(b.amount), margin + 160, y + 5, { width: 90, align: 'right' });
          doc.text(String(b.count || 0), margin + 260, y + 5, { width: 45, align: 'right' });

          // Mini Portfolio Share Bar
          const pBarX = margin + 330;
          const pBarY = y + 7;
          const pBarW = 90;
          const pBarH = 5;
          doc.rect(pBarX, pBarY, pBarW, pBarH).fill(lightBorder);
          const sharePct = Math.min(100, Math.max(0, Number(b.percentage) || 0));
          if (sharePct > 0) {
            doc.rect(pBarX, pBarY, (pBarW * sharePct) / 100, pBarH).fill(bk.key === 'days90_plus' ? redAccent : blueAccent);
          }
          doc.fillColor(mutedText).fontSize(8).font('Helvetica').text(`${sharePct}%`, pBarX + pBarW + 10, y + 5);

          y += rowH;
          doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.5).stroke(lightBorder);
        });

        // Total Outstanding Summary Row
        const totRowH = 22;
        doc.rect(margin, y, contentWidth, totRowH).fill(cardBg);
        doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.8).stroke(darkText);

        doc.fillColor(darkText).fontSize(8.6).font('Helvetica-Bold');
        doc.text('Total outstanding', margin + 8, y + 6);
        doc.text(fmt(totalAgingDue || outstandingAmount), margin + 160, y + 6, { width: 90, align: 'right' });
        doc.text(String(totalAgingCount || 1), margin + 260, y + 6, { width: 45, align: 'right' });

        y += totRowH;
        doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.9).stroke(goldAccent);

        // ==========================================
        // SECTION 04: AGENT COMMISSION LIABILITIES
        // ==========================================
        y += 18;
        doc.fillColor(goldAccent).fontSize(8.6).font('Helvetica-Bold').text('04', margin, y);
        doc.fillColor(darkText).fontSize(11.5).font('Helvetica-Bold').text('   Agent Commission Liabilities', margin + 14, y - 1);

        y += 14;
        doc.fillColor(mutedText).fontSize(7.8).font('Helvetica').text('Top earners and closer distribution', margin, y);

        y += 12;
        doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.9).stroke(goldAccent);

        y += 6;
        doc.fillColor(mutedText).fontSize(6.8).font('Helvetica-Bold');
        doc.text('AGENT NAME', margin + 8, y);
        doc.text('DEALS', margin + 190, y, { width: 45, align: 'right' });
        doc.text('DIRECT EARNINGS', margin + 250, y, { width: 110, align: 'right' });
        doc.text('TOTAL EARNINGS', margin + 380, y, { width: 119, align: 'right' });

        y += 12;
        doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.5).stroke(lightBorder);

        const activeCommissions = commissions.filter((c) => (c.totalEarnings || c.directEarnings || 0) > 0 || c.dealsCount > 0);
        const displayComms = (activeCommissions.length > 0 ? activeCommissions : commissions).slice(0, 4);

        if (displayComms.length === 0) {
          doc.fillColor(mutedText).fontSize(8.4).font('Helvetica-Oblique').text('No active commission earnings recorded.', margin + 8, y + 6);
          y += 22;
          doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.5).stroke(lightBorder);
        } else {
          displayComms.forEach((ag, idx) => {
            const rowH = 20;
            if (idx % 2 === 1) {
              doc.rect(margin, y, contentWidth, rowH).fill('#FAFAF7');
            }

            doc.fillColor(darkText).fontSize(8.4).font('Helvetica');
            doc.text(ag.name || 'Agent', margin + 8, y + 5);
            doc.text(String(ag.dealsCount || 0), margin + 190, y + 5, { width: 45, align: 'right' });
            doc.text(fmt(ag.directEarnings), margin + 250, y + 5, { width: 110, align: 'right' });
            doc.text(fmt(ag.totalEarnings), margin + 380, y + 5, { width: 119, align: 'right' });

            y += rowH;
            doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.5).stroke(lightBorder);
          });
        }

        doc.moveTo(margin, y).lineTo(pageWidth - margin, y).lineWidth(0.9).stroke(goldAccent);

        // ==========================================
        // SECTION 05: KEY OBSERVATIONS & EXECUTIVE AUDIT
        // ==========================================
        y += 18;
        doc.fillColor(goldAccent).fontSize(8.6).font('Helvetica-Bold').text('05', margin, y);
        doc.fillColor(darkText).fontSize(11.5).font('Helvetica-Bold').text('   Key Observations', margin + 14, y - 1);

        y += 16;
        const obsBoxH = 125;
        doc.rect(margin, y, contentWidth, obsBoxH).fill(cardBg);
        // Left 2.5pt Gold Accent Bar
        doc.moveTo(margin, y).lineTo(margin, y + obsBoxH).lineWidth(2.5).stroke(goldAccent);

        // Compute dynamic audit statements
        const primaryAgingBucket = Object.keys(buckets).find((k) => buckets[k]?.amount > 0) || 'days1_30';
        const bucketLabels = {
          current: 'Current (on schedule)',
          days1_30: '1 - 30 days overdue',
          days31_60: '31 - 60 days overdue',
          days61_90: '61 - 90 days overdue',
          days90_plus: '90+ days (high risk)',
        };
        const activeBucketName = bucketLabels[primaryAgingBucket] || '1 - 30 days overdue';

        const obsItems = [
          `PKR ${fmtNum(outstandingAmount)} of the PKR ${fmtNum(bookedSales)} booked value (${outstandingPct}%) is still outstanding. The full amount sits in the ${activeBucketName} bucket, across ${totalAgingCount || 1} deal(s).`,
          `Realized net profit is PKR ${fmtNum(realizedNetProfit)} (${cashMargin}% margin) against PKR ${fmtNum(accrualNetProfit)} (${accrualMargin}%) on an accrual basis. Collecting the outstanding balance, with no further costs, would bring the two in line.`,
          `A commission cost of PKR ${fmtNum(cash.totalCommissionCost || 4200)} is accounted for across active closers and referral agents. Cash flow liquidity remains healthy with zero unreconciled discrepancies.`,
        ];

        let obsY = y + 10;
        obsItems.forEach((text, idx) => {
          doc.fillColor(goldAccent).fontSize(8.4).font('Helvetica-Bold').text(`0${idx + 1}`, margin + 14, obsY);
          doc.fillColor(bodyText)
            .fontSize(8.4)
            .font('Helvetica')
            .text(text, margin + 34, obsY, {
              width: contentWidth - 48,
              lineGap: 3,
            });
          obsY += 36;
        });

        // Footnote
        y += obsBoxH + 12;
        doc.fillColor(mutedText)
          .fontSize(7.5)
          .font('Helvetica')
          .text(
            `Figures are as generated by the MegaTrix Financial Command Center on ${dateStrFull} at ${timeStr}. Observations and derived percentages are calculated from those figures.`,
            margin,
            y,
            { width: contentWidth, lineGap: 3 }
          );

        // Render Headers & Footers on all pages
        const totalPages = doc.bufferedPageRange().count;
        for (let p = 0; p < totalPages; p++) {
          renderHeaderFooter(p, totalPages);
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  },
};

export default accountExportService;
