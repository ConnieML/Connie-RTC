import { NextAuthOptions } from 'next-auth';

import Okta from 'next-auth/providers/okta'

export const authOptions: NextAuthOptions = {
    providers: [
        Okta({
            clientId: process.env.OKTA_OAUTH2_CLIENT_ID as string,
            clientSecret: process.env.OKTA_OAUTH2_CLIENT_SECRET as string,
            issuer: process.env.OKTA_OAUTH2_ISSUER as string,
            authorization: {
                params: {scope: 'openid profile email groups' }
            }
        }),
    ],
    secret: process.env.SECRET as string,
    callbacks: {
        async jwt({ token, account }: any) {
            if (account) {
                
                token.accessToken = account.access_token;
                token.idToken = account.id_token;
                token.oktaId = account.providerAccountId;
                token.groups = account.groups;
            }
            

            // Decrypting JWT to check if expired
            var tokenParsed = JSON.parse(
                Buffer.from(token.idToken.split('.')[1], 'base64').toString()
            );
            const dateNowInSeconds = new Date().getTime() / 1000;
            if (dateNowInSeconds > tokenParsed.exp) {
                throw Error('expired token');
            }

            // Add fields to token that are useful
            token.employeeNumber = tokenParsed.employeeNumber;
            token.groups = tokenParsed.groups;

            return token;
        },
        async session({ session, token }: any) {
            session.accessToken = token.accessToken;
            session.idToken = token.idToken;
            session.oktaId = token.oktaId;
            session.userType = token.userType;
            session.employeeNumber = token.employeeNumber;
            session.groups = token.groups;

            return session;
        },
    },
};