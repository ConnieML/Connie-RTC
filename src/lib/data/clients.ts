import { Client } from "@/components/clientTable/columns";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AirtableCRMProvider } from "../crm/airtable";

// ENV variables for now, pending CRM configuration feature
const AIRTABLE_TEST_API_KEY = process.env.AIRTABLE_TEST_API_KEY || "";
const AIRTABLE_TEST_BASE_ID = process.env.AIRTABLE_TEST_BASE_ID || "";
const AIRTABLE_TEST_TABLE_ID = process.env.AIRTABLE_TEST_TABLE_ID || "";

// TODO replace with airtable data
const test_data = [
  {
    id: "12345",
    client: "Lola M.",
    phoneNumber: "+1222537890",
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

// Fetch clients data from crm
export default async function fetchClients() {
  try {
    // TODO uncomment when getAllRows implemented for airtable api
    // const provider = new AirtableCRMProvider(
    //   AIRTABLE_TEST_BASE_ID,
    //   AIRTABLE_TEST_API_KEY
    // );

    // const table = provider.getTable(AIRTABLE_TEST_TABLE_ID);
    // const clients = await table.getAllRows();
    // return clients;

    const mergedData: any = [];
    test_data.forEach((obj) => {
      const existingObj = mergedData.find(
        (item: any) => item.phoneNumber === obj.phoneNumber
      );
      !existingObj && mergedData.push(obj);
    });
    return mergedData;
  } catch (e) {
    console.error(e);
    return [];
  }
}
