import type { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from 'twilio'
import {
  TaskQueueInstance,
  TaskQueueListInstanceCreateOptions,
  TaskQueueContextUpdateOptions,
} from 'twilio/lib/rest/taskrouter/v1/workspace/taskQueue'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  const { workspaceSid, taskQueueSid } = req.query as {
    workspaceSid: string
    taskQueueSid: string
  }

  const client = new Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )

  if (method === 'GET') {
    if (taskQueueSid) {
      const taskQueue: TaskQueueInstance = await client.taskrouter.v1
        .workspaces(workspaceSid)
        .taskQueues(taskQueueSid)
        .fetch()
      res.status(200).json({ taskQueue })
      return
    }
    const TaskQueues: TaskQueueInstance[] = await client.taskrouter.v1
      .workspaces(workspaceSid)
      .taskQueues.list()
    res.status(200).json({ TaskQueues })
  } else if (method === 'POST') {
    const taskQueue: TaskQueueListInstanceCreateOptions = JSON.parse(req.body)
    await client.taskrouter.v1
      .workspaces(workspaceSid)
      .taskQueues.create(taskQueue)
    res.status(200).json({ taskQueue })
  } else if (method === 'PUT') {
    const taskQueue: TaskQueueContextUpdateOptions = JSON.parse(req.body)
    await client.taskrouter.v1
      .workspaces(workspaceSid)
      .taskQueues(taskQueueSid)
      .update(taskQueue)
    res.status(200).json({ taskQueue })
  } else if (method === 'DELETE') {
    await client.taskrouter.v1
      .workspaces(workspaceSid)
      .taskQueues(taskQueueSid)
      .remove()
    res.status(200).json({ taskQueueSid })
  }
}
