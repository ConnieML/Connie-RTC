import { NextApiRequest, NextApiResponse } from 'next';
import AccessToken, {
  TaskRouterGrant,
  VoiceGrant,
} from 'twilio/lib/jwt/AccessToken';

const account_sid = process.env.TWILIO_ACCOUNT_SID;
const application_sid = process.env.TWILIO_TWIML_APP_SID;
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Generate a random user name and store it
  const { client } = req.query as {
    client: string;
  };

  // Create access token with credentials
  const token = new AccessToken(account_sid!, api_key!, api_secret!, {
    identity: client,
  });

  const taskRouterGrant = new TaskRouterGrant({
    workerSid: 'WKe2c27ece00f527bd82b116809b487de9',
    workspaceSid: process.env.TWILIO_TASKROUTER_WORKSPACE_SID,
    role: 'worker',
  });

  token.addGrant(taskRouterGrant);
  token.identity = client;

  // Return token info as JSON

  res.json(token.toJwt());
}
