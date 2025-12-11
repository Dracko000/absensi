import { neon } from '@neondatabase/serverless';

// Function that returns a configured Neon client when called
const createNeonClient = () => {
  // Skip during build time or if no window (SSR)
  if (typeof window !== 'undefined') {
    return null;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.warn('DATABASE_URL environment variable is not set');
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