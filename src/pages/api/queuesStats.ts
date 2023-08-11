import type { NextApiRequest, NextApiResponse } from 'next';
import { twilioClient } from '@/lib/twilioClient';
import {
  WorkersDetails,
  TaskQueuesDetails,
  SyncMapData,
  WorkerActivityStat,
} from '@/lib/syncInterfaces';

/**
 * Callback Event URL for Twilio TaskRouter, called each time an Event takes place
 * @param req a Twilio Event object
 * @param res no content (per Twilio docs)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  res.setHeader('Content-Type', 'application/json');
  res.status(204).end();

  const { WorkspaceSid: workspaceSid } = req.body;

  function calcStats(
    tasksByStatus: {
      reserved: number;
      wrapping: number;
      assigned: number;
      pending: number;
    },
    workerActivityStats: WorkerActivityStat[]
  ): [
    activeTasks: number,
    waitingTasks: number,
    availableWorkers: number,
    unavailableWorkers: number,
    offlineWorkers: number
  ] {
    const { reserved, wrapping, assigned, pending } = tasksByStatus;
    const activeTasks = reserved + wrapping + assigned + pending; // excluding `completed` and `canceled`
    const waitingTasks = reserved + pending;

    let [availableWorkers, unavailableWorkers, offlineWorkers] = [0, 0, 0];
    workerActivityStats.forEach((workerActivityStat: WorkerActivityStat) => {
      switch (workerActivityStat.friendly_name) {
        case 'Available':
          availableWorkers += workerActivityStat.workers;
          break;
        case 'Reserved':
        case 'Unavailable':
          unavailableWorkers += workerActivityStat.workers;
          break;
        case 'Offline':
          offlineWorkers += workerActivityStat.workers;
          break;
        default:
          console.log(
            `Unknown worker activity: ${workerActivityStat.friendly_name}`
          );
          break;
      }
    });

    return [
      activeTasks,
      waitingTasks,
      availableWorkers,
      unavailableWorkers,
      offlineWorkers,
    ];
  }

  /*
  ============================================
  | Fetch high-level Tasks and Workers stats |
  ============================================
  */

  const realtimeWorkspaceStats = await twilioClient.taskrouter.v1
    .workspaces(workspaceSid)
    .statistics()
    .fetch()
    .then((workspace_statistics) => workspace_statistics.realtime);

  const {
    tasks_by_status: tasksByStatus,
    longest_task_waiting_age: longestTaskWaitingAge,
    activity_statistics: workerActivityStats,
  } = realtimeWorkspaceStats;

  const [
    activeTasks,
    waitingTasks,
    availableWorkers,
    unavailableWorkers,
    offlineWorkers,
  ] = calcStats(tasksByStatus, workerActivityStats);

  /*
  ================================
  | Fetch detailed Workers stats |
  ================================
  */

  const workersDetails = await twilioClient.taskrouter.v1
    .workspaces(workspaceSid)
    .workers.list()
    .then((workers) => {
      let workersDetails: WorkersDetails = {};
      workers.forEach((worker) => {
        workersDetails[worker.sid] = {
          friendlyName: worker.friendlyName,
          activityName: worker.activityName,
        };
      });
      return workersDetails;
    });

  /*
  ====================================
  | Fetch detailed Task Queues stats |
  ====================================
  */

  const taskQueues = await twilioClient.taskrouter.v1
    .workspaces(workspaceSid)
    .taskQueues.list()
    .then((taskQueues) =>
      taskQueues.map((taskQueue) => {
        return {
          sid: taskQueue.sid,
          friendlyName: taskQueue.friendlyName,
        };
      })
    );

  const taskQueuesDetails: TaskQueuesDetails = {};
  async function getTaskQueuesDetails(
    taskQueues: { sid: string; friendlyName: string }[]
  ) {
    for (const taskQueue of taskQueues) {
      await twilioClient.taskrouter.v1
        .workspaces(workspaceSid)
        .taskQueues(taskQueue.sid)
        .realTimeStatistics()
        .fetch()
        .then((taskQueueStat) => {
          const {
            tasksByStatus,
            longestTaskWaitingAge,
            activityStatistics: workerActivityStats,
          } = taskQueueStat;

          const [
            activeTasks,
            waitingTasks,
            availableWorkers,
            unavailableWorkers,
            offlineWorkers,
          ] = calcStats(tasksByStatus, workerActivityStats);

          taskQueuesDetails[taskQueue.sid] = {
            friendlyName: taskQueue.friendlyName,
            activeTasks: activeTasks,
            waitingTasks: waitingTasks,
            longestTaskWaitingAge: longestTaskWaitingAge,
            availableWorkers: availableWorkers,
            unavailableWorkers: unavailableWorkers,
            offlineWorkers: offlineWorkers,
          };
        });
    }
  }
  await getTaskQueuesDetails(taskQueues);

  /*
  =========================================
  | Update Sync Map with the latest stats |
  =========================================
  */

  const syncMapData: SyncMapData = {
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
  };

  const syncServiceSid = await twilioClient.sync.v1
    .services(process.env.TWILIO_SYNC_SERVICE_SID!)
    .fetch()
    .then((service) => service.sid);

  const syncMapsInstance = twilioClient.sync.v1.services(
    process.env.TWILIO_SYNC_SERVICE_SID!
  ).syncMaps;

  const syncMaps = await syncMapsInstance.list();

  // Grab the first Sync Map from the Sync Service, assuming we're using only one per account
  const syncMapSid =
    syncMaps.length !== 0
      ? syncMaps[0].sid
      : await twilioClient.sync.v1
          .services(syncServiceSid)
          .syncMaps.create({ uniqueName: 'queuesStats' })
          .then((syncMap) => syncMap.sid);

  const syncMapItems = await syncMapsInstance(syncMapSid).syncMapItems.list();

  // Create Sync Map Items if they don't exist, otherwise update them
  if (syncMapItems.length === 0) {
    await Promise.all(
      Object.keys(syncMapData).map((key) => {
        return new Promise((resolve, reject) => {
          const syncMapItem = twilioClient.sync.v1
            .services(syncServiceSid)
            .syncMaps(syncMapSid)
            .syncMapItems.create({
              key,
              data: syncMapData[key as keyof SyncMapData],
            })
            .then((sync_map_item) => sync_map_item);
          if (syncMapItem) {
            resolve(syncMapItem);
          } else {
            reject();
          }
        });
      })
    );
  } else {
    await Promise.all(
      Object.keys(syncMapData).map((key) => {
        return new Promise((resolve, reject) => {
          const syncMapItem = twilioClient.sync.v1
            .services(syncServiceSid)
            .syncMaps(syncMapSid)
            .syncMapItems(key)
            .update({ data: syncMapData[key as keyof SyncMapData] })
            .then((sync_map_item) => sync_map_item);
          if (syncMapItem) {
            resolve(syncMapItem);
          } else {
            reject();
          }
        });
      })
    );
  }
}
