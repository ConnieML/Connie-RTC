"use client";
import { useState } from "react";
import Notes from "@/components/notes";
import { Button } from "@/components/ui/button";

// TODO check if user exists

export default function Client({ params }: { params: { client: string } }) {
  const [openNotes, setOpenNotes] = useState(false);
  return (
    <main className="flex flex-row justify-between">
      <div>
        <h1>{params.client}</h1>
        <Button onClick={() => setOpenNotes(!openNotes)}>Notes</Button>
      </div>
      {openNotes && <Notes clientId={params.client} />}
    </main>
  );
}
