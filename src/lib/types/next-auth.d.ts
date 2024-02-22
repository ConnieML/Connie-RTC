// Import needed to extend, not overwrite, the existing types
// eslint-disable-next-line
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    accessToken: string;
    idToken: string;
    oktaId: string;
    userType: string;
    employeeNumber: string;
    groups: string[];
    user: {
      email: string;
      name: string;
    };
  }
}
