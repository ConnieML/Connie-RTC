import type { NextApiRequest, NextApiResponse } from 'next';
import { twilioClient } from '@/lib/twilioClient';
import {
  TaskQueueInstance,
  TaskQueueListInstanceCreateOptions,
  TaskQueueContextUpdateOptions,
} from 'twilio/lib/rest/taskrouter/v1/workspace/taskQueue';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { taskQueueSid } = req.query as {
    taskQueueSid: string;
  };
  const workspaceSid = process.env.TWILIO_TASKROUTER_WORKSPACE_SID;
  if (!workspaceSid) {
    res.status(400).json({ error: 'Workspace SID not configured' });
    return;
  }

  if (method === 'GET') {
    if (taskQueueSid) {
      const taskQueue: TaskQueueInstance = await twilioClient.taskrouter.v1
        .workspaces(workspaceSid)
        .taskQueues(taskQueueSid)
        .fetch();
      res.status(200).json({ taskQueue });
      return;
    }
    const taskQueues: TaskQueueInstance[] = await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .taskQueues.list();
    res.status(200).json({ taskQueues });
  } else if (method === 'POST') {
    const taskQueue: TaskQueueListInstanceCreateOptions = JSON.parse(req.body)
    await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .taskQueues.create(taskQueue);
    res.status(200).json({ taskQueue });
  } else if (method === 'PUT') {
    const taskQueue: TaskQueueContextUpdateOptions = JSON.parse(req.body);
    await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .taskQueues(taskQueueSid)
      .update(taskQueue);
    res.status(200).json({ taskQueue });
  } else if (method === 'DELETE') {
    await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .taskQueues(taskQueueSid)
      .remove();
    res.status(200).json({ taskQueueSid });
  }
}
