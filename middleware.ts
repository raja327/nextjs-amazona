import NextAuth from 'next-auth';
import authConfig from './auth.config';

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  /*
    match all request  paths expect for the ones starting with:
api(api routes)
_next/static(static files)
_next/image(image optimization files)
favicon.ico(favicon file)
    */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
