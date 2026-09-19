import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  if (!request.cookies.get('kio_feed_seed')) {
    const seed = Math.floor(Math.random() * 2147483647) + 1;
    response.cookies.set('kio_feed_seed', String(seed), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    });
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
