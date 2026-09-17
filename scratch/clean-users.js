import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { AdminUser } from './../server/models/AdminUser.js';
import { Invitation } from './../server/models/Invitation.js';

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  // Delete all non-superadmin users
  const delUsers = await AdminUser.deleteMany({ isSuperAdmin: { $ne: true } });
  console.log('Deleted non-superadmin users count:', delUsers.deletedCount);

  // Delete all invitations
  const delInvites = await Invitation.deleteMany({});
  console.log('Deleted invitations count:', delInvites.deletedCount);

  // Update superadmin to ensure active and correct name
  const superAdmin = await AdminUser.findOne({ isSuperAdmin: true });
  if (superAdmin) {
    superAdmin.name = 'Zohaib Rana';
    superAdmin.email = 'admin.megatrix@gmail.com';
    superAdmin.status = 'active';
    superAdmin.accessLevel = 'full';
    await superAdmin.save();
    console.log('Superadmin verified:', superAdmin.name, superAdmin.email, superAdmin.status);
  }

  const allUsers = await AdminUser.find({});
  console.log('Remaining users in database:', allUsers.map(u => ({ id: u._id, name: u.name, email: u.email, status: u.status, isSuperAdmin: u.isSuperAdmin })));

  await mongoose.disconnect();
  console.log('Finished cleanly.');
  process.exit(0);
})();
