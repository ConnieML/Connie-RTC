"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  DollarSign,
  ListChecks,
  Settings,
  SquareUser,
  ChevronsUpDown
} from "lucide-react";



import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react";



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

  // const [settingOpen, setSettingOpen] = useState(true);

  return (
    <div
      className={cn(
        "pb-2 w-40 border-r bg-background text-slate-600",
        className
      )}
    >
      <ButtonLink href="/dashboard">
        <Home className="mr-2 h-4 w-4" />
        Home
      </ButtonLink>
      <ButtonLink href="/dashboard/tasks">
        <ListChecks className="mr-2 h-4 w-4" />
        Tasks
      </ButtonLink>
      {isProgramManager && (
        <>
          <ButtonLink href="/dashboard/agents">
            <Users className="mr-2 h-4 w-4" />
            Agents
          </ButtonLink>
          <ButtonLink href="/dashboard/billings">
            <DollarSign className="mr-2 h-4 w-4" />
            Billings & Usage
          </ButtonLink>
        </>
      )}

      <ButtonLink href="/dashboard/clients">
        <SquareUser className="mr-2 h-4 w-4" />
        Cleints
      </ButtonLink>
      <Collapsible>
      
          <ButtonLink href="/dashboard/settings" >
            <Settings className="mr-2 h-4 w-4" />
            
                Settings
                <CollapsibleTrigger>
          <ChevronsUpDown className="mr-2 h-4 w-7" />
          </CollapsibleTrigger>
          <></>
           </ButtonLink>

            
        <CollapsibleContent>
          <ButtonLink href="/dashboard/settings/org/audit-log">
              
                Audit-log
              </ButtonLink>
          </CollapsibleContent>
      </Collapsible>
      {/* <ButtonLink href="/dashboard/settings">
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </ButtonLink>

      <ButtonLink href="/dashboard/settings/org/audit-log">
        <Settings className="mr-2 h-4 w-4" />
        Audit-log
      </ButtonLink> */}
    </div>
  );
}
