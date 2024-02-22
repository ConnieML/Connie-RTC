import { NextRequest, NextResponse } from 'next/server';
import AccessToken, { TaskRouterGrant } from 'twilio/lib/jwt/AccessToken';

const account_sid = process.env.TWILIO_ACCOUNT_SID;
const api_key = process.env.TWILIO_API_KEY;
const api_secret = process.env.TWILIO_API_SECRET;

export async function GET(req: NextRequest) {

  const workerSid = req.nextUrl.searchParams.get('workerSid')!;
  const email= req.nextUrl.searchParams.get('email')!;


  // Create access token with credentials
  const token = new AccessToken(account_sid!, api_key!, api_secret!, {
    identity: email,
  });

  const taskRouterGrant = new TaskRouterGrant({
    workerSid: workerSid,
    workspaceSid: process.env.TWILIO_WORKSPACE_SID,
    role: 'worker',
  });

  token.addGrant(taskRouterGrant);
  token.identity = email;

  // Return token info as JSON
  return NextResponse.json(token.toJwt());
}