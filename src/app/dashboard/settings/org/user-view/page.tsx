"use client";
import React, { useState } from "react";
import {
  PhoneCall,
  MessageSquareText,
  ArrowUpRight,
  MoreVertical,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface SelectedUsers {
  [key: number]: boolean;
}

interface UserData {
  id: number;
  name: string;
  actionIcon: JSX.Element;
  actionText: string;
  number: string;
  timestamp: string;
}

// Placeholder data
const usersData: UserData[] = [
  {
    id: 1,
    name: "Melissa L.",
    actionIcon: <PhoneCall />,
    actionText: "Called ",
    number: "+1 212-883-2727",
    timestamp: "January 28, 2024, 5:26 p.m.",
  },
  {
    id: 2,
    name: "Cupid S.",
    actionIcon: <PhoneCall />,
    actionText: "Called ",
    number: "+1 212-883-2728",
    timestamp: "January 29, 2024, 6:15 p.m.",
  },
  {
    id: 3,
    name: "Melissa L.",
    actionIcon: <MessageSquareText />,
    actionText: "Messaged ",
    number: "+1 212-883-2728",
    timestamp: "January 30, 2024, 7:15 p.m.",
  },
  {
    id: 3,
    name: "John J.",
    actionIcon: <ArrowUpRight />,
    actionText: "Transferred ",
    number: "+1 212-883-2728",
    timestamp: "January 31, 2024, 8:25 p.m.",
  },
  // ... more users
];
export default function Users() {
  const [selectedUsers, setSelectedUsers] = useState<SelectedUsers>({});
  const [selectAll, setSelectAll] = useState(false);
  const toggleSelectAll = () => {
    const newSelectedUsers: SelectedUsers = {};
    if (!selectAll) {
      usersData.forEach((user) => {
        newSelectedUsers[user.id] = true;
      });
    }
    setSelectedUsers(newSelectedUsers);
    setSelectAll(!selectAll);
  };

  const toggleSelectUser = (userId: number) => {
    setSelectedUsers((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <p className="mb-3 text-[#64748B]">
        Configure voice settings, powered by Twilio.
      </p>
      <hr className="border-t border-gray-200 mb-14" />
      <div className="overflow-x-auto">
        <table className="border border-gray-300 min-w-[942px] bg-white table-fixed">
          <thead>
            <tr>
              <th className="border-b border-gray-400 p-4 text-left">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th className="border-b border-gray-400 p-4 text-left">User</th>
              <th className="border-b border-gray-400 p-4 text-left">Action</th>
              <th className="border-b border-gray-400 p-4 text-left">
                Timestamp
              </th>
              <th className="border-b border-gray-400 p-4"></th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-4">
                  <Checkbox
                    id={`user-checkbox-${user.id}`}
                    checked={selectedUsers[user.id] || false}
                    onCheckedChange={() => toggleSelectUser(user.id)}
                  />
                </td>
                <td className="p-4">{user.name}</td>
                <td className="p-4 flex items-center">
                  {user.actionIcon}
                  <span className="ml-2">{user.actionText}</span>
                  <span className="ml-2">{user.number}</span>
                </td>
                <td className="p-4">{user.timestamp}</td>
                <td>
                  <Button
                    onClick={() => console.log("Options for user", user.id)}
                    className="text-black bg-transparent hover:bg-gray-200 p-2"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
