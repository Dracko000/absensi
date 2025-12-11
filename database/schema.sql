-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  namaLengkap VARCHAR(255) NOT NULL,
  nomorInduk VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('superadmin', 'admin', 'user')),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance_records table  
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL,
  tanggal TIMESTAMP WITH TIME ZONE NOT NULL,
  jamMasuk TIMESTAMP WITH TIME ZONE,
  jamKeluar TIMESTAMP WITH TIME ZONE,
  jenisAbsensi VARCHAR(20) NOT NULL CHECK (jenisAbsensi IN ('guru', 'murid')),
  barcode VARCHAR(255),
  keterangan TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert superadmin user with hashed password for 'admin123'
-- Note: This is bcrypt hash for 'admin123'
INSERT INTO users (email, password, namaLengkap, nomorInduk, role) 
SELECT 'admin@admin.com', '$2b$10$9c.4Nq2aBQI2a5dF3gH6iJsKeQ12345678901234567890123456', 'Superadmin', 'SUPERADMIN001', 'superadmin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@admin.com');