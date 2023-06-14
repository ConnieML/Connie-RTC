import "next-auth/jwt"
import NextAuth from "next-auth"

declare module "next-auth" { 
  interface Session {
    user: {
      id: string
      role: string
    }
  }
}

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's role. */
    idToken?: string
  }
}
