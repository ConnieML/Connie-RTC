import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { getObjectString } from '@/lib/aws/s3';
import {
  AirtableCRMProvider,
  s3KeyForAirtableBase,
  s3KeyForAirtableTable,
  s3KeyForAirtableToken,
} from '@/lib/crm/airtable';

/**
 * Handles GET requests to /api/crm_example?phone={phone_number_string}
 *
 * @param request - The incoming request object.
 * @returns A JSON response with the client info.
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const oktaId = session.oktaId;

  const [airtable_token, airtable_base_id, airtable_table_id] =
    await Promise.all([
      getObjectString(s3KeyForAirtableToken(oktaId)),
      getObjectString(s3KeyForAirtableBase(oktaId)),
      getObjectString(s3KeyForAirtableTable(oktaId)),
    ]);

  console.log(airtable_token, airtable_base_id, airtable_table_id);

  const provider = new AirtableCRMProvider(airtable_base_id, airtable_token);

  const table = provider.getTable(airtable_table_id);

  const url = new URL(request.url);
  const queryParams = new URLSearchParams(url.search);
  if (queryParams.has('phone')) {
    const phone: string = queryParams.get('phone') || '1234567890';
    // TODO: Handle phone number validation
    const clientInfo = await table.getClientByPhone(phone);
    if (!clientInfo) {
      return NextResponse.json(
        { message: 'Client not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(clientInfo, {
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  const allClients = await table.getAllRows();

  return NextResponse.json(allClients, {
    headers: {
      'content-type': 'application/json',
    },
  });
}
