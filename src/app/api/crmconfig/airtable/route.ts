import { getServerSession } from 'next-auth/next';
import { NextRequest } from 'next/server';

import { authOptions } from '@/lib/auth';
import { putObject } from '@/lib/aws/s3';
import {
  s3KeyForAirtableBase,
  s3KeyForAirtableTable,
  s3KeyForAirtableToken,
} from '@/lib/crm/airtable';

type AirtableTokenData = {
  token: string;
  baseId: string;
  tableId: string;
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const oktaId = session.oktaId;
  const body = (await req.json()) as AirtableTokenData;
  const token = body.token;
  const baseId = body.baseId;
  const tableId = body.tableId;

  try {
    const tokenKey = s3KeyForAirtableToken(oktaId);
    const baseIdKey = s3KeyForAirtableBase(oktaId);
    const tableIdKey = s3KeyForAirtableTable(oktaId);

    await Promise.all([
      putObject(tokenKey, token),
      putObject(baseIdKey, baseId),
      putObject(tableIdKey, tableId),
    ]);

    return new Response('Success', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Put in S3 unsuccessful: ' + error, {
      status: 500,
    });
  }
}
