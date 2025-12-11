import { neon } from '@neondatabase/serverless';
import { hashPassword } from '../src/lib/jwtAuth';

async function initializeDatabase() {
  console.log('Initializing database and creating superadmin user...');
  
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    console.error('DATABASE_URL or POSTGRES_URL environment variable is not set');
    return;
  }

  try {
    const sql = neon(connectionString);

    // Create users table if it doesn't exist
    await sql`CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, namaLengkap VARCHAR(255) NOT NULL, nomorInduk VARCHAR(255) UNIQUE NOT NULL, role VARCHAR(20) NOT NULL, createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW())`;

    console.log('Users table created or already exists');

    // Create attendance_records table if it doesn't exist
    await sql`CREATE TABLE IF NOT EXISTS attendance_records (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), userId UUID NOT NULL, tanggal TIMESTAMP WITH TIME ZONE NOT NULL, jamMasuk TIMESTAMP WITH TIME ZONE, jamKeluar TIMESTAMP WITH TIME ZONE, jenisAbsensi VARCHAR(20) NOT NULL, barcode VARCHAR(255), keterangan TEXT, createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(), FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE)`;

    console.log('Attendance records table created or already exists');

    // Check if the superadmin user already exists
    const existingUser = await sql`SELECT * FROM users WHERE email = 'admin@admin.com'`;

    if (existingUser && existingUser.length > 0) {
      console.log('Superadmin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword('admin123');

    // Insert the superadmin user
    await sql`INSERT INTO users (email, password, namaLengkap, nomorInduk, role) VALUES ('admin@admin.com', ${hashedPassword}, 'Superadmin', 'SUPERADMIN001', 'superadmin')`;
    
    console.log('Superadmin user created successfully!');
    console.log('Email: admin@admin.com');
    console.log('Password: admin123');
    console.log('Role: superadmin');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();