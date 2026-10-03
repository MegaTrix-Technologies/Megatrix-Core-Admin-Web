import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { CoreExpense } from '../models/CoreExpense.js';

async function migrateExpenses() {
  console.log('--- Connecting to megatrix_global DB ---');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to:', mongoose.connection.name);

  // Access leadhunter database on same cluster
  const lhDb = mongoose.connection.client.db('leadhunter');
  const lhExpenses = await lhDb.collection('expenses').find({}).toArray();
  console.log(`Found ${lhExpenses.length} expenses in LeadHunter DB`);

  for (const e of lhExpenses) {
    let cat = 'miscellaneous';
    const cLower = (e.category || '').toLowerCase();
    if (cLower.includes('software') || cLower.includes('infra')) cat = 'software_saas';
    else if (cLower.includes('market') || cLower.includes('lead')) cat = 'marketing_ads';
    else if (cLower.includes('office')) cat = 'office_infra';
    else if (cLower.includes('legal')) cat = 'legal_compliance';

    let vendor = '';
    const descLower = (e.description || '').toLowerCase();
    if (descLower.includes('namecheap')) vendor = 'Namecheap';
    else if (descLower.includes('instagram')) vendor = 'Instagram / Meta';

    const existing = await CoreExpense.findById(e._id);
    if (!existing) {
      const created = await CoreExpense.create({
        _id: e._id,
        title: e.description || e.reason,
        reason: e.reason || e.description,
        category: cat,
        amount: Number(e.amount) || 0,
        currency: 'PKR',
        expenseDate: e.date || e.createdAt || new Date(),
        date: e.date || e.createdAt || new Date(),
        paymentMethod: 'Bank Transfer (IBFT / Raast)',
        vendor: vendor,
        description: e.description || '',
        status: 'approved',
        sourcePlatform: 'core',
        isRecurring: e.recurrence === 'monthly' || e.recurrence === 'yearly',
        recurringInterval: e.recurrence === 'yearly' ? 'yearly' : 'monthly',
        recurrence: e.recurrence || 'one_time',
        tags: ['migrated_native'],
        createdBy: {
          name: e.createdByName || 'Sales Desk',
          email: 'sales@megatrixai.com',
        },
      });
      console.log('Migrated expense to CoreExpense:', created.title, `(Amount: PKR ${created.amount})`);
    } else {
      console.log('Already exists in CoreExpense:', existing.title);
    }
  }

  const allCore = await CoreExpense.find({}).lean();
  console.log(`\nTotal CoreExpenses in megatrix_global: ${allCore.length}`);
  allCore.forEach((c) => {
    console.log(`- [${c._id}] ${c.title} | ${c.category} | PKR ${c.amount} | Vendor: ${c.vendor || 'N/A'}`);
  });

  await mongoose.disconnect();
  console.log('Migration complete & disconnected.');
}

migrateExpenses().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
