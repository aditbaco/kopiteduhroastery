// Next Imports
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Auth Imports
import { ADMIN_SESSION_COOKIE } from '@/libs/admin/auth/config'
import { verifySessionValue } from '@/libs/admin/auth/session'

// Next 16 renamed middleware.ts to proxy.ts. The rename matters here: proxy
// always runs on the Node runtime (edge is not supported and cannot be
// configured), which is what lets the session module use node:crypto.

export const proxy = (request: NextRequest) => {
  const isSignedIn = verifySessionValue(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)
  const { pathname } = request.nextUrl

  if (pathname === '/login') {
    return isSignedIn ? NextResponse.redirect(new URL('/admin/products', request.url)) : NextResponse.next()
  }

  if (!isSignedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// An explicit allow-list, not a catch-all. The storefront (/[lang]/**) must
// never hit this — it is statically prerendered and has no business paying for
// a session check on every request.
export const config = {
  matcher: ['/admin/:path*', '/home', '/login']
}
