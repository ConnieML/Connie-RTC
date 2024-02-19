import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {

// extend session interface
  interface Session {
    employeeNumber: string,
    user: {
      email: string,
      name: string
    }
  }
}