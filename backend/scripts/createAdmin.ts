import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db';
import { Admin } from '../models/Admin';
import { Repository } from '../config/store';

dotenv.config();

const createAdminAccount = async () => {
  console.log('--- Initializing Admin Account Creation ---');

  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || '';

  if (!email || !password) {
    console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be configured in your .env file or environment variables.');
    process.exit(1);
  }

  // Attempt DB connection
  await connectDB();

  try {
    const existingAdmin = await Repository.findAdminByEmail(email);

    if (existingAdmin) {
      console.log(`ℹ️ Admin account with email "${email}" already exists.`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Repository.createAdmin(email, hashedPassword);

    console.log('========================================================');
    console.log('✅ Admin account successfully created!');
    console.log(`📧 Email: ${email}`);
    console.log('🔒 Password securely hashed with bcrypt and configured.');
    console.log('========================================================');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Failed to create admin account:', error.message);
    process.exit(1);
  }
};

createAdminAccount();
