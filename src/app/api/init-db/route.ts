import { NextRequest } from 'next/server';
import { initializeDatabase } from '@/actions';

export async function GET(request: NextRequest) {
  try {
    // For security, you might want to add a temporary token check
    // Remove this endpoint after initialization
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    // You can set a temporary token as environment variable
    // For initial testing, we'll allow without token, but in production,
    // you should add a secure token check
    const expectedToken = process.env.INIT_DB_TOKEN;

    // For the first run, you can temporarily allow without token
    // In production, uncomment the next lines:
    // if (!token || token !== expectedToken) {
    //   return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }

    await initializeDatabase();
    return Response.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}