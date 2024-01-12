"use client";
import Link from "next/link";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";

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
import DialPad from "./Dialpad";
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
  // TODO replace following empty functions with useCalls hook:
  // https://github.com/ConnieML/Connie-RTC/blob/0a5aa1aca731bf4f9dee5765779bcf3bbcb0f6bf/src/lib/hooks/useCalls.ts
  const [number, setNumber] = useState("");
  const [inCall, setInCall] = useState(false);
  const makeCall: (number: string) => void = (number: string) => {
    setInCall(true);
  };
  const endCall: () => void = () => {
    setInCall(false);
  };

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
        <div className="flex flex-row">
          <Popover>
            <PopoverTrigger>
              <Button variant="ghost" size="icon">
                <MessageSquare color="#D3D3D3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <MessagesCard />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger>
              <Button variant="ghost" size="icon">
                <Phone color={`${!inCall ? "#D3D3D3" : "#08B3E5"}`} />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <DialPad
                number={number}
                inCall={inCall}
                setNumber={setNumber}
                makeCall={makeCall}
                endCall={endCall}
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger>
              <Button variant="ghost" size="icon">
                <Bell color="#D3D3D3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <NotificationsCard />
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="ml-2">
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
