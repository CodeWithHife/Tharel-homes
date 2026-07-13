import { NextResponse } from 'next/server';

// Routes that require authentication
const PROTECTED = ['/dashboard'];
// Routes that should redirect to dashboard if already logged in
const AUTH_ROUTES = ['/login', '/signup'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check for auth token in cookies (we'll also accept from local storage via client-side guards)
  // The main protection here is via the token cookie if set, or we rely on client-side auth.js
  // Since we use localStorage (not cookies), this middleware only does basic path matching.
  // Full auth enforcement is handled client-side in each dashboard page's useEffect.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding', '/login', '/signup'],
};
