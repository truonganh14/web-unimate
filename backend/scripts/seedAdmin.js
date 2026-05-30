import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../src/models/User.js';

const adminEmail = (process.env.ADMIN_SEED_EMAIL || 'admin@fpt.edu.vn').trim().toLowerCase();
const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'Admin@123456';
const adminName = process.env.ADMIN_SEED_NAME || 'Unimate Admin';

async function seedAdmin() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const existingUser = await User.findOne({ email: adminEmail }).select('+passwordHash');

  if (existingUser) {
    existingUser.name = adminName;
    existingUser.role = 'admin';
    existingUser.passwordHash = await bcrypt.hash(adminPassword, 10);
    await existingUser.save();
    console.log('Admin account updated');
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: 'admin',
    });
    console.log('Admin account created');
  }

  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);

  await mongoose.disconnect();
}

seedAdmin().catch((error) => {
  console.error('Failed to seed admin:', error);
  process.exit(1);
});
