// // TODO UNCOMMENT AND TEST
// import { type NextRequest } from "next/server";
// import { twilioClient } from "@/lib/twilioClient";
// import {
//   TaskInstance,
//   TaskListInstanceCreateOptions,
//   TaskContextUpdateOptions,
// } from "twilio/lib/rest/taskrouter/v1/workspace/task";

// function getQueryParams(req: NextRequest) {
//   const searchParams = req.nextUrl.searchParams;
//   const workspaceSid = searchParams.get("workspaceSID") as string;
//   const taskSid = searchParams.get("taskSID") as string;

//   return { workspaceSid, taskSid };
// }

// export async function GET(req: NextRequest) {
//   const { workspaceSid, taskSid } = getQueryParams(req);

//   if (taskSid) {
//     const task: TaskInstance = await twilioClient.taskrouter.v1
//       .workspaces(workspaceSid)
//       .tasks(taskSid)
//       .fetch();
//     return Response.json({ task });
//   }

//   const Tasks: TaskInstance[] = await twilioClient.taskrouter.v1
//     .workspaces(workspaceSid)
//     .tasks.list();
//   return Response.json({ Tasks });
// }

// export async function POST(req: NextRequest) {
//   const { workspaceSid, taskSid } = getQueryParams(req);
//   const task: TaskListInstanceCreateOptions = await req.json();
//   await twilioClient.taskrouter.v1.workspaces(workspaceSid).tasks.create(task);
//   return Response.json({ task });
// }

// export async function PUT(req: NextRequest) {
//   const { workspaceSid, taskSid } = getQueryParams(req);
//   const task: TaskContextUpdateOptions = await req.json();
//   await twilioClient.taskrouter.v1
//     .workspaces(workspaceSid)
//     .tasks(taskSid)
//     .update(task);
//   return Response.json({ task });
// }

// export async function DELETE(req: NextRequest) {
//   const { workspaceSid, taskSid } = getQueryParams(req);
//   await twilioClient.taskrouter.v1
//     .workspaces(workspaceSid)
//     .tasks(taskSid)
//     .remove();
//   return Response.json({ taskSid });
// }
