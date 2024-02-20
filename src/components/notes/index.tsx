"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";

import Note from "./Note";
import { NoteData } from "@/types/noteInterface";

export default function Notes({ clientId }: { clientId: string }) {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [searchItem, setSearchItem] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<NoteData[]>([]);

  const [newNote, setNewNote] = useState("");

  const { data: session } = useSession();

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/notes?clientId=${clientId}`,
        );
        const data = await response.json();
        data.sort((a: NoteData, b: NoteData) =>
          dayjs(b.dateCreated).diff(dayjs(a.dateCreated)),
        );
        setNotes(data);
        setFilteredNotes(data);
        setLoading(false);
        setError(null);
      } catch (e) {
        console.error(e);
        setLoading(false);
        setError("There was an error loading the notes");
      }
    };

    fetchNotes();
  }, [clientId]);

  async function handleAddNote(note: string) {
    const newNote = {
      author: session?.user?.name ?? "Agent",
      callDate: new Date().toISOString(),
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
      content: note,
      clientId,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/notes?clientId=${clientId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note: newNote }),
        },
      );
      const data = await response.json();

      setNotes([
        {
          ...newNote,
          id: data.id,
        },
        ...notes,
      ]);
      if (note.includes(searchItem)) {
        setFilteredNotes([
          {
            ...newNote,
            id: data.id,
          },
          ...filteredNotes,
        ]);
      }
      setNewNote("");
      setError(null);
    } catch (e) {
      console.error(e);
      setError("There was an error saving the note.");
    }
  }

  function handleSearchNote(e: ChangeEvent<HTMLInputElement>) {
    const searchTerm = e.target.value?.toLowerCase();
    setSearchItem(searchTerm);

    const filteredNotes = notes.filter((note) =>
      note.content.toLowerCase().includes(searchTerm),
    );

    setFilteredNotes(filteredNotes);
  }

  return (
    <div className="h-[calc(100%-4rem)] bg-white p-8 flex flex-col absolute top-16 right-0">
      <h3 className="text-2xl font-semibold pb-4 ">Notes</h3>
      <div className="relative pb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search Notes"
          value={searchItem}
          onChange={(e) => handleSearchNote(e)}
          className="pl-8"
        />
      </div>
      <ScrollArea className="h-5/6 w-[414px] pb-4">
        <div className="grid gap-4">
          {loading &&
            [...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-5 w-[156px] mb-2" />
                <Skeleton className="h-2 w-[200px] my-2" />
                <Skeleton className="h-12 w-[400px] mt-2" />
              </div>
            ))}
          {error && <p>{error}</p>}
          {!loading && !error && filteredNotes.length === 0 ? (
            <p className="text-secondary-foreground"> No notes found</p>
          ) : (
            filteredNotes.map((item, i) => <Note key={i} note={item} />)
          )}
        </div>
      </ScrollArea>
      <div className="grid gap-4">
        <Textarea
          placeholder="Take a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <div className="flex justify-end">
          <Button
            onClick={() => newNote !== "" && handleAddNote(newNote)}
            className="bg-primitives-blue-2 hover:bg-[#0da8bf]"
          >
            Add Note
          </Button>
        </div>
      </div>
    </div>
  );
}
