import Notes from "@/components/notes";

export default function Home() {
  return (
    <main className="flex flex-row justify-between">
      <div> About client</div>
      <Notes client="Diana Jones" />
    </main>
  );
}
