import type { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from 'twilio'
import {
  WorkerInstance,
  WorkerListInstanceCreateOptions,
  WorkerContextUpdateOptions,
} from 'twilio/lib/rest/taskrouter/v1/workspace/worker'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  const { workspaceSid, workerSid } = req.query as {
    workspaceSid: string
    workerSid: string
  }

  const client = new Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )

  if (method === 'GET') {
    if (workerSid) {
      const worker: WorkerInstance = await client.taskrouter.v1
        .workspaces(workspaceSid)
        .workers(workerSid)
        .fetch()
      res.status(200).json({ worker })
      return
    }
    const workers: WorkerInstance[] = await client.taskrouter.v1
      .workspaces(workspaceSid)
      .workers.list()
    res.status(200).json({ workers })
  } else if (method === 'POST') {
    const worker: WorkerListInstanceCreateOptions = JSON.parse(req.body)
    await client.taskrouter.v1
      .workspaces(workspaceSid)
      .activities.create(worker)
    res.status(200).json({ worker })
  } else if (method === 'PUT') {
    const worker: WorkerContextUpdateOptions = JSON.parse(req.body)
    await client.taskrouter.v1
      .workspaces(workspaceSid)
      .activities(workerSid)
      .update(worker)
    res.status(200).json({ worker })
  } else if (method === 'DELETE') {
    await client.taskrouter.v1
      .workspaces(workspaceSid)
      .activities(workerSid)
      .remove()
    res.status(200).json({ workerSid })
  }
}
