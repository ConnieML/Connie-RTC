import { withAuth } from 'next-auth/middleware';

const ADMIN_PAGES = ['/queues-stats', '/admin-settings'];
export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // if (ADMIN_PAGES.includes(req.nextUrl.pathname)) {
        //   return token?.userType === 'admin';
        // }

        return token !== null;
      },
    },
    pages: {
      signIn: '/',
    },
  }
);

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/call', '/admin-settings', '/queues-stats'],
};
