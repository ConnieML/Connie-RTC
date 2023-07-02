import type { NextApiRequest, NextApiResponse } from 'next'
import { jwt } from 'twilio'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  if (method === 'GET') {
    const accessToken = await generateToken();
    res.status(200).json({ accessToken });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

async function generateToken(): Promise<string> {
  const AccessToken = jwt.AccessToken;
  const SyncGrant = AccessToken.SyncGrant;

  const syncGrant = new SyncGrant({
    serviceSid: process.env.TWILIO_SYNC_SERVICE_SID,
  });

  const accessToken = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_API_KEY!,
    process.env.TWILIO_API_SECRET!,
    { identity: 'user' } // used specifically for creating Sync tokens
  );
  accessToken.addGrant(syncGrant);

  return accessToken.toJwt();
}