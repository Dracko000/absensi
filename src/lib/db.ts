// db.ts - Safe database client wrapper for Next.js
import { neon } from '@neondatabase/serverless';

let cachedClient: any = null;

export function getDbClient() {
  // Don't create client during build time
  if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
    // Check if we have a cached client (for server runtime)
    if (cachedClient) {
      return cachedClient;
    }
  }

  // Only initialize the client if we have the environment variable
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // Return a mock client during build time or when no DB is configured
    console.warn('DATABASE_URL not set, using mock client for build time');
    return null;
  }

  try {
    cachedClient = neon(connectionString);
    return cachedClient;
  } catch (error) {
    console.error('Error initializing Neon client:', error);
    return null;
  }
}

// Wrapper function for database queries that handles errors gracefully
export async function dbQuery(query: any, params?: any) {
  const client = getDbClient();
  
  if (!client) {
    // Return mock data during build time
    console.warn('Database client not available, returning empty result');
    return [];
  }
  
  try {
    return await client(query, params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}