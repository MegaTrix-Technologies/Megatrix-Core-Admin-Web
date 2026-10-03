import dotenv from 'dotenv';
dotenv.config();

import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('DNS warning:', e.message);
}

import mongoose from 'mongoose';
import { AccountSale } from '../models/AccountSale.js';
import { AccountInflow } from '../models/AccountInflow.js';
import { CoreExpense } from '../models/CoreExpense.js';
import { AccountProject } from '../models/AccountProject.js';
import { AccountCommission } from '../models/AccountCommission.js';
import { AccountSnapshot } from '../models/AccountSnapshot.js';

const MONGODB_URI = process.env.MONGODB_URI;

export async function migrateFromLeadHunter() {
  console.log('====================================================');
  console.log(' Starting One-Time LeadHunter -> Core Admin Migration');
  console.log('====================================================');

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGODB_URI);
  }

  const lhDb = mongoose.connection.useDb('leadhunter', { useCache: true });

  // 1. Migrate Sales
  const rawSales = await lhDb.collection('sales').find().toArray();
  console.log(`[Migration] Found ${rawSales.length} legacy sales records.`);

  let migratedSalesCount = 0;
  for (const s of rawSales) {
    const legacyId = s._id.toString();
    const existing = await AccountSale.findOne({ sourceLegacyId: legacyId });
    if (!existing) {
      const saleNumber = `MT-SALE-${s._id.toString().slice(-4).toUpperCase()}`;
      const tot = Number(s.totalAmount) || 0;
      const adv = Number(s.advanceAmount) || 0;
      const rem = s.remainingAmount !== undefined ? Number(s.remainingAmount) : Math.max(0, tot - adv);

      const products = (s.products || []).map((p) => ({
        name: p.name || 'Product/Service',
        quantity: p.quantity || 1,
        unitPrice: Number(p.finalPrice || p.basePrice || tot),
        subtotal: Number(p.finalPrice || p.basePrice || tot),
      }));

      const newSale = await AccountSale.create({
        saleNumber,
        sourceLegacyId: legacyId,
        customer: {
          businessName: s.customer?.businessName || 'Client',
          contactPerson: s.customer?.contactPerson || '',
          email: s.customer?.email || '',
          phone: s.customer?.phoneNumber || s.customer?.phone || '',
          city: s.customer?.city || 'Lahore',
          area: s.customer?.area || '',
          category: s.customer?.category || 'General',
        },
        products: products.length > 0 ? products : [{ name: 'Enterprise Contract', quantity: 1, unitPrice: tot, subtotal: tot }],
        totalAmount: tot,
        advanceAmount: adv,
        remainingAmount: rem,
        status: s.status || (rem === 0 ? 'payment_completed' : 'advance_paid'),
        paymentMethod: s.paymentMethod || 'Bank Transfer',
        payments: adv > 0 ? [{ amount: adv, date: s.closedAt || s.createdAt || new Date(), paymentMethod: s.paymentMethod || 'Bank Transfer', referenceNote: 'Initial Advance Payment', recordedBy: 'Sales Desk' }] : [],
        leadGeneratedBy: {
          id: s.leadGeneratedBy ? s.leadGeneratedBy.toString() : null,
          name: s.leadGeneratedByName || 'Sales Desk',
          email: '',
        },
        closedBy: {
          id: s.closedBy ? s.closedBy.toString() : null,
          name: s.closedByName || 'Super Admin',
          email: '',
        },
        assignedDevelopers: (s.assignedDeveloperNames || []).map((name, idx) => ({
          id: s.assignedDevelopers?.[idx] ? s.assignedDevelopers[idx].toString() : null,
          name,
          role: 'Developer',
        })),
        projectId: s.projectId ? s.projectId.toString() : null,
        isProjectDelivered: Boolean(s.isProjectDelivered),
        deliveredAt: s.deliveryCompletedAt || null,
        closedAt: s.closedAt || s.createdAt || new Date(),
        notes: s.advanceScheduleNotes || s.notes || '',
      });

      // Also create corresponding Inflow for the advance amount if collected
      if (adv > 0) {
        const existingInflow = await AccountInflow.findOne({ sourceLegacyId: `adv_${legacyId}` });
        if (!existingInflow) {
          await AccountInflow.create({
            inflowNumber: `MT-INF-${s._id.toString().slice(-4).toUpperCase()}-ADV`,
            sourceLegacyId: `adv_${legacyId}`,
            title: `Advance: ${s.customer?.businessName || 'Client'}`,
            amount: adv,
            type: 'sale_payment',
            source: s.customer?.businessName || 'Client',
            saleId: newSale._id,
            paymentMethod: s.paymentMethod || 'Bank Transfer',
            reference: s.paymentReference || 'Advance Payment',
            date: s.closedAt || s.createdAt || new Date(),
            recordedBy: s.closedByName || 'Sales Desk',
          });
        }
      }

      migratedSalesCount++;
      console.log(`[Migration] Migrated Sale: ${saleNumber} (${s.customer?.businessName || 'Client'})`);
    }
  }

  // 2. Migrate Independent Inflows
  const rawInflows = await lhDb.collection('inflows').find().toArray();
  console.log(`[Migration] Found ${rawInflows.length} legacy inflows records.`);
  let migratedInflowsCount = 0;

  for (const inf of rawInflows) {
    const legacyId = inf._id.toString();
    const existing = await AccountInflow.findOne({ sourceLegacyId: legacyId });
    if (!existing) {
      const inflowNumber = `MT-INF-${legacyId.slice(-4).toUpperCase()}`;
      await AccountInflow.create({
        inflowNumber,
        sourceLegacyId: legacyId,
        title: inf.title || inf.notes || 'Inflow',
        amount: Number(inf.amount) || 0,
        type: inf.type || 'other_income',
        source: inf.source || 'General',
        paymentMethod: inf.paymentMethod || 'Bank Transfer',
        reference: inf.reference || '',
        date: inf.date || inf.createdAt || new Date(),
        recordedBy: inf.recordedBy || 'Admin',
      });
      migratedInflowsCount++;
    }
  }

  // 3. Migrate Expenses
  const rawExpenses = await lhDb.collection('expenses').find().toArray();
  console.log(`[Migration] Found ${rawExpenses.length} legacy expenses records.`);
  let migratedExpensesCount = 0;

  for (const exp of rawExpenses) {
    const legacyId = exp._id.toString();
    const existing = await CoreExpense.findOne({ referenceId: legacyId });
    if (!existing) {
      await CoreExpense.create({
        title: exp.reason || exp.description || 'Legacy Operating Expense',
        reason: exp.reason || exp.description || 'Legacy Operating Expense',
        category: (exp.category || 'marketing').toLowerCase().includes('market') ? 'marketing' : 'office_supplies',
        amount: Number(exp.amount) || 0,
        currency: exp.currency || 'PKR',
        expenseDate: exp.date || exp.createdAt || new Date(),
        date: exp.date || exp.createdAt || new Date(),
        paymentMethod: exp.paymentMethod || 'Bank Transfer',
        referenceId: legacyId,
        vendor: exp.vendor || 'Vendor',
        description: exp.description || '',
        status: 'paid',
        sourcePlatform: 'core',
        createdBy: {
          name: exp.createdByName || 'Sales Desk',
        },
      });
      migratedExpensesCount++;
      console.log(`[Migration] Migrated Expense: ${exp.reason || 'Expense'} (PKR ${exp.amount})`);
    }
  }

  // 4. Migrate Projects
  const rawProjects = await lhDb.collection('projects').find().toArray();
  console.log(`[Migration] Found ${rawProjects.length} legacy projects records.`);
  let migratedProjectsCount = 0;

  for (const pr of rawProjects) {
    const legacyId = pr._id.toString();
    const existing = await AccountProject.findOne({ sourceLegacyId: legacyId });
    if (!existing) {
      const projectNumber = `MT-PRJ-${legacyId.slice(-4).toUpperCase()}`;
      // Find matching sale
      const linkedSale = await AccountSale.findOne({
        $or: [{ sourceLegacyId: pr.saleId?.toString() }, { projectId: legacyId }],
      });

      await AccountProject.create({
        projectNumber,
        sourceLegacyId: legacyId,
        name: linkedSale ? `${linkedSale.customer?.businessName} Digital Platform` : 'Client Project',
        clientName: linkedSale ? linkedSale.customer?.businessName : 'Client',
        saleId: linkedSale ? linkedSale._id : null,
        contractValue: linkedSale ? linkedSale.totalAmount : 0,
        budgetedCost: linkedSale ? Math.round(linkedSale.totalAmount * 0.3) : 0,
        actualCost: 0,
        status: pr.status === 'completed' ? 'delivered' : 'in_progress',
        leadDeveloper: pr.assignedDeveloperNames?.[0] || 'Hashir Farooq',
        assignedDevelopers: (pr.assignedDeveloperNames || []).map((name) => ({ name, role: 'Developer' })),
        isDelivered: pr.status === 'completed',
        startDate: pr.createdAt || new Date(),
        deliveredAt: pr.completedAt || null,
        notes: pr.deliveryNotes?.map((n) => n.note).join(' | ') || '',
      });
      migratedProjectsCount++;
      console.log(`[Migration] Migrated Project: ${projectNumber}`);
    }
  }

  console.log('====================================================');
  console.log(` Migration Summary:`);
  console.log(`  Sales Migrated:    ${migratedSalesCount}`);
  console.log(`  Inflows Migrated:  ${migratedInflowsCount}`);
  console.log(`  Expenses Migrated: ${migratedExpensesCount}`);
  console.log(`  Projects Migrated: ${migratedProjectsCount}`);
  console.log('====================================================');

  return {
    success: true,
    migratedSalesCount,
    migratedInflowsCount,
    migratedExpensesCount,
    migratedProjectsCount,
  };
}

// Allow direct CLI invocation
if (process.argv[1] && process.argv[1].endsWith('migrate-from-leadhunter.js')) {
  migrateFromLeadHunter()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Migration Error]:', err);
      process.exit(1);
    });
}
