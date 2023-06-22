import type { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from 'twilio'
import {
  ActivityInstance,
  ActivityListInstanceCreateOptions,
  ActivityContextUpdateOptions,
} from 'twilio/lib/rest/taskrouter/v1/workspace/activity'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  const { workspaceSid, activitySid } = req.query as {
    workspaceSid: string
    activitySid: string
  }

  const client = new Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )

  if (method === 'GET') {
    if (activitySid) {
      const activity: ActivityInstance = await client.taskrouter.v1
        .workspaces(workspaceSid)
        .activities(activitySid)
        .fetch()
      res.status(200).json({ activity })
      return
    }
    const activities: ActivityInstance[] = await client.taskrouter.v1
      .workspaces(workspaceSid)
      .activities.list()
    res.status(200).json({ activities })
  } else if (method === 'POST') {
    const activity: ActivityListInstanceCreateOptions = JSON.parse(req.body)
    await client.taskrouter.v1
      .workspaces(workspaceSid)
      .activities.create(activity)
    res.status(200).json({ activity })
  } else if (method === 'PUT') {
    const activity: ActivityContextUpdateOptions = JSON.parse(req.body)
    await client.taskrouter.v1
      .workspaces(workspaceSid)
      .activities(activitySid)
      .update(activity)
    res.status(200).json({ activity })
  } else if (method === 'DELETE') {
    await client.taskrouter.v1
      .workspaces(workspaceSid)
      .activities(activitySid)
      .remove()
    res.status(200).json({ activitySid })
  }
}
