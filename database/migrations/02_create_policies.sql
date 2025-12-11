-- Enable Row Level Security (RLS) on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for attendance_records table
CREATE POLICY "Users can view own attendance" ON attendance_records
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins and Superadmins can view all attendance" ON attendance_records
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'admin' OR role = 'superadmin')
    )
  );

CREATE POLICY "Users can insert attendance records" ON attendance_records
  FOR INSERT TO authenticated
  WITH CHECK (true); -- Allow all authenticated users to insert

CREATE POLICY "Admins and Superadmins can update all attendance" ON attendance_records
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'admin' OR role = 'superadmin')
    )
  );