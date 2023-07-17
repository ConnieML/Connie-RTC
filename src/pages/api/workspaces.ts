import type { NextApiRequest, NextApiResponse } from 'next'
import { twilioClient } from '@/lib/twilioClient'
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

  if (method === 'GET') {
    if (sid) {
      const workspace: WorkspaceInstance = await twilioClient.taskrouter.v1
        .workspaces(sid)
        .fetch()
      res.status(200).json({ workspace })
      return
    }
    const workspaces: WorkspaceInstance[] =
      await twilioClient.taskrouter.v1.workspaces.list()
    res.status(200).json({ workspaces })
  } else if (method === 'POST') {
    const workspace: WorkspaceListInstanceCreateOptions = JSON.parse(req.body)
    await twilioClient.taskrouter.v1.workspaces.create(workspace)
    res.status(200).json({ workspace })
  } else if (method === 'PUT') {
    const workspace: WorkspaceContextUpdateOptions = JSON.parse(req.body)
    await twilioClient.taskrouter.v1.workspaces(sid).update(workspace)
    res.status(200).json({ workspace })
  } else if (method === 'DELETE') {
    await twilioClient.taskrouter.v1.workspaces(sid).remove()
    res.status(200).json({ sid })
  }
}
