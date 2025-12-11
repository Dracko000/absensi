import getNeonClient from './src/lib/neonClient';

async function testConnection() {
  console.log('Testing Neon database connection...');

  try {
    // Get the Neon client
    const sql = getNeonClient();
    if (!sql) {
      console.error('Failed to get Neon client - may be running during build time or no connection string set');
      return;
    }

    console.log('Neon client created successfully');

    // Test basic connection by getting the current timestamp
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✓ Connection successful!');
    console.log('Current time from database:', result[0].current_time);

    // Test if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (table_name = 'users' OR table_name = 'attendance_records')
    `;
    
    console.log('Tables found:', tables.map((t: any) => t.table_name));

    if (tables.some((t: any) => t.table_name === 'users')) {
      const userCountResult = await sql`SELECT COUNT(*) as count FROM users`;
      console.log('✓ Users table exists with', userCountResult[0].count, 'records');
    } else {
      console.log('⚠ Users table does not exist yet');
    }

    if (tables.some((t: any) => t.table_name === 'attendance_records')) {
      const attendanceCountResult = await sql`SELECT COUNT(*) as count FROM attendance_records`;
      console.log('✓ Attendance records table exists with', attendanceCountResult[0].count, 'records');
    } else {
      console.log('⚠ Attendance records table does not exist yet');
    }

    // Try to find the superadmin user
    try {
      const superadminResult = await sql`SELECT id, email, namaLengkap, role FROM users WHERE email = 'admin@admin.com'`;
      if (superadminResult && superadminResult.length > 0) {
        console.log('✓ Superadmin user found:', {
          id: superadminResult[0].id,
          email: superadminResult[0].email,
          name: superadminResult[0].namaLengkap,
          role: superadminResult[0].role
        });
      } else {
        console.log('⚠ Superadmin user (admin@admin.com) not found in database');
      }
    } catch (userError: any) {
      console.log('⚠ Could not query users table:', userError.message);
    }

    console.log('\n🎉 Database connection test completed successfully!');
    console.log('The application is properly configured to use Neon Serverless.');
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    
    // If it's a connection error, provide troubleshooting tips
    if (error.message.includes('connection') || error.message.includes('database')) {
      console.log('\nTroubleshooting tips:');
      console.log('1. Verify your DATABASE_URL or POSTGRES_URL is correctly set');
      console.log('2. Check that your Neon database is active and accessible');
      console.log('3. Ensure your IP is whitelisted in Neon console if required');
      console.log('4. Confirm the database schema has been created');
    }
  }
}

// Run the test
testConnection();