import { AirtableCRMProvider } from "../../../lib/crm/airtable";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// ENV variables for now, pending CRM configuration feature
const AIRTABLE_TEST_API_KEY = process.env.AIRTABLE_TEST_API_KEY || "";
const AIRTABLE_TEST_BASE_ID = process.env.AIRTABLE_TEST_BASE_ID || "";
const AIRTABLE_TEST_TABLE_ID = process.env.AIRTABLE_TEST_TABLE_ID || "";

// TODO replace with the data from the airtable api
const test_data = [
  {
    id: "12345",
    client: "Lola M.",
    phoneNumber: "+1234567890",
    email: "judys@gmail.com",
    lastContacted: "January 28, 2024, 5:26pm",
  },
  {
    id: "163936",
    client: "Judy S.",
    phoneNumber: "+1234567890",
    email: "judys@gmail.com",
    lastContacted: "January 28, 2024, 5:26pm",
  },
  {
    id: "4567",
    client: "ABC",
    phoneNumber: "+0987654321",
    email: "abc@gmail.com",
    lastContacted: "January 28, 2024, 5:26pm",
  },
  {
    id: "192745",
    client: "Judy S.",
    phoneNumber: "+1234567890",
    email: "john@gmail.com",
    lastContacted: "January 28, 2024, 5:26pm",
  },
  {
    id: "192745",
    client: "Judy S.",
    phoneNumber: "+1674567890",
    email: "jane@gmail.com",
    lastContacted: "January 28, 2024, 5:26pm",
  },
  {
    id: "192745",
    client: "Erin S.",
    phoneNumber: "+1094567890",
    email: "erin@gmail.com",
    lastContacted: "January 28, 2024, 5:26pm",
  },
];

/**
 * GET /api/clients
 *
 * @param request - The incoming request object
 * @returns A JSON response with the clients
 */
export async function GET() {
  // Check session
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("You must be logged in.", {
      status: 401,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  const provider = new AirtableCRMProvider(
    AIRTABLE_TEST_BASE_ID,
    AIRTABLE_TEST_API_KEY
  );

  // TODO debug why the records are not being returned (only table info is being returned)
  const table = provider.getTable(AIRTABLE_TEST_TABLE_ID);

  // return new Response(JSON.stringify(table), {
  //   headers: {
  //     "content-type": "application/json",
  //   },
  // });

  // Merge contacts with the same phone number
  const mergedData: any = [];
  test_data.forEach((obj) => {
    const existingObj = mergedData.find(
      (item: any) => item.phoneNumber === obj.phoneNumber
    );
    !existingObj && mergedData.push(obj);
  });

  return Response.json(mergedData);
}
