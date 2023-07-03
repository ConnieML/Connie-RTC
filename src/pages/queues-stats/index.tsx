import { SyncClient } from "twilio-sync"
import { useEffect, useState } from "react"
import { SyncMapData } from '@/lib/syncInterfaces'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { SyncMapItemInstance } from "twilio/lib/rest/sync/v1/service/syncMap/syncMapItem"

export default function QueuesStats({ 
    initialSyncMapData
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [syncClient, setSyncClient] = useState<SyncClient | null>(null)
  const [syncMapData, setSyncMapData] = useState<SyncMapData>(initialSyncMapData)

  useEffect(() => {
    async function initializeSyncClient() {
      await fetch('/api/accessToken')
        .then(response => response.json())
        .then(data => {
          setSyncClient(new SyncClient(data.accessToken, { logLevel: 'info' }))
        })
    }
    initializeSyncClient()
  }, [])

  useEffect(() => {
    syncClient?.map('queuesStats').then((map) => {
      map.on("itemAdded", (event) => {
        const { key, data } = event.item.descriptor
        setSyncMapData((prevState) => {
          return {
            ...prevState,
            [key]: data
          }
        })
      })
    })
    syncClient?.map('queuesStats').then((map) => {
      map.on("itemUpdated", (event) => {
        const { key, data } = event.item.descriptor
        setSyncMapData((prevState) => {
          return {
            ...prevState,
            [key]: data
          }
        })
      })
    })
  }, [syncClient])

  return (
    <div className="px-4 mx-auto mt-32 max-w-7xl sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p>Manage your tasks and agents here</p>

      <h2 className="mt-10 text-xl font-semibold">Tasks Overview</h2>
      <ul>
        <li>Active Tasks: {syncMapData.tasks.activeTasks}</li>
        <li>Waiting Tasks: {syncMapData.tasks.waitingTasks}</li>
        <li>Longest Wait: {(syncMapData.tasks.longestTaskWaitingAge / 60).toFixed(0)}m</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold">Agents Overview</h2>
      <ul>
        <li>Available: {syncMapData.workers.availableWorkers}</li>
        <li>Unavailable: {syncMapData.workers.unavailableWorkers}</li>
        <li>Offline: {syncMapData.workers.offlineWorkers}</li>
      </ul>
      <h3 className="mt-10 text-xl font-semibold">Agents</h3>
      <ul>
        {Object.keys(syncMapData.workers.workersDetails).map((workerSid) => {
          return (
            <li key={workerSid} className="ml-4 list-disc">
              {JSON.stringify(syncMapData.workers.workersDetails[workerSid])}
            </li>
          )
        }
        )}
      </ul>

      <h2 className="mt-10 text-xl font-semibold">Task Queues</h2>
      <ul>
        {Object.keys(syncMapData.taskQueuesDetails).map((taskQueueSid) => {
          return (
            <li key={taskQueueSid} className="ml-4 list-disc">
              {syncMapData.taskQueuesDetails[taskQueueSid].friendlyName}:{' '}
              {JSON.stringify(syncMapData.taskQueuesDetails[taskQueueSid])}
            </li>
          )
        }
        )}
      </ul>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<
  { initialSyncMapData: SyncMapData }
> = async () => {
  const syncMapsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/syncMaps`,
    {
      method: 'GET',
    }
  )
  const syncMapsData = await syncMapsResponse.json()
  const syncMaps = syncMapsData.syncMaps

  let syncMapItems: SyncMapItemInstance[] = []
  if (syncMaps.length > 0) {
    const syncMapSid = syncMaps[0].sid
    const syncMapItemsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/syncMapItems?syncMapSid=${syncMapSid}`,
        {
        method: 'GET',
        }
    )
    const syncMapItemsData = await syncMapItemsResponse.json()
    syncMapItems = syncMapItemsData.syncMapItems
  }

  let initialSyncMapData: SyncMapData = {
    tasks: {
        activeTasks: 0,
        waitingTasks: 0,
        longestTaskWaitingAge: 0
      },
      workers: {
        availableWorkers: 0,
        unavailableWorkers: 0,
        offlineWorkers: 0,
        workersDetails: {}
      },
      taskQueuesDetails: {}
  }

  for (const syncMapItem of syncMapItems) {
    const { key, data } = syncMapItem
    if (key === 'tasks') {
        initialSyncMapData.tasks = data
    } else if (key === 'workers') {
        initialSyncMapData.workers = data
    } else if (key === 'taskQueuesDetails') {
        initialSyncMapData.taskQueuesDetails = data
    }
  }

  return {
    props: {
        initialSyncMapData
    }
  }
}
