import { ClientTable } from "@/components/clientTable/ClientTable";
import { columns, Client } from "@/components/clientTable/columns";

async function getData(): Promise<Client[]> {
  // TODO get data from airtable
  return [
    {
      id: "617394",
      client: "Judy S.",
      phoneNumber: "+12345678901",
      email: "judys@gmail.com",
      lastContacted: "January 28, 2024, 5:26pm",
    },
    {
      id: "617394",
      client: "Judy S.",
      phoneNumber: "+12345678901",
      email: "judys@gmail.com",
      lastContacted: "January 28, 2024, 5:26pm",
    },
    {
      id: "617394",
      client: "ABC",
      phoneNumber: "+12345678901",
      email: "abc@gmail.com",
      lastContacted: "January 28, 2024, 5:26pm",
    },
    {
      id: "617394",
      client: "Judy S.",
      phoneNumber: "+12345678901",
      email: "judys@gmail.com",
      lastContacted: "January 28, 2024, 5:26pm",
    },
  ];
}

export default async function Clients() {
  const data = await getData();

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
