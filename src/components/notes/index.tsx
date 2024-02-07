"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";

import NotePreview from "./NotePreview";
import { NoteData } from "@/types/noteInterface";

interface NotesProps extends React.HTMLAttributes<HTMLDivElement> {
  clientId: string;
}

export default function Notes({ clientId }: NotesProps) {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [searchItem, setSearchItem] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<NoteData[]>([]);

  const [openNote, setOpenNote] = useState(false);
  const [newNote, setNewNote] = useState(""); // TODO combine with title
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/notes?clientId=${clientId}`
        );
        const data = await response.json();
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
  }, []);

  async function handleAddNote(note: string) {
    const newNote = {
      title: "Agent Name - Date", // TODO
      author: "Agent Name",
      callDate: new Date().toLocaleString(),
      dateCreated: new Date().toLocaleString(),
      dateUpdated: new Date().toLocaleString(),
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
        }
      );
      const data = await response.json();

      setNotes([
        {
          ...newNote,
          id: data.id,
        },
        ...notes,
      ]);
      // update filtered notes?
      setNewNote("");
      setOpenNote(false);
    } catch (e) {
      console.error(e);
      setError("There was an error saving the note.");
    }
  }

  async function handleRemoveNote(id: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/notes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });
      const data = await response.json();

      setNotes(notes.filter((n) => n.id !== id));
    } catch (e) {
      console.error(e);
      setError("There was an error deleting the note.");
    }
  }

  function handleSearchNote(e: ChangeEvent<HTMLInputElement>) {
    const searchTerm = e.target.value?.toLowerCase();
    setSearchItem(searchTerm);

    const filteredNotes = notes.filter((note) =>
      note.title.toLowerCase().includes(searchTerm)
    );

    setFilteredNotes(filteredNotes);
  }

  return (
    <div className="h-full bg-white p-8">
      {/* {!openNote && ( */}
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => setOpenNote(!openNote)}
      >
        Take a note...
      </Button>
      {/* )} */}
      {openNote && (
        <Card className="grid  w-full gap-2 mt-4">
          <CardHeader>
            <Input id="title" placeholder="Title" />
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Take a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            {/* TODO implement ability to update the note? or add metadata (labels) to the note */}
            <Button onClick={() => handleAddNote(newNote)} className="w-full">
              Save Note
            </Button>
          </CardFooter>
        </Card>
        // <div className="grid w-full gap-2 mt-4">
        //   <div className="grid w-full max-w-sm items-center gap-1.5">
        //     <Label htmlFor="email">Title</Label>
        //     <Input type="email" id="email" placeholder="Email" />
        //   </div>
        //   <Textarea
        //     placeholder="Type your note here..."
        //     value={newNote}
        //     onChange={(e) => setNewNote(e.target.value)}
        //   />
        //   {/* TODO implement ability to keep updating the note? or add metadata like labels to the note */}
        //   <Button onClick={() => handleAddNote(newNote)} className="w-full">
        //     Save Note
        //   </Button>
        // </div>
      )}
      <div className="mt-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Notes"
            value={searchItem}
            onChange={(e) => handleSearchNote(e)}
            className="pl-8"
          />
        </div>
        <ScrollArea className="h-80 w-[500px] mt-4 flex flex-col">
          <div className="grid grid-cols-2 gap-2">
            {loading &&
              [...Array(4)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-5 w-[212px] mb-2" />
                  <Skeleton className="h-3 w-[156px] my-2" />
                  <Skeleton className="h-12 w-[250px] mt-2" />
                </div>
              ))}
            {error && <p>{error}</p>}
            {!loading && !error && filteredNotes.length === 0 ? (
              <p> No notes found</p>
            ) : (
              filteredNotes.map((item, i) => (
                <NotePreview
                  key={i}
                  note={item}
                  handleRemoveNote={handleRemoveNote}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
