import { NoteData } from "@/types/noteInterface";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

import Note from "./Note";

interface NoteProps {
  note: NoteData;
  handleRemoveNote: (id: string) => void;
}

export default function NotePreview({ note, handleRemoveNote }: NoteProps) {
  return (
    <Card
      key={note.id}
      className="text-left text-sm h-44 transition-all hover:bg-accent flex flex-col justify-between"
    >
      <div>
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-sm font-semibold">{note.title}</CardTitle>
          <CardDescription className="text-xs">
            <span className="font-semibold">Author: </span>
            {note.author}
            <br />
            <span className="font-semibold">Date created: </span>
            {note.dateCreated}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-foreground p-4 py-2">
          <p className="line-clamp-3">{note.content}</p>
        </CardContent>
      </div>
      <CardFooter className="flex justify-between py-4 px-0 h-8 text-muted-foreground">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="text-xs">
              See more
            </Button>
          </DialogTrigger>
          <DialogContent className="h-fit p-4">
            <Note note={note} handleRemoveNote={handleRemoveNote} />
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-slate-200"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="bottom" className="text-xs">
            <DropdownMenuItem
              onClick={() => {
                handleRemoveNote(note.id);
              }}
            >
              Delete note
            </DropdownMenuItem>
            {/* TODO implement extra note features */}
            {/* <DropdownMenuItem>Add label</DropdownMenuItem> */}
            {/* <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Version history</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
