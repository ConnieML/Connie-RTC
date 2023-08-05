import type { NextApiRequest, NextApiResponse } from 'next';
import { twilioClient } from '@/lib/twilioClient';
import {
  WorkerInstance,
  WorkerListInstanceCreateOptions,
  WorkerContextUpdateOptions,
} from 'twilio/lib/rest/taskrouter/v1/workspace/worker';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { workspaceSid, workerSid } = req.query as {
    workspaceSid: string;
    workerSid: string;
  };

  if (method === 'GET') {
    if (workerSid) {
      const worker: WorkerInstance = await twilioClient.taskrouter.v1
        .workspaces(workspaceSid)
        .workers(workerSid)
        .fetch();
      res.status(200).json({ worker });
      return;
    }
    const workers: WorkerInstance[] = await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .workers.list();
    res.status(200).json({ workers });
  } else if (method === 'POST') {
    const worker: WorkerListInstanceCreateOptions = JSON.parse(req.body);
    await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .workers.create(worker);
    res.status(200).json({ worker });
  } else if (method === 'PUT') {
    const worker: WorkerContextUpdateOptions = JSON.parse(req.body);
    await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .workers(workerSid)
      .update(worker);
    res.status(200).json({ worker });
  } else if (method === 'DELETE') {
    await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .workers(workerSid)
      .remove();
    res.status(200).json({ workerSid });
  }
}
