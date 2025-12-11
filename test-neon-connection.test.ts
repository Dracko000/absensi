import getNeonClient from './src/lib/neonClient';

async function testConnection() {
  try {
    console.log('Testing Neon database connection...');

    // Get the Neon client
    const sql = getNeonClient();

    // Test connection by running a simple query
    const result = await sql`SELECT NOW() as now`;

    console.log('Connection successful!');
    console.log('Current timestamp from database:', result[0].now);

    // Check if users table exists
    const tables = await sql`SELECT table_name
                             FROM information_schema.tables
                             WHERE table_schema = 'public'
                             AND table_name IN ('users', 'attendance_records')`;

    console.log('Existing tables:', tables);

    // Test the users table if it exists
    if (tables.some((t: any) => t.table_name === 'users')) {
      const userCount = await sql`SELECT COUNT(*) as count FROM users`;
      console.log('Number of users in database:', userCount[0].count);
    }

    // Test the attendance_records table if it exists
    if (tables.some((t: any) => t.table_name === 'attendance_records')) {
      const attendanceCount = await sql`SELECT COUNT(*) as count FROM attendance_records`;
      console.log('Number of attendance records in database:', attendanceCount[0].count);
    }

    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Database test failed:', error);
    process.exit(1);
  }
}

testConnection();