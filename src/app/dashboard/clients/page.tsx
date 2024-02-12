import { ClientTable } from "@/components/clientTable/ClientTable";
import { columns, Client } from "@/components/clientTable/columns";

async function fetchData(): Promise<Client[]> {
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

export default async function Clients() {
  const data: Client[] = await fetchData();

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold">Clients</h1>
      <p className="mt-3 font-semibold pb-2">
        Browse and search for all client contacts here.
      </p>
      <ClientTable columns={columns} data={data} />
    </main>
  );
}
