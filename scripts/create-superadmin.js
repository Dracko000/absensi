const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

async function createSuperadminUser() {
  console.log('Creating superadmin user...');

  // Get the database URL
  const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  if (!DATABASE_URL) {
    console.error('DATABASE_URL or POSTGRES_URL environment variable is not set');
    return;
  }

  try {
    // Create database connection
    const sql = neon(DATABASE_URL);

    // Create the users table if it doesn't exist
    await sql`CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, namaLengkap VARCHAR(255) NOT NULL, nomorInduk VARCHAR(255) UNIQUE NOT NULL, role VARCHAR(20) NOT NULL, createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW())`;

    console.log('✓ Users table created or already exists');

    // Create the attendance_records table if it doesn't exist
    await sql`CREATE TABLE IF NOT EXISTS attendance_records (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), userId UUID NOT NULL, tanggal TIMESTAMP WITH TIME ZONE NOT NULL, jamMasuk TIMESTAMP WITH TIME ZONE, jamKeluar TIMESTAMP WITH TIME ZONE, jenisAbsensi VARCHAR(20) NOT NULL, barcode VARCHAR(255), keterangan TEXT, createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(), FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE)`;

    // Add constraints to ensure valid roles
    try {
      await sql`ALTER TABLE users ADD CONSTRAINT valid_role CHECK (role IN ('superadmin', 'admin', 'user'))`;
    } catch (constraintError) {
      // Constraint might already exist, which is fine
      console.log('Role constraint already exists or error adding it (this is OK)');
    }

    try {
      await sql`ALTER TABLE attendance_records ADD CONSTRAINT valid_jenis_absensi CHECK (jenisAbsensi IN ('guru', 'murid'))`;
    } catch (constraintError) {
      // Constraint might already exist, which is fine
      console.log('Jenis absensi constraint already exists or error adding it (this is OK)');
    }
    
    console.log('✓ Attendance records table created or already exists');

    // Hash the password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✓ Password hashed successfully');

    // Check if superadmin user already exists
    const existingUserResult = await sql`SELECT * FROM users WHERE email = 'admin@admin.com'`;

    if (existingUserResult && existingUserResult.length > 0) {
      console.log('⚠ Superadmin user already exists');
      return;
    }

    // Insert the superadmin user
    await sql`INSERT INTO users (email, password, namaLengkap, nomorInduk, role) VALUES ('admin@admin.com', ${hashedPassword}, 'Superadmin', 'SUPERADMIN001', 'superadmin')`;
    
    console.log('✓ Superadmin user created successfully!');
    console.log('Email: admin@admin.com');
    console.log('Password: admin123');
    console.log('Role: superadmin');
    
  } catch (error) {
    console.error('❌ Error creating superadmin user:', error.message);
  }
}

// Run the function
createSuperadminUser();