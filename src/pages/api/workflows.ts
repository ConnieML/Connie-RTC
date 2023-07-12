import type { NextApiRequest, NextApiResponse } from 'next'
import { twilioClient } from '@/lib/twilioClient'
import {
  WorkflowInstance,
  WorkflowListInstanceCreateOptions,
  WorkflowContextUpdateOptions,
} from 'twilio/lib/rest/taskrouter/v1/workspace/workflow'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  const { workspaceSid, workflowSid } = req.query as {
    workspaceSid: string
    workflowSid: string
  }

  if (method === 'GET') {
    if (workflowSid) {
      const workflow: WorkflowInstance = await twilioClient.taskrouter.v1
        .workspaces(workspaceSid)
        .workflows(workflowSid)
        .fetch()
      res.status(200).json({ workflow })
      return
    }
    const Workflows: WorkflowInstance[] = await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .workflows.list()
    res.status(200).json({ Workflows })
  } else if (method === 'POST') {
    const workflow: WorkflowListInstanceCreateOptions = JSON.parse(req.body)
    await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .workflows.create(workflow)
    res.status(200).json({ workflow })
  } else if (method === 'PUT') {
    const workflow: WorkflowContextUpdateOptions = JSON.parse(req.body)
    await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .workflows(workflowSid)
      .update(workflow)
    res.status(200).json({ workflow })
  } else if (method === 'DELETE') {
    await twilioClient.taskrouter.v1
      .workspaces(workspaceSid)
      .workflows(workflowSid)
      .remove()
    res.status(200).json({ workflowSid })
  }
}
