import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { getObjectString } from '@/lib/aws/s3';

import {
  AirtableCRMProvider,
  s3KeyForAirtableBase,
  s3KeyForAirtableTable,
  s3KeyForAirtableToken,
} from '../crm/airtable';

type Session = {
  oktaId: string;
};

// Fetch clients data from crm
export default async function fetchClients() {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    console.error('Unauthorized');
    return [];
  }

  try {
    const oktaId = session.oktaId;

    const [airtable_token, airtable_base_id, airtable_table_id] =
      await Promise.all([
        getObjectString(s3KeyForAirtableToken(oktaId)),
        getObjectString(s3KeyForAirtableBase(oktaId)),
        getObjectString(s3KeyForAirtableTable(oktaId)),
      ]);

    const provider = new AirtableCRMProvider(airtable_base_id, airtable_token);
    const table = provider.getTable(airtable_table_id);
    const allClients = await table.getAllRows();

    allClients.forEach((client) => {
      client['full_name'] = `${client.first_name} ${client.last_name}`;
    });
    return allClients;
  } catch (e) {
    console.error(e);
    return [];
  }
}
