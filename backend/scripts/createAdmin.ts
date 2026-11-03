import bcrypt from 'bcryptjs';

import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import User from '../src/models/User.js';

const createAdmin = async () => {
  await connectDatabase();

  const existing = await User.findOne({ email: 'admin@chandantransport.in' });
  if (existing) {
    console.log('Admin user already exists');
    await disconnectDatabase();
    return;
  }

  const passwordHash = await bcrypt.hash('Admin@123', 10);
  await User.create({
    name: 'Chandan Admin',
    email: 'admin@chandantransport.in',
    phone: '+919876543210',
    passwordHash,
    role: 'admin',
    status: 'active',
  });

  console.log('Admin created: admin@chandantransport.in / Admin@123');
  await disconnectDatabase();
};

createAdmin().catch((error) => {
  console.error('Admin creation failed:', error);
  process.exit(1);
});
