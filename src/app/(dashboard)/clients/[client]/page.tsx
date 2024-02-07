import Notes from "@/components/notes";

// TODO check if user exists

export default function Client({ params }: { params: { client: string } }) {
  return (
    <main className="flex flex-row justify-between">
      <div> {params.client} </div>
      <Notes clientId={params.client} />
    </main>
  );
}
