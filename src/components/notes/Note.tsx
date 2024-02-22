import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { InteractionData } from '@/types/notes';

/**
 * A component that displays a case note for a client made by an agent.
 */
export default function Note({ note }: { note: InteractionData }) {
  dayjs.extend(localizedFormat);
  return (
    <Card className="rounded-none border-0 border-l-2 border-primitives-blue-1 text-sm mr-2 transition-all hover:bg-accent flex flex-col justify-between">
      <div>
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-sm font-semibold text-primitives-blue-2">
            {note.author}
          </CardTitle>
          <CardDescription className="text-xs font-medium">
            {dayjs(note.dateCreated).format('LLL')}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-foreground px-4 py-2">
          <p>{note.content}</p>
        </CardContent>
      </div>
    </Card>
  );
}
