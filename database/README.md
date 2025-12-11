# Database Setup

This directory contains the SQL migration files needed to set up the database schema for the attendance application.

## Setting up the database in Supabase

1. Go to your [Supabase dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to "SQL Editor"
4. Copy and paste the content from the migration files in order:
   - First, run `01_create_tables.sql`
   - Then, run `02_create_policies.sql`

Alternatively, you can use the Supabase CLI to apply migrations:

```bash
supabase db push
```

## Database Schema

### Tables

#### users
- `id`: UUID primary key
- `email`: User's email address (unique)
- `password_hash`: Hashed password
- `nama_lengkap`: Full name of the user
- `nomor_induk`: ID number (unique per user type)
- `role`: User role ('superadmin', 'admin', 'user')
- `created_at`: Timestamp when the record was created
- `updated_at`: Timestamp when the record was last updated

#### attendance_records
- `id`: UUID primary key
- `user_id`: Foreign key referencing users table
- `tanggal`: Date of attendance
- `jam_masuk`: Time of arrival (nullable)
- `jam_keluar`: Time of departure (nullable)
- `jenis_absensi`: Type of attendance ('guru' for teacher, 'murid' for student)
- `barcode`: Barcode string for identification
- `keterangan`: Additional notes (nullable)
- `created_at`: Timestamp when the record was created

### Enums

- `user_role`: Contains values 'superadmin', 'admin', 'user'
- `attendance_type`: Contains values 'guru', 'murid'