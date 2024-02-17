import { Client } from "@/components/clientTable/columns";

// Fetch clients data from crm
export default async function fetchClients(): Promise<Client[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/clients`, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
}
