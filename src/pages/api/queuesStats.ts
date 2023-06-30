import type { NextApiRequest, NextApiResponse } from 'next'
import { twilioClient } from '@/lib/twilioClient'

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

  // Fetch high-level task and worker stats
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

  // Fetch workers stats
  const workers = await twilioClient.taskrouter.v1.workspaces(workspaceSid)
    .workers
    .list()
    .then(workers => workers.map(worker => {
      return {
        "friendly_name": worker.friendlyName,
        "activity_name": worker.activityName,
      }
    }));

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

  // Fetch task queues stats
  const taskQueueIds = await twilioClient.taskrouter.v1.workspaces(workspaceSid)
    .taskQueues
    .list()
    .then(taskQueues => taskQueues.map(taskQueue => {
      return {
        "sid": taskQueue.sid,
        "friendlyName": taskQueue.friendlyName,
      }
    }))

  const taskQueues = await Promise.all(taskQueueIds.map(taskQueueId => {
    return twilioClient.taskrouter.v1.workspaces(workspaceSid)
      .taskQueues(taskQueueId.sid)
      .realTimeStatistics()
      .fetch()
      .then(taskQueueStat => {
        // TODO: write a shared function to not repeat the code below and above
        const {
          tasksByStatus,
          longestTaskWaitingAge,
          activityStatistics: workerActivityStats
        } = taskQueueStat

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

        const { reserved, wrapping, assigned, pending } = tasksByStatus // excluding completed and canceled
        const activeTasks = reserved + wrapping + assigned + pending
        const waitingTasks = reserved + pending

        return {
          "friendlyName": taskQueueId.friendlyName,
          "activeTasks": activeTasks,
          "waitingTasks": waitingTasks,
          "longestTaskWaitingAge": longestTaskWaitingAge,
          "availableWorkers": availableWorkers,
          "unavailableWorkers": unavailableWorkers,
          "offlineWorkers": offlineWorkers,
        }
      })
  }))

  console.dir(
    {
      "activeTasks": activeTasks,
      "waitingTasks": waitingTasks,
      "longestTaskWaitingAge": longestTaskWaitingAge,
      "availableWorkers": availableWorkers,
      "unavailableWorkers": unavailableWorkers,
      "offlineWorkers": offlineWorkers,
      "workers": workers,
      "taskQueues": taskQueues,
    }
  )
}
