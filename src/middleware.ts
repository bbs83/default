/* ============================================================
   Next.js Middleware
   ============================================================
   Simple middleware that just passes requests through.
   Auth protection is handled in individual pages/layouts.
   ============================================================ */

import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Just pass the request through - auth is handled in pages
  return NextResponse.next();
}

// Run middleware on all pages except static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
