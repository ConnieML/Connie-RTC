// TODO TEST
import { type NextRequest } from "next/server";
import { twilioClient } from "@/lib/twilioClient";
import {
  ActivityInstance,
  ActivityListInstanceCreateOptions,
  ActivityContextUpdateOptions,
} from "twilio/lib/rest/taskrouter/v1/workspace/activity";

function getQueryParams(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const workspaceSid = searchParams.get("workspaceSid") as string;
  const activitySid = searchParams.get("activitySid") as string;

  return { workspaceSid, activitySid };
}

export async function GET(req: NextRequest) {
  const { workspaceSid, activitySid } = getQueryParams(req) as {
    workspaceSid: string;
    activitySid: string;
  };

  if (activitySid) {
    const activity: ActivityInstance = await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .activities(activitySid)
      .fetch();
    return Response.json({ activity });
  }

  const activities: ActivityInstance[] = await twilioClient.taskrouter.v1
    .workspaces(workspaceSid)
    .activities.list();
  return Response.json({ activities });
}

export async function POST(req: NextRequest) {
  const { workspaceSid, activitySid } = getQueryParams(req) as {
    workspaceSid: string;
    activitySid: string;
  };

  const activity: ActivityListInstanceCreateOptions = await req.json();
  await twilioClient.taskrouter.v1
    .workspaces(workspaceSid)
    .activities.create(activity);

  return Response.json({ activity });
}

export async function PUT(req: NextRequest) {
  const { workspaceSid, activitySid } = getQueryParams(req) as {
    workspaceSid: string;
    activitySid: string;
  };

  const activity: ActivityContextUpdateOptions = await req.json();
  await twilioClient.taskrouter.v1
    .workspaces(workspaceSid)
    .activities(activitySid)
    .update(activity);
  return Response.json({ activity });
}

export async function DELETE(req: NextRequest) {
  const { workspaceSid, activitySid } = getQueryParams(req) as {
    workspaceSid: string;
    activitySid: string;
  };

  await twilioClient.taskrouter.v1
    .workspaces(workspaceSid)
    .activities(activitySid)
    .remove();
  return Response.json({ activitySid });
}
