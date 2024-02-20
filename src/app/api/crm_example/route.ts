import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getObjectString } from '@/lib/aws/s3';
import {
  AirtableCRMProvider,
  s3KeyForAirtableBase,
  s3KeyForAirtableTable,
  s3KeyForAirtableToken,
} from '@/lib/crm/airtable';

// ENV variables for now, pending CRM configuration feature

/**
 * GET /api/crm_example?phone={phone_number_string}
 *
 * @param request - The incoming request object.
 * @returns A JSON response with the client info.
 */
export async function GET() {
  const session = (await getServerSession(authOptions));
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
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

  // TODO: Implement
  // const url = new URL(request.url);
  // const queryParams = new URLSearchParams(url.search);
  // const phone: string = queryParams.get("phone") || "1234567890";

  // const clientInfo = await table.getClientByPhone(phone);

  const allClients = await table.getAllRows();

  return NextResponse.json(allClients, {
    headers: {
      'content-type': 'application/json',
    },
  });
}
