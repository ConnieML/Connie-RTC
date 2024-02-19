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
                console.log("we is here");
                token.accessToken = account.access_token;
                token.idToken = account.id_token;
                token.oktaId = account.providerAccountId;
                token.groups = account.groups;
                token.employeeNumber = account.employeeNumber;
            }
            
            // Decrypting JWT to check if expired
            var tokenParsed = JSON.parse(
                Buffer.from(token.idToken.split('.')[1], 'base64').toString()
            );
            const dateNowInSeconds = new Date().getTime() / 1000;
            if (dateNowInSeconds > tokenParsed.exp) {
                throw Error('expired token');
            }

            // Request token from Okta API to get user's employeeNumber
            if (!token.employeeNumber) {
                const response = await fetch(`${process.env.OKTA_OAUTH2_ISSUER}/api/v1/users/${tokenParsed.sub}`, {
                    headers: {
                        'Authorization': `SSWS ${process.env.OKTA_API_KEY}`
                    }
                });
                const userData = await response.json();
                token.employeeNumber = userData.profile.employeeNumber;
            }

            // If employeeNumber is still not found, create a new Twilio worker and assign ID
            if (!token.employeeNumber) {
                console.log("TIME TO UPDATE")
                const accountSid = process.env.TWILIO_ACCOUNT_SID;
                const authToken = process.env.TWILIO_AUTH_TOKEN;
                const client = require('twilio')(accountSid, authToken);

                client.taskrouter.v1.workspaces(process.env.TWILIO_WORKSPACE_SID)
                                    .workers
                                    .create({friendlyName:  tokenParsed.email})
                                    .then(async (worker: { sid: any; }) => {
                                        token.employeeNumber = worker.sid;
                                        const profile = {'profile':{"employeeNumber": worker.sid}};
                                
                                        const response = await fetch(`${process.env.OKTA_OAUTH2_ISSUER}/api/v1/users/${tokenParsed.sub}`, {
                                            method: 'POST',
                                            headers: {
                                                'Authorization': `SSWS ${process.env.OKTA_API_KEY}`,
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(profile)
                                        });
                                    })
            }

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