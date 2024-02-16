"use client";
import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

// This type is used to define the shape of our data.
export type Client = {
  id: string;
  client: string;
  phoneNumber: string;
  email: string;
  lastContacted: string;
};

export const columns: ColumnDef<Client>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: () => <p className="text-lg text-black">Id</p>,
    accessorKey: "id",
  },
  {
    accessorKey: "client",
    header: () => <p className="text-lg text-black">Client</p>,
  },
  {
    accessorKey: "phoneNumber",
    header: () => <p className="text-lg text-black">Phone Number</p>,
  },
  {
    accessorKey: "email",
    header: () => <p className="text-lg text-black">Email</p>,
  },
  {
    accessorKey: "lastContacted",
    header: () => <p className="text-lg text-black">Last contacted</p>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const client = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              // TODO Trigger call functionality
              onClick={() => console.log("calling...")}
            >
              Call
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(client.phoneNumber)}
            >
              Copy phone number
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/clients/${client.id}`}>
                See more details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
