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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreVertical } from "lucide-react";

interface NoteProps {
  note: NoteData;
  handleRemoveNote: (id: string) => void;
}

export default function NotePreview({ note, handleRemoveNote }: NoteProps) {
  return (
    <Card className="border-0 flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>
            <span className="font-semibold">Author: </span>
            {note.author}
            <br />
            <span className="font-semibold">Date created: </span>
            {note.dateCreated}
          </CardDescription>
        </CardHeader>
        <ScrollArea className="h-72">
          <CardContent>{note.content}</CardContent>
        </ScrollArea>
      </div>
      <CardFooter className="flex justify-end align-bottom pr-0 pb-0">
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
          <DropdownMenuContent align="start" side="bottom" className="">
            <DropdownMenuItem
              onClick={() => {
                handleRemoveNote(note.id);
              }}
            >
              Delete note
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
