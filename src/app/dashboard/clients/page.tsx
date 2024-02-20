import { ClientTable } from "@/components/clientTable/ClientTable";
import { columns } from "@/components/clientTable/columns";
import { CRMEntry } from "@/lib/crm/types";
import fetchClients from "@/lib/data/clients";

export default async function ClientsPage() {
  const data: CRMEntry[] = await fetchClients();

  return (
    <main className="pb-8">
      <h1 className="text-3xl font-bold">Clients</h1>
      <p className="mt-3 font-semibold pb-2">
        Browse and search for all client contacts here.
      </p>
      <ClientTable columns={columns} data={data} />
    </main>
  );
}
