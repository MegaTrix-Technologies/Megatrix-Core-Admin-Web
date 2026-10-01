/**
 * MegaTrix Admin Core - Financial Calculation & Analytics Engine
 * Comprehensive Dual-Basis (Cash vs Accrual) Accounting, Receivables Aging,
 * Project Unit Economics, Commission Liabilities, and Discrepancy Audits.
 */

export const financialCalculationService = {
  /**
   * Filter items by date range
   */
  filterByDateRange: (items = [], dateField = 'createdAt', startDate, endDate) => {
    if (!startDate && !endDate) return items;
    const start = startDate ? new Date(startDate).getTime() : 0;
    const end = endDate ? new Date(endDate).getTime() : Infinity;

    return items.filter((item) => {
      const itemDate = new Date(item[dateField] || item.date || item.createdAt).getTime();
      return !isNaN(itemDate) && itemDate >= start && itemDate <= end;
    });
  },

  /**
   * Calculate complete Dual-Basis financial aggregates
   */
  computeFinancialSummary: ({
    sales = [],
    inflows = [],
    leadHunterExpenses = [],
    coreExpenses = [],
    commissions = [],
    adjustments = [],
    startDate = null,
    endDate = null,
  }) => {
    // 1. Date filter raw datasets
    const filteredSales = financialCalculationService.filterByDateRange(sales, 'closedAt', startDate, endDate);
    const filteredInflows = financialCalculationService.filterByDateRange(inflows, 'date', startDate, endDate);
    const filteredLhExpenses = financialCalculationService.filterByDateRange(leadHunterExpenses, 'date', startDate, endDate);
    const filteredCoreExpenses = financialCalculationService.filterByDateRange(coreExpenses, 'expenseDate', startDate, endDate);
    const filteredAdjustments = financialCalculationService.filterByDateRange(adjustments, 'effectiveDate', startDate, endDate);

    // 2. Accrual Basis (Contracted / Recognized Bookings)
    let bookedSales = 0;
    let totalAdvanceFromBooked = 0;
    let pendingReceivables = 0;

    filteredSales.forEach((s) => {
      const tot = Number(s.totalAmount) || 0;
      const adv = Number(s.advanceAmount) || 0;
      const rem = s.remainingAmount !== undefined ? Number(s.remainingAmount) : Math.max(0, tot - adv);

      bookedSales += tot;
      totalAdvanceFromBooked += adv;
      pendingReceivables += rem;
    });

    // 3. Cash Basis (Realized Inflows)
    let realizedSalesInflow = 0;
    let totalOtherIncome = 0;
    let totalInvestment = 0;
    let totalProjectPaymentsInflow = 0;

    filteredInflows.forEach((i) => {
      const amt = Number(i.amount) || 0;
      if (i.type === 'other_income') totalOtherIncome += amt;
      else if (i.type === 'investment') totalInvestment += amt;
      else if (i.type === 'project_payment') totalProjectPaymentsInflow += amt;
      else realizedSalesInflow += amt;
    });

    // If no direct inflow breakdown was provided, default realized sales to advances/collected from filtered sales
    if (realizedSalesInflow === 0 && totalProjectPaymentsInflow === 0 && totalAdvanceFromBooked > 0) {
      realizedSalesInflow = totalAdvanceFromBooked;
    }

    const totalOperatingInflow = realizedSalesInflow + totalProjectPaymentsInflow + totalOtherIncome;
    const totalCashInflow = totalOperatingInflow + totalInvestment;

    // 4. Expenses Consolidation (LeadHunter + Core)
    const totalLhExpenses = filteredLhExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const totalCoreExpenses = filteredCoreExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const totalOperatingExpenses = totalLhExpenses + totalCoreExpenses;

    // 5. Commission Liabilities
    // Commission from filtered sales or summarized from active agents
    let totalCommissionLiability = 0;
    filteredSales.forEach((s) => {
      totalCommissionLiability += Number(s.estimatedCommission) || 0;
    });

    if (totalCommissionLiability === 0 && commissions.length > 0) {
      totalCommissionLiability = commissions.reduce((sum, c) => sum + (Number(c.totalEarnings) || 0), 0);
    }

    // 6. Administrative Adjustments Impact
    let cashAdjustment = 0;
    let accrualAdjustment = 0;
    let expenseAdjustment = 0;

    filteredAdjustments.forEach((adj) => {
      if (adj.status === 'approved' || adj.status === 'applied') {
        const val = Number(adj.amount) || 0;
        if (adj.adjustmentType === 'cash_inflow') cashAdjustment += val;
        else if (adj.adjustmentType === 'accrual_revenue') accrualAdjustment += val;
        else if (adj.adjustmentType === 'expense_offset') expenseAdjustment += val;
        else if (adj.adjustmentType === 'receivable_writeoff') pendingReceivables = Math.max(0, pendingReceivables - Math.abs(val));
      }
    });

    // 7. Net Profit & Margins Computation
    // CASH BASIS: Realized Operating Inflow - Total Operating Expenses - Commission Costs + Cash Adjustments
    const effectiveRealizedInflow = totalOperatingInflow + cashAdjustment;
    const effectiveOperatingCost = totalOperatingExpenses + totalCommissionLiability + expenseAdjustment;
    const realizedNetProfit = effectiveRealizedInflow - effectiveOperatingCost;
    const realizedProfitMargin = effectiveRealizedInflow > 0
      ? parseFloat(((realizedNetProfit / effectiveRealizedInflow) * 100).toFixed(2))
      : 0;

    const netCashFlow = totalCashInflow - effectiveOperatingCost + cashAdjustment;

    // ACCRUAL BASIS: Booked Sales + Other Income - Total Operating Expenses - Commission Liabilities + Accrual Adjustments
    const effectiveBookedRevenue = bookedSales + totalOtherIncome + accrualAdjustment;
    const projectedNetProfit = effectiveBookedRevenue - effectiveOperatingCost;
    const projectedProfitMargin = effectiveBookedRevenue > 0
      ? parseFloat(((projectedNetProfit / effectiveBookedRevenue) * 100).toFixed(2))
      : 0;

    return {
      period: {
        startDate,
        endDate,
      },
      cashBasis: {
        realizedSalesInflow,
        totalProjectPaymentsInflow,
        totalOtherIncome,
        totalInvestment,
        totalOperatingInflow: effectiveRealizedInflow,
        totalCashInflow: totalCashInflow + cashAdjustment,
        totalOperatingExpenses,
        totalCommissionCost: totalCommissionLiability,
        totalCashOutflow: effectiveOperatingCost,
        realizedNetProfit,
        realizedProfitMargin,
        netCashFlow,
      },
      accrualBasis: {
        bookedSales,
        totalOtherIncome,
        totalBookedRevenue: effectiveBookedRevenue,
        pendingReceivables,
        totalOperatingExpenses,
        totalCommissionLiability,
        totalAccruedCost: effectiveOperatingCost,
        projectedNetProfit,
        projectedProfitMargin,
      },
      consolidatedCost: {
        leadHunterExpenses: totalLhExpenses,
        coreExpenses: totalCoreExpenses,
        commissions: totalCommissionLiability,
        adjustments: expenseAdjustment,
        totalCost: effectiveOperatingCost,
      },
      counts: {
        salesCount: filteredSales.length,
        inflowsCount: filteredInflows.length,
        lhExpensesCount: filteredLhExpenses.length,
        coreExpensesCount: filteredCoreExpenses.length,
        adjustmentsCount: filteredAdjustments.length,
      },
    };
  },

  /**
   * Compute Receivables Aging Buckets
   * Current (<=0 days), 1-30 Days, 31-60 Days, 61-90 Days, 90+ Days
   */
  computeReceivablesAging: (sales = []) => {
    const buckets = {
      current: { label: 'Current (On Schedule)', amount: 0, count: 0, items: [] },
      days1_30: { label: '1 - 30 Days', amount: 0, count: 0, items: [] },
      days31_60: { label: '31 - 60 Days', amount: 0, count: 0, items: [] },
      days61_90: { label: '61 - 90 Days', amount: 0, count: 0, items: [] },
      days90_plus: { label: '90+ Days (High Risk)', amount: 0, count: 0, items: [] },
    };

    let totalReceivables = 0;
    const now = Date.now();

    sales.forEach((s) => {
      const tot = Number(s.totalAmount) || 0;
      const adv = Number(s.advanceAmount) || 0;
      const rem = s.remainingAmount !== undefined ? Number(s.remainingAmount) : Math.max(0, tot - adv);

      if (rem > 0 && s.status !== 'payment_completed') {
        totalReceivables += rem;

        // Calculate days elapsed since sale closed/created
        const saleDate = new Date(s.closedAt || s.createdAt || now).getTime();
        const daysOutstanding = Math.max(0, Math.floor((now - saleDate) / (1000 * 60 * 60 * 24)));

        let riskLevel = 'Low';
        let bucketKey = 'current';

        if (daysOutstanding === 0) {
          bucketKey = 'current';
          riskLevel = 'Low';
        } else if (daysOutstanding <= 30) {
          bucketKey = 'days1_30';
          riskLevel = 'Low';
        } else if (daysOutstanding <= 60) {
          bucketKey = 'days31_60';
          riskLevel = 'Medium';
        } else if (daysOutstanding <= 90) {
          bucketKey = 'days61_90';
          riskLevel = 'High';
        } else {
          bucketKey = 'days90_plus';
          riskLevel = 'Critical';
        }

        const item = {
          saleId: s._id,
          clientName: s.customer?.businessName || s.customer?.name || 'Client',
          phone: s.customer?.phone || '',
          email: s.customer?.email || '',
          area: s.customer?.area || '',
          totalAmount: tot,
          advanceAmount: adv,
          remainingAmount: rem,
          daysOutstanding,
          closedAt: s.closedAt || s.createdAt,
          closerName: s.closedByName || s.closedBy?.name || 'Unassigned',
          leadGenName: s.leadGeneratedByName || s.leadGeneratedBy?.name || 'Unassigned',
          status: s.status,
          riskLevel,
        };

        buckets[bucketKey].amount += rem;
        buckets[bucketKey].count += 1;
        buckets[bucketKey].items.push(item);
      }
    });

    // Sort items by days outstanding descending
    Object.keys(buckets).forEach((key) => {
      buckets[key].items.sort((a, b) => b.daysOutstanding - a.daysOutstanding);
      buckets[key].percentage = totalReceivables > 0
        ? parseFloat(((buckets[key].amount / totalReceivables) * 100).toFixed(1))
        : 0;
    });

    return {
      totalReceivables,
      buckets,
      totalUnpaidDeals: Object.values(buckets).reduce((sum, b) => sum + b.count, 0),
    };
  },

  /**
   * Period-over-Period Delta Analysis
   */
  computePeriodComparison: (currentMetrics, previousMetrics) => {
    const calculateDelta = (curr = 0, prev = 0) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return parseFloat((((curr - prev) / Math.abs(prev)) * 100).toFixed(1));
    };

    return {
      cashInflowDelta: calculateDelta(
        currentMetrics.cashBasis?.totalCashInflow,
        previousMetrics.cashBasis?.totalCashInflow
      ),
      bookedSalesDelta: calculateDelta(
        currentMetrics.accrualBasis?.bookedSales,
        previousMetrics.accrualBasis?.bookedSales
      ),
      operatingExpensesDelta: calculateDelta(
        currentMetrics.consolidatedCost?.totalCost,
        previousMetrics.consolidatedCost?.totalCost
      ),
      realizedNetProfitDelta: calculateDelta(
        currentMetrics.cashBasis?.realizedNetProfit,
        previousMetrics.cashBasis?.realizedNetProfit
      ),
      projectedNetProfitDelta: calculateDelta(
        currentMetrics.accrualBasis?.projectedNetProfit,
        previousMetrics.accrualBasis?.projectedNetProfit
      ),
    };
  },

  /**
   * Project Unit Economics & Profitability Engine
   */
  computeProjectFinancials: (projects = [], sales = [], expenses = []) => {
    return projects.map((p) => {
      const linkedSales = sales.filter(
        (s) => s.projectId?.toString() === p._id?.toString() || s._id?.toString() === p.saleId?.toString()
      );

      const contractRevenue = linkedSales.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0) || Number(p.budget) || 0;
      const cashCollected = linkedSales.reduce((sum, s) => sum + (Number(s.advanceAmount) || 0), 0);
      const receivables = Math.max(0, contractRevenue - cashCollected);

      const directCommissions = linkedSales.reduce((sum, s) => sum + (Number(s.estimatedCommission) || 0), 0);

      const directExpenses = expenses
        .filter((e) => e.projectId?.toString() === p._id?.toString())
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      const totalProjectCost = directExpenses + directCommissions;
      const grossMargin = contractRevenue - directExpenses;
      const grossMarginPercent = contractRevenue > 0
        ? parseFloat(((grossMargin / contractRevenue) * 100).toFixed(1))
        : 0;

      const netContribution = contractRevenue - totalProjectCost;
      const netMarginPercent = contractRevenue > 0
        ? parseFloat(((netContribution / contractRevenue) * 100).toFixed(1))
        : 0;

      const collectionProgress = contractRevenue > 0
        ? parseFloat(((cashCollected / contractRevenue) * 100).toFixed(1))
        : 0;

      let healthStatus = 'Healthy';
      if (netContribution < 0) healthStatus = 'Critical Loss';
      else if (netMarginPercent < 25 || (collectionProgress < 50 && p.status === 'completed')) healthStatus = 'At Risk';

      return {
        projectId: p._id,
        title: p.title || p.name || 'Project',
        clientName: p.client?.name || p.clientName || 'Client',
        status: p.status || 'in_progress',
        startDate: p.startDate || p.createdAt,
        deadline: p.deadline || p.dueDate,
        contractRevenue,
        cashCollected,
        receivables,
        directExpenses,
        directCommissions,
        totalProjectCost,
        grossMargin,
        grossMarginPercent,
        netContribution,
        netMarginPercent,
        collectionProgress,
        healthStatus,
        assignedDevs: p.assignedDevelopers || p.assignedDeveloperNames || [],
      };
    });
  },

  /**
   * Commission Liabilities & Agent Leaderboard
   */
  computeCommissionSummary: (commissions = [], sales = []) => {
    let totalEarned = 0;
    let totalPending = 0;

    const agentList = commissions.map((c) => {
      const earned = Number(c.totalEarnings) || 0;
      totalEarned += earned;
      totalPending += earned; // Default liability until recorded settlements

      return {
        userId: c.userId,
        name: c.name,
        email: c.email,
        roles: c.roles || [],
        directEarnings: c.directEarnings || 0,
        referralEarnings: c.referralEarnings || 0,
        totalEarnings: earned,
        dealsCount: c.dealsCount || 0,
        referralsCount: c.referralsCount || 0,
        commissionRates: c.commissionRates || {},
        itemized: c.itemized || [],
      };
    });

    agentList.sort((a, b) => b.totalEarnings - a.totalEarnings);

    return {
      totalCommissionLiability: totalEarned,
      totalPendingPayouts: totalPending,
      agentsCount: agentList.length,
      agents: agentList,
    };
  },

  /**
   * Consolidated Operating Expenses Breakdown
   */
  computeExpenseBreakdown: (lhExpenses = [], coreExpenses = []) => {
    const categories = {
      payroll: { label: 'Payroll & Compensation', total: 0, count: 0, items: [] },
      software_saas: { label: 'Software, AI & SaaS Tools', total: 0, count: 0, items: [] },
      marketing_ads: { label: 'Marketing & Ad Spend', total: 0, count: 0, items: [] },
      office_infra: { label: 'Office & Infrastructure', total: 0, count: 0, items: [] },
      legal_compliance: { label: 'Legal & Compliance', total: 0, count: 0, items: [] },
      travel_client: { label: 'Travel & Client Relations', total: 0, count: 0, items: [] },
      contractor: { label: 'Contractors & Freelancers', total: 0, count: 0, items: [] },
      miscellaneous: { label: 'General & Miscellaneous', total: 0, count: 0, items: [] },
    };

    let totalExpenses = 0;
    const unifiedList = [];

    // 1. Process LeadHunter expenses
    lhExpenses.forEach((e) => {
      const amt = Number(e.amount) || 0;
      totalExpenses += amt;

      const rawCat = (e.category || '').toLowerCase().replace(/[^a-z0-9]/g, '_');
      let mappedCat = 'miscellaneous';
      if (rawCat.includes('salary') || rawCat.includes('payroll')) mappedCat = 'payroll';
      else if (rawCat.includes('software') || rawCat.includes('saas') || rawCat.includes('tool') || rawCat.includes('host') || rawCat.includes('domain')) mappedCat = 'software_saas';
      else if (rawCat.includes('ad') || rawCat.includes('market') || rawCat.includes('campaign')) mappedCat = 'marketing_ads';
      else if (rawCat.includes('office') || rawCat.includes('rent') || rawCat.includes('bill') || rawCat.includes('utility')) mappedCat = 'office_infra';
      else if (rawCat.includes('dev') || rawCat.includes('freelanc') || rawCat.includes('contract')) mappedCat = 'contractor';

      const entry = {
        _id: e._id,
        source: 'LeadHunter CRM',
        sourceType: 'leadhunter',
        title: e.title || e.description || 'Expense',
        category: mappedCat,
        categoryLabel: categories[mappedCat]?.label || 'General Overhead',
        amount: amt,
        date: e.date || e.createdAt,
        paymentMethod: e.paymentMethod || 'Bank',
        status: e.status || 'paid',
        addedBy: e.addedBy?.name || 'CRM Team',
        isCore: false,
      };

      if (!categories[mappedCat]) categories[mappedCat] = { label: 'Other', total: 0, count: 0, items: [] };
      categories[mappedCat].total += amt;
      categories[mappedCat].count += 1;
      categories[mappedCat].items.push(entry);
      unifiedList.push(entry);
    });

    // 2. Process Core Admin expenses
    coreExpenses.forEach((e) => {
      const amt = Number(e.amount) || 0;
      totalExpenses += amt;

      const catKey = categories[e.category] ? e.category : 'miscellaneous';

      const entry = {
        _id: e._id,
        source: 'MegaTrix Core',
        sourceType: 'megatrix_core',
        title: e.title || 'Core Expense',
        description: e.description || '',
        category: catKey,
        categoryLabel: categories[catKey]?.label || 'General Overhead',
        amount: amt,
        date: e.expenseDate || e.createdAt,
        paymentMethod: e.paymentMethod || 'Corporate Account',
        vendor: e.vendor || '',
        status: e.status || 'approved',
        addedBy: e.createdBy?.name || 'Core Admin',
        isCore: true,
      };

      categories[catKey].total += amt;
      categories[catKey].count += 1;
      categories[catKey].items.push(entry);
      unifiedList.push(entry);
    });

    // Sort unified list descending by date
    unifiedList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate percentage breakdown
    const categorySummary = Object.entries(categories).map(([key, data]) => ({
      key,
      label: data.label,
      total: data.total,
      count: data.count,
      percentage: totalExpenses > 0 ? parseFloat(((data.total / totalExpenses) * 100).toFixed(1)) : 0,
    })).filter((c) => c.total > 0 || c.count > 0);

    return {
      totalExpenses,
      categorySummary,
      unifiedList,
      totalCount: unifiedList.length,
      leadHunterShare: lhExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0),
      coreAdminShare: coreExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0),
    };
  },

  /**
   * Automated Reconciliation & Discrepancy Engine
   * Detects anomalies, ledger leaks, mismatching totals, unlinked inflows, and negative balances
   */
  auditReconciliation: ({ sales = [], inflows = [], expenses = [], commissions = [], adjustments = [] }) => {
    const discrepancies = [];

    // 1. Audit Sales Balance Consistency
    sales.forEach((s) => {
      const tot = Number(s.totalAmount) || 0;
      const adv = Number(s.advanceAmount) || 0;
      const rem = s.remainingAmount !== undefined ? Number(s.remainingAmount) : Math.max(0, tot - adv);

      if (adv > tot) {
        discrepancies.push({
          type: 'OVERPAID_ADVANCE',
          severity: 'HIGH',
          title: `Overcollected Advance on Sale #${s._id}`,
          description: `Advance amount ($${adv}) exceeds total contract value ($${tot}) for client "${s.customer?.businessName || 'Client'}".`,
          entityType: 'sale',
          entityId: s._id,
          difference: adv - tot,
          resolution: 'Verify client contract price and issue credit note or update contract price.',
        });
      }

      if (rem < 0) {
        discrepancies.push({
          type: 'NEGATIVE_RECEIVABLE',
          severity: 'HIGH',
          title: `Negative Remaining Balance on Sale #${s._id}`,
          description: `Remaining balance is negative ($${rem}).`,
          entityType: 'sale',
          entityId: s._id,
          difference: rem,
          resolution: 'Normalize remaining balance to 0 or record customer credit balance.',
        });
      }

      if (s.status === 'payment_completed' && rem > 0) {
        discrepancies.push({
          type: 'STATUS_MISMATCH',
          severity: 'MEDIUM',
          title: `Marked Completed but Has Balance: Sale #${s._id}`,
          description: `Sale is marked 'payment_completed' but retains an outstanding balance of $${rem}.`,
          entityType: 'sale',
          entityId: s._id,
          difference: rem,
          resolution: 'Settle remaining balance with cash inflow or change status to advance_paid.',
        });
      }
    });

    // 2. Audit Inflows Linking
    inflows.forEach((i) => {
      const amt = Number(i.amount) || 0;
      if (amt <= 0) {
        discrepancies.push({
          type: 'ZERO_OR_NEGATIVE_INFLOW',
          severity: 'MEDIUM',
          title: `Invalid Inflow Amount: TX #${i._id}`,
          description: `Inflow transaction recorded with non-positive amount ($${amt}).`,
          entityType: 'inflow',
          entityId: i._id,
          difference: amt,
          resolution: 'Review transaction record or delete invalid entry.',
        });
      }

      if (i.type === 'project_payment' && !i.saleId && !i.projectId) {
        discrepancies.push({
          type: 'UNLINKED_PROJECT_INFLOW',
          severity: 'LOW',
          title: `Unlinked Project Payment: TX #${i._id}`,
          description: `Project payment of $${amt} is not associated with any sale ID or project ID.`,
          entityType: 'inflow',
          entityId: i._id,
          difference: amt,
          resolution: 'Link transaction to the appropriate client sale or project record.',
        });
      }
    });

    // 3. Audit Zero Commission Sales with Active Attributions
    sales.forEach((s) => {
      const tot = Number(s.totalAmount) || 0;
      if (tot > 0 && (!s.estimatedCommission || s.estimatedCommission === 0) && (s.closedBy || s.leadGeneratedBy)) {
        discrepancies.push({
          type: 'UNATTRIBUTED_COMMISSION',
          severity: 'LOW',
          title: `Missing Commission Liability: Sale #${s._id}`,
          description: `Sale of $${tot} closed by ${s.closedByName || 'agent'} has zero calculated commission liability.`,
          entityType: 'sale',
          entityId: s._id,
          difference: 0,
          resolution: 'Verify agent commission rate configuration in user profiles.',
        });
      }
    });

    return {
      totalDiscrepancies: discrepancies.length,
      criticalCount: discrepancies.filter((d) => d.severity === 'HIGH').length,
      warningCount: discrepancies.filter((d) => d.severity === 'MEDIUM').length,
      infoCount: discrepancies.filter((d) => d.severity === 'LOW').length,
      discrepancies,
      lastAuditedAt: new Date().toISOString(),
    };
  },
};

export default financialCalculationService;
