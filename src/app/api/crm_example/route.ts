import { AirtableCRMProvider } from "../../../lib/crm/airtable";


// ENV variables for now, pending CRM configuration feature
const AIRTABLE_TEST_API_KEY = process.env.AIRTABLE_TEST_API_KEY || "";
const AIRTABLE_TEST_BASE_ID = process.env.AIRTABLE_TEST_BASE_ID || "";
const AIRTABLE_TEST_TABLE_ID = process.env.AIRTABLE_TEST_TABLE_ID || "";


/**
 * GET /api/crm_example?phone={phone_number_string}
 * 
 * @param request - The incoming request object.
 * @returns A JSON response with the client info.
 */
export async function GET(request: Request) {
  const provider = new AirtableCRMProvider(AIRTABLE_TEST_BASE_ID, AIRTABLE_TEST_API_KEY);

  const table = provider.getTable(AIRTABLE_TEST_TABLE_ID);

  const url = new URL(request.url);
  const queryParams = new URLSearchParams(url.search);
  const phone: string | null = queryParams.get("phone");

  if (!phone) {
    return new Response("Invalid phone number", {
      status: 400,
    });
  }

  const clientInfo = await table.getClientByPhone(phone);

  return new Response(JSON.stringify(clientInfo), {
    headers: {
      "content-type": "application/json",
    },
  });
}