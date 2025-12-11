-- Create user roles enum
CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'user');

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nama_lengkap VARCHAR(255) NOT NULL,
  nomor_induk VARCHAR(50) UNIQUE,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance_types enum
CREATE TYPE attendance_type AS ENUM ('guru', 'murid');

-- Create attendance_records table
CREATE TABLE attendance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  jam_masuk TIME,
  jam_keluar TIME,
  jenis_absensi attendance_type NOT NULL, -- 'guru' for teacher attendance, 'murid' for student attendance
  barcode TEXT,
  keterangan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_attendance_records_user_id ON attendance_records(user_id);
CREATE INDEX idx_attendance_records_tanggal ON attendance_records(tanggal);
CREATE INDEX idx_attendance_records_jenis_absensi ON attendance_records(jenis_absensi);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert superadmin user (kepala sekolah)
INSERT INTO users (email, password_hash, nama_lengkap, nomor_induk, role) 
VALUES ('kepalasekolah@example.com', '$2a$10$8K1p/aWxzfL1sVXgC9Uzu.ETaS.zTw5i90NRKrhYQZp3PB6.yQz0K', 'Kepala Sekolah', 'KS001', 'superadmin');

-- Insert admin user (guru)
INSERT INTO users (email, password_hash, nama_lengkap, nomor_induk, role) 
VALUES ('guru@example.com', '$2a$10$8K1p/aWxzfL1sVXgC9Uzu.ETaS.zTw5i90NRKrhYQZp3PB6.yQz0K', 'Guru Pengajar', 'GR001', 'admin');

-- Insert regular user (murid)
INSERT INTO users (email, password_hash, nama_lengkap, nomor_induk, role) 
VALUES ('murid@example.com', '$2a$10$8K1p/aWxzfL1sVXgC9Uzu.ETaS.zTw5i90NRKrhYQZp3PB6.yQz0K', 'Murid Teladan', 'MR001', 'user');