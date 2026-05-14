import { NextRequest, NextResponse } from 'next/server'

const PROTECTED = '/admin'
const LOGIN     = '/admin/login'
const COOKIE    = 'pw_admin'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith(PROTECTED)) return NextResponse.next()
  if (pathname === LOGIN)              return NextResponse.next()

  const token = request.cookies.get(COOKIE)?.value
  const expected = process.env.ADMIN_TOKEN

  if (!expected || token === expected) return NextResponse.next()

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = LOGIN
  loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = { matcher: ['/admin', '/admin/:path*'] }
