import type { NextApiRequest, NextApiResponse } from 'next'
import { twilioClient } from '@/lib/twilioClient'

interface SyncMapData {
  [key: string]: any
}

/**
 * Callback Event URL for Twilio TaskRouter, called each time an Event takes place (e.g. incoming call, new task, etc.)
 * @param req a Twilio Event object
 * @param res no content (per Twilio docs)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  res.setHeader('Content-Type', 'application/json');
  res.status(204).end()

  const { WorkspaceSid: workspaceSid } = req.body

  /*
  ============================================
  | Fetch high-level Tasks and Workers stats |
  ============================================
  */

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

  /*
  ================================
  | Fetch detailed Workers stats |
  ================================
  */

  const workersDetails = await twilioClient.taskrouter.v1.workspaces(workspaceSid)
    .workers
    .list()
    .then(workers => {
      let workersDetails: {
        [sid: string]: {
          friendlyName: string;
          activityName: string;
        }
      } = {}
      workers.forEach(worker => {
        workersDetails[worker.sid] = {
          friendlyName: worker.friendlyName,
          activityName: worker.activityName,
        }
      })
      return workersDetails
    });

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

  /*
  ====================================
  | Fetch detailed Task Queues stats |
  ====================================
  */

  const taskQueues = await twilioClient.taskrouter.v1.workspaces(workspaceSid)
    .taskQueues
    .list()
    .then(taskQueues => taskQueues.map(taskQueue => {
      return {
        sid: taskQueue.sid,
        friendlyName: taskQueue.friendlyName,
      }
    }))

  const taskQueuesDetails: {
    [sid: string]: {
      friendlyName: string;
      activeTasks: number;
      waitingTasks: number;
      longestTaskWaitingAge: number;
      availableWorkers: number;
      unavailableWorkers: number;
      offlineWorkers: number;
    }
  } = {}
  async function getTaskQueuesDetails(taskQueues: any) {
    for (const taskQueue of taskQueues) {
      await twilioClient.taskrouter.v1.workspaces(workspaceSid)
        .taskQueues(taskQueue.sid)
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

          taskQueuesDetails[taskQueue.sid] = {
            friendlyName: taskQueue.friendlyName,
            activeTasks: activeTasks,
            waitingTasks: waitingTasks,
            longestTaskWaitingAge: longestTaskWaitingAge,
            availableWorkers: availableWorkers,
            unavailableWorkers: unavailableWorkers,
            offlineWorkers: offlineWorkers,
          }
        })
    }
  }
  await getTaskQueuesDetails(taskQueues)

  const syncMapData: SyncMapData =
  {
    tasks: {
      activeTasks: activeTasks,
      waitingTasks: waitingTasks,
      longestTaskWaitingAge: longestTaskWaitingAge,
    },
    workers: {
      availableWorkers: availableWorkers,
      unavailableWorkers: unavailableWorkers,
      offlineWorkers: offlineWorkers,
      workersDetails: workersDetails,
    },
    taskQueuesDetails: taskQueuesDetails,
  }

  console.log(JSON.stringify(syncMapData, null, 2));

  //   /*
  //   =========================================
  //   | Update Sync Map with the latest stats |
  //   =========================================
  //   */

  //   // console.dir(syncMapData)

  //   // Assuming we're using the default service that is automatically provided for each new Twilio account
  //   const syncServiceSid = await twilioClient.sync.v1.services.list()
  //     .then(services => services[0].sid)
  //   // console.log("syncServiceSid: " + syncServiceSid)

  //   const syncMapsInstance = twilioClient.sync.v1.services(syncServiceSid).syncMaps
  //   // console.log("syncMapsInstance: " + syncMapsInstance)

  //   const syncMaps = await syncMapsInstance.list()
  //   // console.log("syncMaps: " + syncMaps)

  //   // Assuming we're only using one Sync Map for all the stats per account
  //   const syncMapSid = syncMaps.length !== 0 ? syncMaps[0].sid :
  //     await twilioClient.sync.v1.services(syncServiceSid).syncMaps
  //       .create({ uniqueName: 'queuesStats' }).then(syncMap => syncMap.sid)
  //   console.log("syncMapSid: " + syncMapSid)

  //   const syncMapItems = await syncMapsInstance(syncMapSid).syncMapItems.list()
  //   // console.log("syncMapItems: " + syncMapItems)
  //   // console.log("syncMapItems: " + syncMapItems.length)

  //   // console.log(Object.keys(syncMapData).map(key => console.log(key)))

  //   if (syncMapItems.length === 0) {
  //     const promises = Object.keys(syncMapData).map(key => {
  //       return new Promise((resolve, reject) => {
  //         const syncMapItem = twilioClient.sync.v1.services(syncServiceSid).syncMaps(syncMapSid).syncMapItems
  //           .create({ key, data: syncMapData[key] }, (error) => console.log(error)).then(sync_map_item => sync_map_item)
  //         if (syncMapItem) {
  //           resolve(syncMapItem)
  //         } else {
  //           reject()
  //         }
  //       })
  //     })
  //     await Promise.all(promises)
  //   // } else {
  //   //   Object.keys(syncMapData).forEach(key => {
  //   //     twilioClient.sync.v1.services(syncServiceSid).syncMaps(syncMapSid).syncMapItems(key)
  //   //       .update({ data: syncMapData[key] })
  //   //   })
  //   }
}
