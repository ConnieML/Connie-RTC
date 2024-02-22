// Import needed to extend, not overwrite, the existing types
// eslint-disable-next-line
import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string;
    idToken: string;
    oktaId: string;
    userType: string;
    employeeNumber: string;
    groups: string[];
  }
}
