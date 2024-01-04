import { cn } from "@/lib/utils";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Home, Users, DollarSign, ListChecks, Settings } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isProgramManager: boolean;
}

export default function Sidebar({ className, isProgramManager }: SidebarProps) {
  return (
    <div
      className={cn(
        "pb-2 w-40 border-r bg-background text-slate-600",
        className
      )}
    >
      <Button asChild variant="ghost" className="w-full justify-start">
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Home
        </Link>
      </Button>
      <Button asChild variant="ghost" className="w-full justify-start">
        <Link href="/tasks">
          <ListChecks className="mr-2 h-4 w-4" />
          Tasks
        </Link>
      </Button>
      {isProgramManager && (
        <>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/agents">
              <Users className="mr-2 h-4 w-4" />
              Agents
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/billings">
              <DollarSign className="mr-2 h-4 w-4" />
              Billings & Usage
            </Link>
          </Button>
        </>
      )}
      <Button asChild variant="ghost" className="w-full justify-start">
        <Link href="/settings">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Link>
      </Button>
    </div>
  );
}
