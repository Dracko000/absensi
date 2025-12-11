'use server';

import { neon } from '@neondatabase/serverless';

export async function getData() {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`SELECT NOW() as now`;
  return data;
}

// Generic query function to execute any SQL query
export async function executeQuery(query: string, params?: any[]) {
  const sql = neon(process.env.DATABASE_URL!);
  return await sql(query, params);
}

// Specific query functions for the attendance system
export async function getUserByEmail(email: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`SELECT id, email, password, namaLengkap, nomorInduk, role, createdAt, updatedAt FROM users WHERE email = ${email}`;
  return result.length > 0 ? result[0] : null;
}

export async function getUserByNomorInduk(nomorInduk: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`SELECT id, email, password, namaLengkap, nomorInduk, role, createdAt, updatedAt FROM users WHERE nomorInduk = ${nomorInduk}`;
  return result.length > 0 ? result[0] : null;
}

export async function insertUser(email: string, hashedPassword: string, namaLengkap: string, nomorInduk: string, role: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`INSERT INTO users (email, password, namaLengkap, nomorInduk, role) VALUES (${email}, ${hashedPassword}, ${namaLengkap}, ${nomorInduk}, ${role}) RETURNING *`;
  return result[0];
}

export async function insertAttendanceRecord(userId: string, tanggal: Date, jamMasuk: Date | null, jenisAbsensi: string, barcode: string | null, keterangan: string | null) {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`INSERT INTO attendance_records (userId, tanggal, jamMasuk, jenisAbsensi, barcode, keterangan) VALUES (${userId}, ${tanggal}, ${jamMasuk}, ${jenisAbsensi}, ${barcode}, ${keterangan}) RETURNING *`;
  return result[0];
}

export async function getAttendanceRecords(userId: string | null = null, filterTanggal: string | null = null, filterJenis: string | null = null) {
  const sql = neon(process.env.DATABASE_URL!);
  
  let query;
  if (userId) {
    if (filterTanggal) {
      query = await sql`SELECT ar.*, u.namaLengkap, u.nomorInduk, u.role
                        FROM attendance_records ar
                        JOIN users u ON ar.userId = u.id
                        WHERE ar.userId = ${userId} AND ar.tanggal::date = ${filterTanggal}::date
                        ORDER BY ar.tanggal DESC`;
    } else {
      query = await sql`SELECT ar.*, u.namaLengkap, u.nomorInduk, u.role
                        FROM attendance_records ar
                        JOIN users u ON ar.userId = u.id
                        WHERE ar.userId = ${userId}
                        ORDER BY ar.tanggal DESC`;
    }
  } else {
    if (filterTanggal && filterJenis) {
      query = await sql`SELECT ar.*, u.namaLengkap, u.nomorInduk, u.role
                        FROM attendance_records ar
                        JOIN users u ON ar.userId = u.id
                        WHERE ar.jenisAbsensi = ${filterJenis} AND ar.tanggal::date = ${filterTanggal}::date
                        ORDER BY ar.tanggal DESC`;
    } else if (filterTanggal) {
      query = await sql`SELECT ar.*, u.namaLengkap, u.nomorInduk, u.role
                        FROM attendance_records ar
                        JOIN users u ON ar.userId = u.id
                        WHERE ar.tanggal::date = ${filterTanggal}::date
                        ORDER BY ar.tanggal DESC`;
    } else if (filterJenis) {
      query = await sql`SELECT ar.*, u.namaLengkap, u.nomorInduk, u.role
                        FROM attendance_records ar
                        JOIN users u ON ar.userId = u.id
                        WHERE ar.jenisAbsensi = ${filterJenis}
                        ORDER BY ar.tanggal DESC`;
    } else {
      query = await sql`SELECT ar.*, u.namaLengkap, u.nomorInduk, u.role
                        FROM attendance_records ar
                        JOIN users u ON ar.userId = u.id
                        ORDER BY ar.tanggal DESC`;
    }
  }
  
  return query;
}

export async function getUsersByRole(role: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`SELECT id, email, namaLengkap, nomorInduk, role, createdAt, updatedAt FROM users WHERE role = ${role}`;
  return result;
}

// Function to initialize database tables (to be run separately)
export async function initializeDatabase() {
  const sql = neon(process.env.DATABASE_URL!);
  
  // Create users table
  await sql`CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, namaLengkap VARCHAR(255) NOT NULL, nomorInduk VARCHAR(255) UNIQUE NOT NULL, role VARCHAR(20) NOT NULL, createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW())`;

  // Add role constraint (try to add, ignore if already exists)
  try {
    await sql`ALTER TABLE users ADD CONSTRAINT valid_role CHECK (role IN ('superadmin', 'admin', 'user'))`;
  } catch (e) {
    // Constraint might already exist, which is fine
  }

  // Create attendance_records table
  await sql`CREATE TABLE IF NOT EXISTS attendance_records (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), userId UUID NOT NULL, tanggal TIMESTAMP WITH TIME ZONE NOT NULL, jamMasuk TIMESTAMP WITH TIME ZONE, jamKeluar TIMESTAMP WITH TIME ZONE, jenisAbsensi VARCHAR(20) NOT NULL, barcode VARCHAR(255), keterangan TEXT, createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(), FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE)`;

  // Add jenisAbsensi constraint
  try {
    await sql`ALTER TABLE attendance_records ADD CONSTRAINT valid_jenis_absensi CHECK (jenisAbsensi IN ('guru', 'murid'))`;
  } catch (e) {
    // Constraint might already exist, which is fine
  }
}