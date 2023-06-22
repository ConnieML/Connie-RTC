import type { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from 'twilio'
import {
  WorkspaceInstance,
  WorkspaceListInstanceCreateOptions,
  WorkspaceContextUpdateOptions,
} from 'twilio/lib/rest/taskrouter/v1/workspace'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  const { sid } = req.query as { sid: string }

  const client = new Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )

  if (method === 'GET') {
    if (sid) {
      const workspace: WorkspaceInstance = await client.taskrouter.v1
        .workspaces(sid)
        .fetch()
      res.status(200).json({ workspace })
      return
    }
    const workspaces: WorkspaceInstance[] =
      await client.taskrouter.v1.workspaces.list()
    res.status(200).json({ workspaces })
  } else if (method === 'POST') {
    const workspace: WorkspaceListInstanceCreateOptions = JSON.parse(req.body)
    await client.taskrouter.v1.workspaces.create(workspace)
    res.status(200).json({ workspace })
  } else if (method === 'PUT') {
    const workspace: WorkspaceContextUpdateOptions = JSON.parse(req.body)
    await client.taskrouter.v1.workspaces(sid).update(workspace)
    res.status(200).json({ workspace })
  } else if (method === 'DELETE') {
    await client.taskrouter.v1.workspaces(sid).remove()
    res.status(200).json({ sid })
  }
}
