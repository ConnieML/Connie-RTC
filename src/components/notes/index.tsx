"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import NoteComp from "./Note";
import { Note } from "@/types/noteInterface";

// Test Data
export const test_notes = [
  {
    name: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["meeting", "work", "important"],
  },
  {
    name: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["meeting", "work", "important"],
  },
  {
    name: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["meeting", "work", "important"],
  },
  {
    name: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["meeting", "work", "important"],
  },
  {
    name: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["meeting", "work", "important"],
  },
  {
    name: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["meeting", "work", "important"],
  },
  {
    name: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["meeting", "work", "important"],
  },
  {
    name: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["important"],
  },
  {
    name: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["important"],
  },
];

function NewNote() {
  return (
    <div className="grid w-full gap-2 mt-4">
      <Textarea placeholder="Type your note here." />
      <Button className="w-full">Save Note</Button>
    </div>
  );
}

interface NotesProps extends React.HTMLAttributes<HTMLDivElement> {
  client: string;
}

export default function Notes({ className, client }: NotesProps) {
  const [openNote, setOpenNote] = useState(false);
  const [notes, setNotes] = useState<Note[]>(test_notes);
  return (
    <div className="h-full bg-white p-8">
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => setOpenNote(!openNote)}
      >
        Start a New Note
      </Button>
      {openNote && <NewNote />}
      <div className="mt-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search Notes" className="pl-8" />
        </div>
        <ScrollArea className="h-80 w-[500px] mt-4 flex flex-col">
          <div className="flex flex-wrap justify-between">
            {notes.map((item) => (
              <NoteComp note={item} selected={false} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
