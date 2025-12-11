-- Database Schema for School Attendance System
-- This file contains all necessary tables and initial data for the system

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    namaLengkap VARCHAR(255) NOT NULL,
    nomorInduk VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add role constraint to ensure valid roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_role') THEN
        ALTER TABLE users ADD CONSTRAINT valid_role CHECK (role IN ('superadmin', 'admin', 'user'));
    END IF;
END
$$;

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID NOT NULL,
    tanggal TIMESTAMP WITH TIME ZONE NOT NULL,
    jamMasuk TIMESTAMP WITH TIME ZONE,
    jamKeluar TIMESTAMP WITH TIME ZONE,
    jenisAbsensi VARCHAR(20) NOT NULL,
    barcode VARCHAR(255),
    keterangan TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Add jenisAbsensi constraint to ensure valid attendance types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_jenis_absensi') THEN
        ALTER TABLE attendance_records ADD CONSTRAINT valid_jenis_absensi CHECK (jenisAbsensi IN ('guru', 'murid'));
    END IF;
END
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_nomorInduk ON users(nomorInduk);
CREATE INDEX IF NOT EXISTS idx_attendance_userId ON attendance_records(userId);
CREATE INDEX IF NOT EXISTS idx_attendance_tanggal ON attendance_records(tanggal);
CREATE INDEX IF NOT EXISTS idx_attendance_jenis ON attendance_records(jenisAbsensi);

-- Insert the superadmin user with bcrypt hash for 'admin123'
-- The bcrypt hash for 'admin123' is: $2b$10$EpQZFlS/N6zGXa0AgQf47O.bU4OXhHEHYqYh0.pIaL0Yv9o6XN6I2
INSERT INTO users (email, password, namaLengkap, nomorInduk, role)
VALUES (
    'admin@admin.com',
    '$2b$10$EpQZFlS/N6zGXa0AgQf47O.bU4OXhHEHYqYh0.pIaL0Yv9o6XN6I2',  -- bcrypt hash of 'admin123'
    'Superadmin',
    'SUPERADMIN001',
    'superadmin'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password, namaLengkap, nomorInduk, role)
VALUES (
    'guru@example.com',
    '$2b$10$EpQZFlS/N6zGXa0AgQf47O.bU4OXhHEHYqYh0.pIaL0Yv9o6XN6I2',  -- bcrypt hash of 'admin123'
    'Contoh Guru',
    'GURU001',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password, namaLengkap, nomorInduk, role)
VALUES (
    'murid@example.com',
    '$2b$10$EpQZFlS/N6zGXa0AgQf47O.bU4OXhHEHYqYh0.pIaL0Yv9o6XN6I2',  -- bcrypt hash of 'admin123'
    'Contoh Murid',
    'MURID001',
    'user'
)
ON CONFLICT (email) DO NOTHING;

-- Insert some sample attendance records
INSERT INTO attendance_records (userId, tanggal, jamMasuk, jamKeluar, jenisAbsensi, barcode, keterangan)
SELECT 
    u.id,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + TIME '08:00:00',
    NOW() - INTERVAL '1 day' + TIME '15:00:00',
    'guru',
    'GURU001',
    'Hadir'
FROM users u 
WHERE u.nomorInduk = 'GURU001'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO attendance_records (userId, tanggal, jamMasuk, jamKeluar, jenisAbsensi, barcode, keterangan)
SELECT 
    u.id,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + TIME '07:30:00',
    NOW() - INTERVAL '1 day' + TIME '16:00:00',
    'murid',
    'MURID001',
    'Hadir'
FROM users u 
WHERE u.nomorInduk = 'MURID001'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Confirmation message
DO $$
BEGIN
    RAISE NOTICE 'Database schema and initial data created successfully!';
    RAISE NOTICE 'Superadmin user created: admin@admin.com / admin123';
    RAISE NOTICE 'Sample admin user created: guru@example.com / admin123';
    RAISE NOTICE 'Sample user created: murid@example.com / admin123';
END
$$;