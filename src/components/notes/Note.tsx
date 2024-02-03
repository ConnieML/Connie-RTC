import { ComponentProps } from "react";
import { Note } from "@/types/noteInterface";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}

interface NoteProps {
  note: Note;
  selected: boolean;
}

export default function Note({ note, selected }: NoteProps) {
  return (
    <button
      key={note.id}
      className={cn(
        "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent mb-2",
        selected && "bg-muted"
      )}
      onClick={() => console.log("click")}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="font-semibold">{note.name}</div>
        </div>
        <div
          className={cn(
            "text-xs",
            selected ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {note.callDate}
        </div>
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground">
        {note.content.substring(0, 300)}
      </div>
      <div className="text-xs font-medium">{note.content}</div>
      {note.labels.length ? (
        <div className="flex items-center gap-2">
          {note.labels.map((label) => (
            <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
              {label}
            </Badge>
          ))}
        </div>
      ) : null}
    </button>
  );
}
