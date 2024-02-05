import { AirtableCRMProvider, AirtableCRMTable } from "../../../lib/crm_data/airtable";

const AIRTABLE_TEST_API_KEY = process.env.AIRTABLE_TEST_API_KEY || "";
const AIRTABLE_TEST_BASE_ID = process.env.AIRTABLE_TEST_BASE_ID || "";
const AIRTABLE_TEST_TABLE_ID = process.env.AIRTABLE_TEST_TABLE_ID || "";


export async function GET(request: Request) {
  const provider = new AirtableCRMProvider(AIRTABLE_TEST_BASE_ID, AIRTABLE_TEST_API_KEY);

  const table = provider.getTable(AIRTABLE_TEST_TABLE_ID);

  const newObj = { "id": "recXIkBPF628WMnSA", "Address": "My House Changed!", "Phone": "(123) 456-7890", "RECORD_ID": "recXIkBPF628WMnSA" };

  const clientInfo = await table.storeClientByPhone("1234567890", newObj);
  return new Response(JSON.stringify("Success!"), {
    headers: {
      "content-type": "application/json",
    },
  });
}