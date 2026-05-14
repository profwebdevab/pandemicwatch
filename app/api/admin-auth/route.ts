import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json() as { password: string }
  const expected = process.env.ADMIN_TOKEN

  if (!expected || password !== expected) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  const from = new URL(request.url).searchParams.get('from') || '/admin'
  const res = NextResponse.redirect(new URL(from, request.url))

  res.cookies.set('pw_admin', expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return res
}

export async function DELETE(request: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin/login', request.url))
  res.cookies.delete('pw_admin')
  return res
}
