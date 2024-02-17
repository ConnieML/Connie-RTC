import { ClientTable } from "@/components/clientTable/ClientTable";
import { columns, Client } from "@/components/clientTable/columns";
import fetchClients from "@/lib/data/clients";

export default async function ClientsPage() {
  const data: Client[] = await fetchClients();

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
