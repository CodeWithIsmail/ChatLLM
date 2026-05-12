import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // Check if the request is for auth pages
  if (pathname.startsWith('/auth')) {
    return NextResponse.next()
  }

  // Check if the request is for API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Check if the request is for static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/public')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
