import { neon } from '@neondatabase/serverless';

// Initialize the Neon serverless client
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(connectionString);

export default sql;