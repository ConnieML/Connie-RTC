import { type NextRequest } from 'next/server';
import AccessToken, { VoiceGrant } from 'twilio/lib/jwt/AccessToken';

const account_sid = process.env.TWILIO_ACCOUNT_SID;
const application_sid = process.env.TWILIO_TWIML_APP_SID;
const api_key = process.env.TWILIO_API_KEY;
const api_secret = process.env.TWILIO_API_SECRET;

export async function GET(req: NextRequest) {
  // Generate a random user name and store it
  const searchParams = req.nextUrl.searchParams;
  const client: string = searchParams.get('client') ?? '';

  // Create access token with credentials
  const token = new AccessToken(account_sid!, api_key!, api_secret!, {
    identity: client,
  });

  // Create a Voice grant and add it to the token
  const voice_grant = new VoiceGrant({
    outgoingApplicationSid: application_sid,
    incomingAllow: true,
  });
  token.addGrant(voice_grant);

  // Return token info as JSON
  const tokenResponse = {
    identity: client,
    token: token.toJwt(),
  };

  return Response.json(tokenResponse);
}
