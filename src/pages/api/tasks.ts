import type { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from 'twilio'
import {
  TaskInstance,
  TaskListInstanceCreateOptions,
  TaskContextUpdateOptions,
} from 'twilio/lib/rest/taskrouter/v1/workspace/task'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  const { workspaceSid, taskSid } = req.query as {
    workspaceSid: string
    taskSid: string
  }

  const client = new Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )

  if (method === 'GET') {
    if (taskSid) {
      const task: TaskInstance = await client.taskrouter.v1
        .workspaces(workspaceSid)
        .tasks(taskSid)
        .fetch()
      res.status(200).json({ task })
      return
    }
    const Tasks: TaskInstance[] = await client.taskrouter.v1
      .workspaces(workspaceSid)
      .tasks.list()
    res.status(200).json({ Tasks })
  } else if (method === 'POST') {
    const task: TaskListInstanceCreateOptions = JSON.parse(req.body)
    await client.taskrouter.v1.workspaces(workspaceSid).tasks.create(task)
    res.status(200).json({ task })
  } else if (method === 'PUT') {
    const task: TaskContextUpdateOptions = JSON.parse(req.body)
    await client.taskrouter.v1
      .workspaces(workspaceSid)
      .tasks(taskSid)
      .update(task)
    res.status(200).json({ task })
  } else if (method === 'DELETE') {
    await client.taskrouter.v1.workspaces(workspaceSid).tasks(taskSid).remove()
    res.status(200).json({ taskSid })
  }
}
