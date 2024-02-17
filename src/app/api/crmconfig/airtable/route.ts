import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { putObject, getObject } from '../../../../lib/aws/s3';
// import { authOptions } from '../../../../pages/api/auth/[...nextauth]';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

type AirtableTokenData = {
  token: string;
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions) as any;
  
  
  const res = NextResponse.next();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const oktaId  = session.oktaId;
  const body = await req.json() as AirtableTokenData;
  const token = body.token;

  try {
    const key = `crm_airtable:${oktaId}`;
    await putObject(key, token);
    // sanity check to ensure it stored
    const storedToken = await getObject(key);
    console.log("Stored token: ", storedToken);
    return new Response('Success', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Put in S3 unsuccessful: ' + error, { status: 500 });
  }
};