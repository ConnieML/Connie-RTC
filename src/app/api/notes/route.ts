import { NextRequest } from "next/server";

// Test Data
const test_notes = [
  {
    title: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    labels: ["meeting", "work", "important"],
  },
  {
    title: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["meeting", "work", "important"],
  },
  {
    title: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["meeting", "work", "important"],
  },
  {
    title: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    labels: ["meeting", "work", "important"],
  },
  {
    title: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["meeting", "work", "important"],
  },
  {
    title: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["meeting", "work", "important"],
  },
  {
    title: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["meeting", "work", "important"],
  },
  {
    title: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["important"],
  },
  {
    title: "Agent Jason K.",
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    author: "William Smith",
    callDate: "November 20, 2023",
    callDuration: "13 min 20 sec",
    dateCreated: "November 20, 2023",
    dateUpdated: "November 20, 2023",
    content: "moved to germany, mobility issues",
    labels: ["important"],
  },
];

export async function GET(req: NextRequest) {
  // TODO implement external data source used for notes
  return Response.json(test_notes);
}

export async function POST(req: NextRequest) {
  const queryString = await req.text();
  const params = new URLSearchParams(queryString);

  // TODO add the note to the data source
  // const resp = await...

  const resp = { id: "1234" };
  return new Response(JSON.stringify(resp), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(req: NextRequest) {
  const queryString = await req.text();
  const params = new URLSearchParams(queryString);
  const client: string = params.get("id") ?? "";

  // TODO delete from data source
  // const resp = await...
  return new Response("Success", {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
