import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const collectionsToClear = [
  'accountsales',
  'accountinflows',
  'coreexpenses',
  'accountadjustments',
  'accountcommissions',
  'accountprojects',
  'accountsynclogs',
  'accountsnapshots',
  'auditlogs',
  'invitations',
];

const collectionsToPreserve = [
  'adminusers',
  'roles',
  'credentials',
];

async function runCleanup() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in environment!');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  console.log(`Connected to database: ${db.databaseName}\n`);

  console.log('=== BEFORE CLEANUP ===');
  const allCollections = await db.listCollections().toArray();
  for (const c of allCollections) {
    const count = await db.collection(c.name).countDocuments();
    console.log(`  - ${c.name}: ${count} documents`);
  }

  console.log('\n=== CLEARING TARGET COLLECTIONS ===');
  const deletionResults = {};
  for (const colName of collectionsToClear) {
    const colExists = allCollections.some((c) => c.name === colName);
    if (colExists) {
      const res = await db.collection(colName).deleteMany({});
      deletionResults[colName] = res.deletedCount;
      console.log(`  ✓ Cleared ${colName}: ${res.deletedCount} documents deleted`);
    } else {
      console.log(`  - ${colName}: (collection does not exist)`);
    }
  }

  console.log('\n=== AFTER CLEANUP STATUS ===');
  const updatedCollections = await db.listCollections().toArray();
  for (const c of updatedCollections) {
    const count = await db.collection(c.name).countDocuments();
    const status = collectionsToPreserve.includes(c.name) ? '[PRESERVED]' : '[CLEARED]';
    console.log(`  ${status} ${c.name}: ${count} documents`);
  }

  await mongoose.disconnect();
  console.log('\nCleanup completed successfully.');
}

runCleanup().catch((err) => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
