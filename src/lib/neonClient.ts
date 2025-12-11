import { neon } from '@neondatabase/serverless';

// Function that returns a configured Neon client when called
const createNeonClient = () => {
  // Use DATABASE_URL or fallback to POSTGRES_URL (for Neon deployments)
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    console.warn('DATABASE_URL or POSTGRES_URL environment variable is not set');
    return null;
  }

  try {
    return neon(connectionString);
  } catch (error) {
    console.error('Error initializing Neon client:', error);
    return null;
  }
};

// Export the function that creates the client
export default createNeonClient;