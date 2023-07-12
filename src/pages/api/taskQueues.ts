import type { NextApiRequest, NextApiResponse } from 'next'
import { twilioClient } from '@/lib/twilioClient'
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

  if (method === 'GET') {
    if (taskQueueSid) {
      const taskQueue: TaskQueueInstance = await twilioClient.taskrouter.v1
        .workspaces(workspaceSid)
        .taskQueues(taskQueueSid)
        .fetch()
      res.status(200).json({ taskQueue })
      return
    }
    const TaskQueues: TaskQueueInstance[] = await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .taskQueues.list()
    res.status(200).json({ TaskQueues })
  } else if (method === 'POST') {
    const taskQueue: TaskQueueListInstanceCreateOptions = JSON.parse(req.body)
    await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .taskQueues.create(taskQueue)
    res.status(200).json({ taskQueue })
  } else if (method === 'PUT') {
    const taskQueue: TaskQueueContextUpdateOptions = JSON.parse(req.body)
    await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .taskQueues(taskQueueSid)
      .update(taskQueue)
    res.status(200).json({ taskQueue })
  } else if (method === 'DELETE') {
    await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .taskQueues(taskQueueSid)
      .remove()
    res.status(200).json({ taskQueueSid })
  }
}
