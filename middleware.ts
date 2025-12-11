import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwtAuth';
import { UserRole, requireAuth } from '@/lib/authUtils';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/about',
  '/api/auth', // If you have authentication APIs
];

// Define protected routes that require specific roles
const protectedRouteRoles: { [key: string]: UserRole[] } = {
  '/dashboard': ['superadmin', 'admin', 'user'],
  '/dashboard-superadmin': ['superadmin'],
  '/dashboard-guru': ['admin'],
  '/dashboard-murid': ['user'],
  '/absensi-guru': ['superadmin'],
  '/absensi-murid': ['admin'],
  '/manajemen-guru': ['superadmin'],
  '/manajemen-murid': ['superadmin'],
  '/riwayat-absensi': ['admin', 'superadmin'],
  '/riwayat-kehadiran': ['user'],
  '/laporan': ['superadmin'],
  '/laporan-harian': ['admin'],
};

export async function middleware(request: NextRequest) {
  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith(route + '/')
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if route requires specific roles
  const matchedProtectedRoute = Object.keys(protectedRouteRoles).find(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith(route + '/')
  );

  if (matchedProtectedRoute) {
    // Get token from cookies or headers
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify token
    const user = verifyToken(token);
    if (!user) {
      // Redirect to login if invalid token
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user has required role for this route
    const requiredRoles = protectedRouteRoles[matchedProtectedRoute];
    if (requiredRoles && !requiredRoles.includes(user.role as UserRole)) {
      // Redirect to appropriate dashboard based on user role
      let redirectUrl = '/login';
      switch (user.role) {
        case 'superadmin':
          redirectUrl = '/dashboard-superadmin';
          break;
        case 'admin':
          redirectUrl = '/dashboard-guru';
          break;
        case 'user':
          redirectUrl = '/dashboard-murid';
          break;
      }
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Continue to the requested page
  return NextResponse.next();
}

// Define which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}