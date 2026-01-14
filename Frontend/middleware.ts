import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/Forget_pass',
  '/set-password',
  '/otp_check',
  '/set_pass',
  '/create-user',
];

// Define role-based route access
const roleRoutes = {
  '/superAdmin': ['SUPER_ADMIN'],
  '/admin': ['SUPER_ADMIN', 'ADMIN'],
  '/manager': ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
  '/user': ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE'],
  '/enhanced-tms': ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('🔍 [Middleware] Request:', pathname);

  // Allow root path
  if (pathname === '/') {
    console.log('✅ [Middleware] Root path allowed');
    return NextResponse.next();
  }

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    console.log('✅ [Middleware] Public route allowed:', pathname);
    return NextResponse.next();
  }

  // Allow static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Get token from cookie or header
  const tokenFromCookie = request.cookies.get('token')?.value;
  const tokenFromHeader = request.headers.get('authorization')?.replace('Bearer ', '');
  const token = tokenFromCookie || tokenFromHeader;
  
  console.log('🔑 [Middleware] Token check:', {
    pathname,
    hasTokenInCookie: !!tokenFromCookie,
    hasTokenInHeader: !!tokenFromHeader,
    tokenLength: token?.length || 0
  });

  // If no token in cookie, allow the request to proceed
  // The client-side AuthContext will handle authentication from localStorage
  if (!token) {
    console.log('⚠️ [Middleware] No token in cookie, allowing request (client-side auth will handle)');
    return NextResponse.next();
  }

  // If we have a token, validate it and check role-based access
  try {
    // Parse JWT payload (without verification - this is just for routing)
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    
    const userRole = payload.role;
    console.log('✅ [Middleware] Token valid, user role:', userRole);

    // Check role-based access
    for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          // Redirect to appropriate dashboard based on role
          const roleRedirects: Record<string, string> = {
            SUPER_ADMIN: '/superAdmin',
            ADMIN: '/admin',
            MANAGER: '/manager',
            EMPLOYEE: '/user',
          };
          
          const redirectPath = roleRedirects[userRole] || '/login';
          console.log(`[Middleware] Redirecting ${userRole} from ${pathname} to ${redirectPath}`);
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      }
    }
  } catch (error) {
    // If token is invalid, allow the request to proceed
    // The client-side AuthContext will handle authentication
    console.error('[Middleware] Token parsing error, allowing request (client-side auth will handle):', error);
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
