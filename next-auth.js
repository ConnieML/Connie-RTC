import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const options = {
  providers: [
    Providers.Credentials({
      name: 'Twilio',
      credentials: {
        phone: {
          label: 'Phone Number',
          type: 'text',
        },
        verificationCode: {
          label: 'Verification Code',
          type: 'text',
        },
      },
      authorize: async (credentials) => {
        try {
          const verificationCheck = await client.verify.services(process.env.TWILIO_SERVICE_SID)
            .verificationChecks.create({
              to: credentials.phone,
              code: credentials.verificationCode,
            });

          if (verificationCheck.status === 'approved') {
            return Promise.resolve({ id: credentials.phone, name: credentials.phone, email: null });
          } else {
            return Promise.resolve(null);
          }
        } catch (error) {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  // Add any additional options
  // ...
};

export default (req, res) => NextAuth(req, res, options);