import 'next-auth/jwt';
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      email: string;
      id: string;
      name: string;
    };
    idToken: string;
    oktaId: string;
    accessToken: string;
    userType: string;
    employeeNumber: string;
  }
}

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module 'next-auth/jwt' {
  interface JWT {
    /** The user's role. */
    idToken?: string;
  }
}
