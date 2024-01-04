import Link from "next/link";
import { cn } from "@/lib/utils";

import { Menubar } from "@/components/ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  LogOut,
  Settings,
  UserPlus,
  Users,
  Bell,
  Phone,
  MessageSquare,
} from "lucide-react";

import Logo from "./Logo";
import MessagesCard from "./MessagesCard";
import PhoneCard from "./PhoneCard";
import NotificationsCard from "./NotificationsCard";

interface AppbarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials: string;
  isProgramManager: boolean; // TODO replace with proper authorization check
}

export default function Appbar({
  className,
  initials,
  isProgramManager,
}: AppbarProps) {
  return (
    <Menubar
      className={cn("flex flex-row justify-between h-16 px-4 py-2", className)}
    >
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex space-x-8">
        {/* TODO replace with Availability status toggle component */}
        <div className="self-center">(Status)</div>
        <div className="flex flex-row space-x-4">
          <Popover>
            <PopoverTrigger>
              <MessageSquare color="#0F172A" />
            </PopoverTrigger>
            <PopoverContent align="end">
              <MessagesCard />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger>
              <Phone color="#0F172A" />
            </PopoverTrigger>
            <PopoverContent align="end">
              <PhoneCard />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger>
              <Bell color="#0F172A" />
            </PopoverTrigger>
            <PopoverContent align="end">
              <NotificationsCard />
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings" className="flex flex-row">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              {isProgramManager && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/agents" className="flex flex-row">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Agents</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Invite agents</span>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {/* TODO trigger logout onclick*/}
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Menubar>
  );
}
