import type { NextApiRequest, NextApiResponse } from 'next'
import { twilioClient } from '@/lib/twilioClient'
import { stat } from 'fs';

/* Dev notes:
Resources: 
- https://www.twilio.com/docs/taskrouter/api/event
- https://www.twilio.com/docs/taskrouter/api/event/reference
- https://www.twilio.com/docs/sync/api/map-resource
*/

// This API serves as the Callback Event URL for Twilio TaskRouter, called each time an Event takes place
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // Respond with no content as recommended by https://www.twilio.com/docs/taskrouter/api/event/reference
  res.setHeader('Content-Type', 'application/json');
  res.status(204).end()

  const { WorkspaceSid: workspaceSid } = req.body

  const realtimeWorkspaceStats = await twilioClient.taskrouter.v1.workspaces(workspaceSid)
    .statistics()
    .fetch()
    .then(workspace_statistics => workspace_statistics.realtime);

  const {
    tasks_by_status: tasksByStatus,
    longest_task_waiting_age: longestTaskWaitingAge,
    activity_statistics: workerActivityStats
  } = realtimeWorkspaceStats

  const { reserved, wrapping, assigned, pending } = tasksByStatus // excluding completed and canceled
  const activeTasks = reserved + wrapping + assigned + pending
  const waitingTasks = reserved + pending

  let [availableWorkers, unavailableWorkers, offlineWorkers] = [0, 0, 0]
  workerActivityStats.forEach((workerActivityStat: {
    friendly_name: string;
    workers: number;
    sid: string;
  }) => {
    switch (workerActivityStat.friendly_name) {
      case 'Available':
        availableWorkers = workerActivityStat.workers
        break;
      case 'Unavailable':
        unavailableWorkers = workerActivityStat.workers
        break;
      case 'Offline':
        offlineWorkers = workerActivityStat.workers
        break;
      default:
        console.log(`Unknown worker activity: ${workerActivityStat.friendly_name}`)
        break;
    }
  }
  )

  // console.log(
  //   `Active tasks: ${activeTasks},
  //   Waiting tasks: ${waitingTasks},
  //   longestTaskWaitingAge: ${longestTaskWaitingAge},
  //   Available workers: ${availableWorkers},
  //   Unavailable workers: ${unavailableWorkers},
  //   Offline workers: ${offlineWorkers}`
  // )
}

/*
  realtime: {
    workspace_sid: 'WS7768f3bd9ef5ba43054a9d59f8d01bfa',
    longest_task_waiting_sid: 'WTdca798966016904948d05bf5c9e06a5d',
    account_sid: 'AC2517201653c12113c60aa437ebdc4bb3',
    total_workers: 2,
    tasks_by_status: {
      reserved: 0,
      completed: 0,
      wrapping: 0,
      assigned: 0,
      canceled: 0,
      pending: 4
    },
    activity_statistics: [ [Object], [Object], [Object], [Object] ],
    tasks_by_priority: { '0': 4 },
    longest_task_waiting_age: 973,
    total_tasks: 4
  },

event:  [Object: null prototype] {
  TaskPriority: '0',
  EventType: 'task.created',
  WorkflowName: 'Default Fifo Workflow',
  Timestamp: '1687959728',
  TaskAge: '0',
  TaskAssignmentStatus: 'pending',
  TaskAttributes: '{}',
  TaskVersion: '0',
  TaskChannelUniqueName: 'voice',
  WorkspaceName: 'Python Quickstart',
  OperatingUnitSid: 'OUd526262c7013976328a61c7a6456b283',
  TaskChannelSid: 'TC44bb88cd7e2f418406d9f2f7aa7605fe',
  TaskQueueEnteredDate: '1687959728',
  TaskDateCreated: '1687959728',
  ResourceType: 'task',
  TaskQueueName: 'Sample Queue',
  WorkflowSid: 'WW13914047ce49330c010e2a879da6dc71',
  AccountSid: 'AC2517201653c12113c60aa437ebdc4bb3',
  Sid: 'EVe9d33482d7385787fb325b64d2b6f3e4',
  TimestampMs: '1687959728350',
  TaskQueueTargetExpression: '1==1',
  WorkspaceSid: 'WS7768f3bd9ef5ba43054a9d59f8d01bfa',
  TaskQueueSid: 'WQac96cdef21bd916af7e2f163026aae6b',
  EventDescription: 'Task WT6ec923d096d908543ceb7eac220890dd created',
  TaskSid: 'WT6ec923d096d908543ceb7eac220890dd',
  ResourceSid: 'WT6ec923d096d908543ceb7eac220890dd'
}
*/