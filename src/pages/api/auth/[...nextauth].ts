import NextAuth from 'next-auth';
import OktaProvider from 'next-auth/providers/okta';

export const authOptions = {
  providers: [
    OktaProvider({
      clientId: process.env.OKTA_OAUTH2_CLIENT_ID as string,
      clientSecret: process.env.OKTA_OAUTH2_CLIENT_SECRET as string,
      issuer: process.env.OKTA_OAUTH2_ISSUER as string,
    }),
  ],
  secret: process.env.SECRET as string,
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.oktaId = account.providerAccountId;
      }

      // Decrypting JWT to check if expired
      var tokenParsed = JSON.parse(
        Buffer.from(token.idToken.split('.')[1], 'base64').toString()
      );
      const dateNowInSeconds = new Date().getTime() / 1000;
      if (dateNowInSeconds > tokenParsed.exp) {
        throw Error('expired token');
      }
      token.userType = tokenParsed.userType;
      token.employeeNumber = tokenParsed.employeeNumber;
      return token;
    },
    async session({ session, token }: any) {
      session.userType = token.userType;
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.oktaId = token.oktaId;
      session.userType = token.userType;
      session.employeeNumber = token.employeeNumber;
      return session;
    },
  },
};

export default NextAuth(authOptions);
