"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Home, Users, DollarSign, ListChecks, Settings } from "lucide-react";

interface ButtonLinkProps extends React.HTMLAttributes<HTMLDivElement> {
  href: string;
}

const ButtonLink = ({ href, children }: ButtonLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button
      asChild
      variant="ghost"
      className={`w-full justify-start ${isActive && "bg-slate-100"}`}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

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
      <ButtonLink href="/">
        <Home className="mr-2 h-4 w-4" />
        Home
      </ButtonLink>
      <ButtonLink href="/tasks">
        <ListChecks className="mr-2 h-4 w-4" />
        Tasks
      </ButtonLink>
      {isProgramManager && (
        <>
          <ButtonLink href="/agents">
            <Users className="mr-2 h-4 w-4" />
            Agents
          </ButtonLink>
          <ButtonLink href="/billings">
            <DollarSign className="mr-2 h-4 w-4" />
            Billings & Usage
          </ButtonLink>
        </>
      )}
      <ButtonLink href="/settings">
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </ButtonLink>
    </div>
  );
}
