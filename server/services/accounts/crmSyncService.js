import mongoose from 'mongoose';
import { AccountSale } from '../../models/AccountSale.js';
import { AccountInflow } from '../../models/AccountInflow.js';
import { AccountCommission } from '../../models/AccountCommission.js';
import { AccountProject } from '../../models/AccountProject.js';
import { AccountSyncLog } from '../../models/AccountSyncLog.js';
import { AdminUser } from '../../models/AdminUser.js';
import crypto from 'crypto';

/**
 * LeadHunter CRM Bi-Directional Synchronization Service
 * Interfaces directly with MongoDB Atlas `leadhunter` database.
 */
class CrmSyncService {
  /**
   * Get reference to the leadhunter database instance
   */
  getLeadHunterDb() {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection is not ready.');
    }
    return mongoose.connection.useDb('leadhunter', { useCache: true });
  }

  /**
   * Fetch all active Sales Agents, Closers, and Developers from CRM
   * Includes their individual commission rates and referral incentives.
   */
  async getSalesAgents() {
    try {
      const lhDb = this.getLeadHunterDb();
      const rawUsers = await lhDb.collection('users').find({ status: { $ne: 'blocked' } }).toArray();

      const formattedAgents = rawUsers.map((u) => {
        const rates = u.commissionRates || {};
        return {
          id: u._id.toString(),
          name: u.name || 'Agent',
          email: u.email || '',
          role: u.role || 'agent',
          roles: Array.isArray(u.roles) ? u.roles : ['sales_agent'],
          commissionRates: {
            leadGenPercent: Number(rates.leadGenPercent) || 0,
            closerPercent: Number(rates.closerPercent) || 0,
            developerPercent: Number(rates.developerPercent) || 0,
            referralPercent: Number(u.referralPercent) || 0,
          },
          status: u.status || 'active',
        };
      });

      return formattedAgents;
    } catch (err) {
      console.error('[CrmSyncService:getSalesAgents] Error:', err);
      return [];
    }
  }

  /**
   * Dry-run Diff / Preview of data to be synced from CRM to Core Admin
   */
  async previewCrmSync() {
    const startTime = Date.now();
    const lhDb = this.getLeadHunterDb();

    // 1. Fetch CRM Sales & Users
    const [rawSales, rawUsers, rawInflows] = await Promise.all([
      lhDb.collection('sales').find({}).toArray(),
      lhDb.collection('users').find({}).toArray(),
      lhDb.collection('inflows').find({}).toArray(),
    ]);

    // 2. Fetch existing Admin records to detect diff
    const existingSales = await AccountSale.find({}).lean();
    const existingSaleLegacyMap = new Map();
    existingSales.forEach((s) => {
      if (s.sourceLegacyId) existingSaleLegacyMap.set(s.sourceLegacyId, s);
    });

    const userMap = new Map();
    rawUsers.forEach((u) => userMap.set(u._id.toString(), u));

    const salesDiff = [];
    let newSalesCount = 0;
    let updatedSalesCount = 0;
    let totalSalesValue = 0;
    let totalAdvanceCash = 0;
    let totalCommissionLiabilities = 0;

    const normalizeStatus = (st) => {
      if (!st) return 'contract_signed';
      if (st === 'advance_paid' || st === 'partial_payment') return 'partial_payment';
      if (st === 'payment_completed' || st === 'completed') return 'payment_completed';
      if (st === 'contract_signed' || st === 'pending') return 'contract_signed';
      return st;
    };

    for (const s of rawSales) {
      const legacyId = s._id.toString();
      const existing = existingSaleLegacyMap.get(legacyId);
      const totalAmount = Number(s.totalAmount) || 0;
      const advanceAmount = Number(s.advanceAmount) || 0;
      const remainingAmount = s.remainingAmount !== undefined ? Number(s.remainingAmount) : Math.max(0, totalAmount - advanceAmount);

      totalSalesValue += totalAmount;
      totalAdvanceCash += advanceAmount;

      // Determine Lead Gen Agent details
      let leadGenUser = null;
      if (s.leadGeneratedBy) {
        leadGenUser = userMap.get(s.leadGeneratedBy.toString());
      }

      // Determine Closer Agent details
      let closerUser = null;
      if (s.closedBy) {
        closerUser = userMap.get(s.closedBy.toString());
      }

      // Compute precise commissions based strictly on actual user rate cards (0% if not configured)
      const leadGenPercent = Number(leadGenUser?.commissionRates?.leadGenPercent) || 0;
      const closerPercent = Number(closerUser?.commissionRates?.closerPercent) || 0;

      let devPercent = 0;
      if (Array.isArray(s.assignedDevelopers) && s.assignedDevelopers.length > 0) {
        s.assignedDevelopers.forEach((devId) => {
          const devUser = userMap.get(devId?.toString());
          if (devUser?.commissionRates?.developerPercent) {
            devPercent += Number(devUser.commissionRates.developerPercent);
          }
        });
      }

      let refUser = null;
      let referralPercent = 0;

      if (leadGenUser?.referredBy) {
        refUser = userMap.get(leadGenUser.referredBy.toString());
        referralPercent = Number(leadGenUser.referralPercent) || 0;
      } else if (closerUser?.referredBy) {
        refUser = userMap.get(closerUser.referredBy.toString());
        referralPercent = Number(closerUser.referralPercent) || 0;
      } else if (s.referralPartner?.name || s.referralPartner?.id) {
        referralPercent = Number(s.commissionRates?.referralPercent) || Number(s.referralPercent) || 0;
      }

      const referralPartnerName = refUser ? refUser.name : (s.referralPartner?.name || leadGenUser?.referredByName || closerUser?.referredByName || '');

      const leadGenComm = Math.round((totalAmount * leadGenPercent) / 100);
      const closerComm = Math.round((totalAmount * closerPercent) / 100);
      const devComm = Math.round((totalAmount * devPercent) / 100);
      const referralComm = Math.round((totalAmount * referralPercent) / 100);
      const totalDealComm = leadGenComm + closerComm + devComm + referralComm;

      totalCommissionLiabilities += totalDealComm;

      let diffStatus = 'UNCHANGED';
      if (!existing) {
        diffStatus = 'NEW';
      } else {
        const isAmountChanged =
          Number(existing.totalAmount || 0) !== totalAmount ||
          Number(existing.advanceAmount || 0) !== advanceAmount ||
          Number(existing.remainingAmount || 0) !== remainingAmount;
        const isStatusChanged = normalizeStatus(existing.status) !== normalizeStatus(s.status);
        const isDeliveredChanged = Boolean(existing.isProjectDelivered) !== Boolean(s.isProjectDelivered);

        if (isAmountChanged || isStatusChanged || isDeliveredChanged) {
          diffStatus = 'UPDATE';
        } else {
          diffStatus = 'UNCHANGED';
        }
      }

      if (diffStatus === 'NEW') newSalesCount++;
      if (diffStatus === 'UPDATE') updatedSalesCount++;

      salesDiff.push({
        legacyId,
        existingId: existing?._id || null,
        saleNumber: existing?.saleNumber || `MT-SALE-${legacyId.slice(-4).toUpperCase()}`,
        diffStatus,
        customer: {
          businessName: s.customer?.businessName || 'Client',
          phoneNumber: s.customer?.phoneNumber || s.customer?.phone || '',
          email: s.customer?.email || '',
          city: s.customer?.city || 'Lahore',
          area: s.customer?.area || '',
          category: s.customer?.category || 'General',
        },
        totalAmount,
        advanceAmount,
        remainingAmount,
        status: s.status || (remainingAmount === 0 ? 'payment_completed' : 'advance_paid'),
        closedByName: s.closedByName || closerUser?.name || 'Super Admin',
        closerId: s.closedBy ? s.closedBy.toString() : null,
        closerPercent,
        closerComm,
        leadGeneratedByName: s.leadGeneratedByName || leadGenUser?.name || 'Sales Desk',
        leadGenId: s.leadGeneratedBy ? s.leadGeneratedBy.toString() : null,
        leadGenPercent,
        leadGenComm,
        assignedDeveloperNames: s.assignedDeveloperNames || [],
        devPercent,
        devComm,
        referralPartnerName,
        referralPercent,
        referralComm,
        totalEstimatedCommission: totalDealComm,
        isProjectDelivered: Boolean(s.isProjectDelivered),
        closedAt: s.closedAt || s.createdAt || new Date(),
        notes: s.notes || s.advanceScheduleNotes || '',
      });
    }

    // Agent Profiles summary
    const agentsSummary = rawUsers.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      roles: u.roles || ['sales_agent'],
      commissionRates: {
        leadGenPercent: Number(u.commissionRates?.leadGenPercent) || 0,
        closerPercent: Number(u.commissionRates?.closerPercent) || 0,
        developerPercent: Number(u.commissionRates?.developerPercent) || 0,
        referralPercent: Number(u.referralPercent) || 0,
      },
    }));

    const hasPendingChanges = newSalesCount > 0 || updatedSalesCount > 0;

    return {
      success: true,
      previewTime: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      stats: {
        totalCrmSales: rawSales.length,
        newSalesCount,
        updatedSalesCount,
        unchangedSalesCount: rawSales.length - (newSalesCount + updatedSalesCount),
        hasPendingChanges,
        totalSalesValue,
        totalAdvanceCash,
        totalCommissionLiabilities,
        totalAgents: rawUsers.length,
        totalInflows: rawInflows.length,
      },
      salesDiff,
      agentsSummary,
    };
  }

  /**
   * Execute CRM Sync to master database
   */
  async executeCrmSync(options = {}) {
    const startTime = Date.now();
    const lhDb = this.getLeadHunterDb();
    const { selectedSaleIds, actor = { name: 'Superadmin' } } = options;

    const [rawSales, rawUsers, rawInflows, rawProjects] = await Promise.all([
      lhDb.collection('sales').find({}).toArray(),
      lhDb.collection('users').find({}).toArray(),
      lhDb.collection('inflows').find({}).toArray(),
      lhDb.collection('projects').find({}).toArray(),
    ]);

    const userMap = new Map();
    rawUsers.forEach((u) => userMap.set(u._id.toString(), u));

    let createdSalesCount = 0;
    let updatedSalesCount = 0;
    let createdInflowsCount = 0;
    let createdCommissionsCount = 0;

    for (const s of rawSales) {
      const legacyId = s._id.toString();
      if (selectedSaleIds && selectedSaleIds.length > 0 && !selectedSaleIds.includes(legacyId)) {
        continue; // Skip if user unselected this specific sale
      }

      const tot = Number(s.totalAmount) || 0;
      const adv = Number(s.advanceAmount) || 0;
      const rem = s.remainingAmount !== undefined ? Number(s.remainingAmount) : Math.max(0, tot - adv);

      const products = (s.products || []).map((p) => ({
        name: p.name || 'Software Contract',
        quantity: p.quantity || 1,
        unitPrice: Number(p.finalPrice || p.basePrice || tot),
        subtotal: Number(p.finalPrice || p.basePrice || tot),
      }));

      const leadGenUser = s.leadGeneratedBy ? userMap.get(s.leadGeneratedBy.toString()) : null;
      const closerUser = s.closedBy ? userMap.get(s.closedBy.toString()) : null;

      const leadGenPercent = Number(leadGenUser?.commissionRates?.leadGenPercent) || 0;
      const closerPercent = Number(closerUser?.commissionRates?.closerPercent) || 0;

      let devPercent = 0;
      if (Array.isArray(s.assignedDevelopers) && s.assignedDevelopers.length > 0) {
        s.assignedDevelopers.forEach((devId) => {
          const devUser = userMap.get(devId?.toString());
          if (devUser?.commissionRates?.developerPercent) {
            devPercent += Number(devUser.commissionRates.developerPercent);
          }
        });
      }

      let refUser = null;
      let referralPercent = 0;

      if (leadGenUser?.referredBy) {
        refUser = userMap.get(leadGenUser.referredBy.toString());
        referralPercent = Number(leadGenUser.referralPercent) || 0;
      } else if (closerUser?.referredBy) {
        refUser = userMap.get(closerUser.referredBy.toString());
        referralPercent = Number(closerUser.referralPercent) || 0;
      } else if (s.referralPartner?.name || s.referralPartner?.id) {
        referralPercent = Number(s.commissionRates?.referralPercent) || Number(s.referralPercent) || 0;
      }

      const referralPartner = {
        id: refUser ? refUser._id.toString() : (s.referralPartner?.id || null),
        name: refUser ? refUser.name : (s.referralPartner?.name || leadGenUser?.referredByName || closerUser?.referredByName || ''),
        email: refUser ? refUser.email : (s.referralPartner?.email || ''),
      };

      const estimatedCommission = Math.round((tot * (leadGenPercent + closerPercent + devPercent + referralPercent)) / 100);

      const salePayload = {
        sourceLegacyId: legacyId,
        customer: {
          businessName: s.customer?.businessName || 'Client',
          contactPerson: s.customer?.contactPerson || '',
          email: s.customer?.email || '',
          phone: s.customer?.phoneNumber || s.customer?.phone || '',
          city: s.customer?.city || 'Lahore',
          area: s.customer?.area || '',
          category: s.customer?.category || 'Software & Technology',
        },
        products: products.length > 0 ? products : [{ name: 'Enterprise Contract', quantity: 1, unitPrice: tot, subtotal: tot }],
        totalAmount: tot,
        advanceAmount: adv,
        remainingAmount: rem,
        status: s.status || (rem === 0 ? 'payment_completed' : 'advance_paid'),
        paymentMethod: s.paymentMethod || 'Bank Transfer',
        leadGeneratedBy: {
          id: s.leadGeneratedBy ? s.leadGeneratedBy.toString() : null,
          name: s.leadGeneratedByName || leadGenUser?.name || 'Sales Desk',
          email: leadGenUser?.email || '',
        },
        closedBy: {
          id: s.closedBy ? s.closedBy.toString() : null,
          name: s.closedByName || closerUser?.name || 'Super Admin',
          email: closerUser?.email || '',
        },
        assignedDevelopers: (s.assignedDeveloperNames || []).map((name, idx) => ({
          id: s.assignedDevelopers?.[idx] ? s.assignedDevelopers[idx].toString() : null,
          name,
          role: 'Developer',
        })),
        referralPartner,
        commissionRates: {
          leadGenPercent,
          closerPercent,
          developerPercent: devPercent,
          referralPercent,
        },
        estimatedCommission,
        isProjectDelivered: Boolean(s.isProjectDelivered),
        deliveredAt: s.deliveryCompletedAt || null,
        closedAt: s.closedAt || s.createdAt || new Date(),
        notes: s.advanceScheduleNotes || s.notes || '',
      };

      let targetSale = await AccountSale.findOne({ sourceLegacyId: legacyId });
      if (!targetSale) {
        salePayload.saleNumber = `MT-SALE-${legacyId.slice(-4).toUpperCase()}`;
        if (adv > 0) {
          salePayload.payments = [
            {
              amount: adv,
              date: s.closedAt || s.createdAt || new Date(),
              paymentMethod: s.paymentMethod || 'Bank Transfer',
              referenceNote: 'Initial Advance Payment (CRM Sync)',
              recordedBy: s.closedByName || 'Sales Desk',
            },
          ];
        }
        targetSale = await AccountSale.create(salePayload);
        createdSalesCount++;
      } else {
        // Update existing sale
        Object.assign(targetSale, salePayload);
        await targetSale.save();
        updatedSalesCount++;
      }

      // Sync Advance Inflow
      if (adv > 0) {
        const existingInflow = await AccountInflow.findOne({ sourceLegacyId: `adv_${legacyId}` });
        if (!existingInflow) {
          await AccountInflow.create({
            inflowNumber: `MT-INF-${legacyId.slice(-4).toUpperCase()}-ADV`,
            sourceLegacyId: `adv_${legacyId}`,
            title: `Advance: ${s.customer?.businessName || 'Client'}`,
            amount: adv,
            type: 'sale_payment',
            source: s.customer?.businessName || 'Client',
            saleId: targetSale._id,
            paymentMethod: s.paymentMethod || 'Bank Transfer',
            reference: s.paymentReference || 'Advance Payment (CRM Sync)',
            date: s.closedAt || s.createdAt || new Date(),
            recordedBy: s.closedByName || 'Sales Desk',
          });
          createdInflowsCount++;
        }
      }

      // Accrue Commissions for this deal
      // 1. Lead Gen Commission
      if (s.leadGeneratedBy && leadGenPercent > 0) {
        const commAmt = Math.round((tot * leadGenPercent) / 100);
        const commNum = `COMM-${legacyId.slice(-4).toUpperCase()}-LG`;
        await AccountCommission.findOneAndUpdate(
          { commissionNumber: commNum },
          {
            commissionNumber: commNum,
            sourceLegacyId: `comm_lg_${legacyId}`,
            beneficiary: {
              userId: s.leadGeneratedBy.toString(),
              name: s.leadGeneratedByName || leadGenUser?.name || 'Sales Rep',
              email: leadGenUser?.email || '',
              role: 'Lead Generator',
            },
            saleId: targetSale._id,
            saleNumber: targetSale.saleNumber,
            clientName: targetSale.customer.businessName,
            saleAmount: tot,
            roleType: 'lead_generator',
            percentage: leadGenPercent,
            amount: commAmt,
            status: targetSale.status === 'payment_completed' && targetSale.isProjectDelivered ? 'approved' : 'accrued',
          },
          { upsert: true, returnDocument: 'after' }
        );
        createdCommissionsCount++;
      } else {
        await AccountCommission.deleteOne({ sourceLegacyId: `comm_lg_${legacyId}` });
      }

      // 2. Closer Commission
      if (s.closedBy && closerPercent > 0) {
        const commAmt = Math.round((tot * closerPercent) / 100);
        const commNum = `COMM-${legacyId.slice(-4).toUpperCase()}-CL`;
        await AccountCommission.findOneAndUpdate(
          { commissionNumber: commNum },
          {
            commissionNumber: commNum,
            sourceLegacyId: `comm_cl_${legacyId}`,
            beneficiary: {
              userId: s.closedBy.toString(),
              name: s.closedByName || closerUser?.name || 'Sales Closer',
              email: closerUser?.email || '',
              role: 'Sales Closer',
            },
            saleId: targetSale._id,
            saleNumber: targetSale.saleNumber,
            clientName: targetSale.customer.businessName,
            saleAmount: tot,
            roleType: 'sales_closer',
            percentage: closerPercent,
            amount: commAmt,
            status: targetSale.status === 'payment_completed' && targetSale.isProjectDelivered ? 'approved' : 'accrued',
          },
          { upsert: true, returnDocument: 'after' }
        );
        createdCommissionsCount++;
      } else {
        await AccountCommission.deleteOne({ sourceLegacyId: `comm_cl_${legacyId}` });
      }

      // 3. Referral Partner Commission
      if (referralPartner.name && referralPercent > 0) {
        const commAmt = Math.round((tot * referralPercent) / 100);
        const commNum = `COMM-${legacyId.slice(-4).toUpperCase()}-REF`;
        await AccountCommission.findOneAndUpdate(
          { commissionNumber: commNum },
          {
            commissionNumber: commNum,
            sourceLegacyId: `comm_ref_${legacyId}`,
            beneficiary: {
              userId: referralPartner.id || `ref_${referralPartner.name}`,
              name: referralPartner.name,
              email: referralPartner.email || '',
              role: 'Referral Partner',
            },
            saleId: targetSale._id,
            saleNumber: targetSale.saleNumber,
            clientName: targetSale.customer.businessName,
            saleAmount: tot,
            roleType: 'referral_partner',
            percentage: referralPercent,
            amount: commAmt,
            status: targetSale.status === 'payment_completed' && targetSale.isProjectDelivered ? 'approved' : 'accrued',
          },
          { upsert: true, returnDocument: 'after' }
        );
        createdCommissionsCount++;
      } else {
        await AccountCommission.deleteOne({ sourceLegacyId: `comm_ref_${legacyId}` });
      }
    }

    // Sync Independent CRM Inflows
    for (const inf of rawInflows) {
      const legacyId = inf._id.toString();
      const existing = await AccountInflow.findOne({ sourceLegacyId: legacyId });
      if (!existing) {
        await AccountInflow.create({
          inflowNumber: `MT-INF-${legacyId.slice(-4).toUpperCase()}`,
          sourceLegacyId: legacyId,
          title: inf.title || inf.notes || 'CRM Capital Inflow',
          amount: Number(inf.amount) || 0,
          type: inf.type || 'other_income',
          source: inf.source || 'CRM External',
          paymentMethod: inf.paymentMethod || 'Bank Transfer',
          reference: inf.reference || '',
          date: inf.date || inf.createdAt || new Date(),
          recordedBy: inf.recordedBy || 'Admin',
        });
        createdInflowsCount++;
      }
    }

    // Sync CRM Projects
    for (const pr of rawProjects) {
      const legacyId = pr._id.toString();
      const existing = await AccountProject.findOne({ sourceLegacyId: legacyId });
      if (!existing) {
        const linkedSale = await AccountSale.findOne({ sourceLegacyId: pr.saleId?.toString() });
        await AccountProject.create({
          projectNumber: `MT-PRJ-${legacyId.slice(-4).toUpperCase()}`,
          sourceLegacyId: legacyId,
          name: linkedSale ? `${linkedSale.customer?.businessName} Digital Solution` : 'Client Project',
          clientName: linkedSale ? linkedSale.customer?.businessName : 'Client',
          saleId: linkedSale ? linkedSale._id : null,
          contractValue: linkedSale ? linkedSale.totalAmount : 0,
          budgetedCost: linkedSale ? Math.round(linkedSale.totalAmount * 0.3) : 0,
          actualCost: 0,
          status: pr.status === 'completed' ? 'delivered' : 'in_progress',
          leadDeveloper: pr.assignedDeveloperNames?.[0] || 'Lead Developer',
          assignedDevelopers: (pr.assignedDeveloperNames || []).map((name) => ({ name, role: 'Developer' })),
          isDelivered: pr.status === 'completed',
          startDate: pr.createdAt || new Date(),
          deliveredAt: pr.completedAt || null,
          notes: pr.deliveryNotes?.map((n) => n.note).join(' | ') || '',
        });
      }
    }

    const durationMs = Date.now() - startTime;
    const syncId = `crm_sync_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    // Write audit log
    await AccountSyncLog.create({
      sourcePlatform: 'leadhunter_crm',
      syncId,
      startedAt: new Date(startTime),
      completedAt: new Date(),
      durationMs,
      status: 'success',
      mode: 'crm_live_integration',
      recordsFetched: {
        sales: rawSales.length,
        projects: rawProjects.length,
        inflows: rawInflows.length,
        commissions: createdCommissionsCount,
        total: createdSalesCount + updatedSalesCount + createdInflowsCount,
      },
      triggeredBy: {
        name: actor.name || 'Superadmin',
        email: actor.email || 'admin@megatrix.internal',
      },
    });

    return {
      success: true,
      syncId,
      durationMs,
      summary: {
        createdSales: createdSalesCount,
        updatedSales: updatedSalesCount,
        createdInflows: createdInflowsCount,
        createdCommissions: createdCommissionsCount,
      },
    };
  }

  /**
   * Bi-Directional Push: Propagate an Admin Portal sale to the CRM database
   */
  async syncSaleToCrm(accountSale) {
    try {
      const lhDb = this.getLeadHunterDb();
      const rawSales = lhDb.collection('sales');
      const rawUsers = lhDb.collection('users');
      const rawProjects = lhDb.collection('projects');
      const rawInflows = lhDb.collection('inflows');

      // Fetch all users to do reliable ID and name resolution
      const allUsers = await rawUsers.find({}).toArray();
      const findUser = (userRef) => {
        if (!userRef) return null;
        if (userRef.id && mongoose.Types.ObjectId.isValid(userRef.id)) {
          const match = allUsers.find((u) => u._id.toString() === userRef.id.toString());
          if (match) return match;
        }
        if (typeof userRef === 'string' && mongoose.Types.ObjectId.isValid(userRef)) {
          const match = allUsers.find((u) => u._id.toString() === userRef);
          if (match) return match;
        }
        const name = typeof userRef === 'string' ? userRef : (userRef.name || '');
        if (name && name.trim()) {
          const match = allUsers.find((u) => u.name && u.name.trim().toLowerCase() === name.trim().toLowerCase());
          if (match) return match;
        }
        return null;
      };

      const leadGenUser = findUser(accountSale.leadGeneratedBy);
      const closerUser = findUser(accountSale.closedBy);

      const devObjectIds = [];
      const devNames = [];
      if (Array.isArray(accountSale.assignedDevelopers)) {
        accountSale.assignedDevelopers.forEach((d) => {
          const matchedDev = findUser(d);
          if (matchedDev) {
            devObjectIds.push(matchedDev._id);
            devNames.push(matchedDev.name);
          } else if (d?.name) {
            devNames.push(d.name);
          }
        });
      }

      // Check referral user
      let referralUser = findUser(accountSale.referralPartner);
      if (!referralUser && leadGenUser?.referredBy) {
        referralUser = allUsers.find((u) => u._id.toString() === leadGenUser.referredBy.toString());
      } else if (!referralUser && closerUser?.referredBy) {
        referralUser = allUsers.find((u) => u._id.toString() === closerUser.referredBy.toString());
      }

      const leadGenPercent = accountSale.commissionRates?.leadGenPercent !== undefined
        ? Number(accountSale.commissionRates.leadGenPercent)
        : (Number(leadGenUser?.commissionRates?.leadGenPercent) || 0);

      const closerPercent = accountSale.commissionRates?.closerPercent !== undefined
        ? Number(accountSale.commissionRates.closerPercent)
        : (Number(closerUser?.commissionRates?.closerPercent) || 0);

      const devPercent = accountSale.commissionRates?.developerPercent !== undefined
        ? Number(accountSale.commissionRates.developerPercent)
        : 0;

      const referralPercent = accountSale.commissionRates?.referralPercent !== undefined
        ? Number(accountSale.commissionRates.referralPercent)
        : (Number(leadGenUser?.referralPercent) || Number(closerUser?.referralPercent) || 0);

      const totalDealPercent = leadGenPercent + closerPercent + devPercent + referralPercent;
      const estimatedCommission = accountSale.estimatedCommission !== undefined
        ? Number(accountSale.estimatedCommission)
        : Math.round(((accountSale.totalAmount || 0) * totalDealPercent) / 100);

      const referralPartnerObj = {
        id: referralUser ? referralUser._id.toString() : (accountSale.referralPartner?.id || null),
        name: referralUser ? referralUser.name : (accountSale.referralPartner?.name || ''),
        email: referralUser ? referralUser.email : (accountSale.referralPartner?.email || ''),
      };

      const crmSalePayload = {
        customer: {
          businessName: accountSale.customer.businessName,
          phoneNumber: accountSale.customer.phone || accountSale.customer.phoneNumber || '',
          email: accountSale.customer.email || '',
          address: accountSale.customer.address || '',
          area: accountSale.customer.area || 'Lahore',
          category: accountSale.customer.category || 'General',
        },
        products: (accountSale.products || []).map((p) => ({
          name: p.name,
          basePrice: p.unitPrice,
          finalPrice: p.subtotal || p.unitPrice,
          quantity: p.quantity || 1,
        })),
        totalAmount: Number(accountSale.totalAmount) || 0,
        advanceAmount: Number(accountSale.advanceAmount) || 0,
        remainingAmount: Number(accountSale.remainingAmount) || 0,
        status: accountSale.status === 'payment_completed' ? 'payment_completed' : 'advance_paid',
        leadGeneratedBy: leadGenUser ? leadGenUser._id : null,
        leadGeneratedByName: leadGenUser ? leadGenUser.name : (accountSale.leadGeneratedBy?.name || 'Sales Desk'),
        closedBy: closerUser ? closerUser._id : null,
        closedByName: closerUser ? closerUser.name : (accountSale.closedBy?.name || 'Super Admin'),
        assignedDevelopers: devObjectIds,
        assignedDeveloperNames: devNames.length > 0 ? devNames : (accountSale.assignedDevelopers || []).map((d) => d.name || 'Developer'),
        commissionRates: {
          leadGenPercent,
          closerPercent,
          developerPercent: devPercent,
          referralPercent,
        },
        estimatedCommission,
        referralPartner: referralPartnerObj,
        paymentMethod: accountSale.paymentMethod || 'Bank Transfer',
        notes: accountSale.notes || '',
        isProjectDelivered: Boolean(accountSale.isProjectDelivered),
        closedAt: accountSale.closedAt ? new Date(accountSale.closedAt) : new Date(),
        updatedAt: new Date(),
      };

      let crmSaleId = null;

      if (accountSale.sourceLegacyId && mongoose.Types.ObjectId.isValid(accountSale.sourceLegacyId)) {
        crmSaleId = new mongoose.Types.ObjectId(accountSale.sourceLegacyId);
        await rawSales.updateOne(
          { _id: crmSaleId },
          { $set: crmSalePayload },
          { upsert: true }
        );
      } else {
        crmSalePayload.createdAt = new Date();
        const res = await rawSales.insertOne(crmSalePayload);
        crmSaleId = res.insertedId;
        // Link the legacy ID back to AccountSale
        accountSale.sourceLegacyId = crmSaleId.toString();
        await AccountSale.findByIdAndUpdate(accountSale._id, { sourceLegacyId: crmSaleId.toString() });
      }

      // Upsert corresponding Project in leadhunter.projects
      if (crmSaleId) {
        const existingProject = await rawProjects.findOne({ saleId: crmSaleId });
        const projectStatus = accountSale.isProjectDelivered ? 'completed' : 'active';
        const projectUpdate = {
          saleId: crmSaleId,
          assignedDevelopers: devObjectIds,
          assignedDeveloperNames: devNames,
          status: projectStatus,
          completedAt: accountSale.isProjectDelivered ? (accountSale.deliveredAt || new Date()) : null,
          updatedAt: new Date(),
        };

        if (existingProject) {
          await rawProjects.updateOne({ _id: existingProject._id }, { $set: projectUpdate });
          await rawSales.updateOne({ _id: crmSaleId }, { $set: { projectId: existingProject._id } });
        } else {
          projectUpdate.createdAt = new Date();
          projectUpdate.deliveryNotes = [
            {
              note: `Project initialized for ${accountSale.customer.businessName}. Total Contract: PKR ${accountSale.totalAmount?.toLocaleString() || 0}`,
              author: 'Core Admin',
              timestamp: new Date(),
            },
          ];
          const prjRes = await rawProjects.insertOne(projectUpdate);
          await rawSales.updateOne({ _id: crmSaleId }, { $set: { projectId: prjRes.insertedId } });
        }

        // Upsert advance payment in leadhunter.inflows if advance > 0
        if (Number(accountSale.advanceAmount) > 0) {
          const existingInflow = await rawInflows.findOne({ saleId: crmSaleId, category: 'Project Milestone Payment' });
          if (!existingInflow) {
            await rawInflows.insertOne({
              type: 'project_payment',
              sourceName: accountSale.customer.businessName,
              category: 'Project Milestone Payment',
              amount: Number(accountSale.advanceAmount),
              currency: 'PKR',
              date: accountSale.closedAt ? new Date(accountSale.closedAt) : new Date(),
              paymentMethod: accountSale.paymentMethod || 'Bank Transfer',
              referenceId: 'Initial Advance Payment (Core Admin)',
              saleId: crmSaleId,
              createdByName: accountSale.closedBy?.name || 'Core Admin',
              createdAt: new Date(),
            });
          }
        }
      }

      console.log(`[CrmSyncService] Bi-directional sync success for sale: ${accountSale.saleNumber} (CRM ID: ${crmSaleId})`);
      return { success: true, crmSaleId };
    } catch (err) {
      console.error('[CrmSyncService:syncSaleToCrm] Error:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Bi-Directional Push: Propagate milestone payments to CRM
   */
  async syncPaymentToCrm(accountSale, paymentData) {
    try {
      const lhDb = this.getLeadHunterDb();
      if (!accountSale.sourceLegacyId || !mongoose.Types.ObjectId.isValid(accountSale.sourceLegacyId)) {
        return this.syncSaleToCrm(accountSale);
      }

      const crmSaleId = new mongoose.Types.ObjectId(accountSale.sourceLegacyId);
      await lhDb.collection('sales').updateOne(
        { _id: crmSaleId },
        {
          $set: {
            advanceAmount: accountSale.advanceAmount,
            remainingAmount: accountSale.remainingAmount,
            status: accountSale.remainingAmount === 0 ? 'payment_completed' : 'advance_paid',
            updatedAt: new Date(),
          },
        }
      );

      // Record CRM Inflow
      await lhDb.collection('inflows').insertOne({
        type: 'project_payment',
        saleId: crmSaleId,
        sourceName: accountSale.customer.businessName,
        category: 'Project Milestone Payment',
        amount: paymentData.amount,
        currency: 'PKR',
        date: paymentData.date || new Date(),
        paymentMethod: paymentData.paymentMethod || 'Bank Transfer',
        referenceId: paymentData.referenceNote || 'Payment collected via Admin Portal',
        createdAt: new Date(),
      });

      console.log(`[CrmSyncService] Propagated payment of PKR ${paymentData.amount} to CRM for deal ${accountSale.saleNumber}`);
      return { success: true };
    } catch (err) {
      console.error('[CrmSyncService:syncPaymentToCrm] Error:', err);
      return { success: false, error: err.message };
    }
  }
}

export const crmSyncService = new CrmSyncService();
