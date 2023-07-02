import { SyncClient } from "twilio-sync"
import { useEffect, useState } from "react"
import { WorkersDetails, TaskQueuesDetails, SyncMapData } from '@/lib/syncInterfaces'

export default function QueuesStats() {
    const [syncClient, setSyncClient] = useState<SyncClient | null>(null)
    const [syncMapData, setSyncMapData] = useState<SyncMapData>({
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
    })
    const [syncMapSid, setSyncMapSid] = useState<string>('')

    useEffect(() => {
        async function initializeSyncClient() {
            await fetch('/api/accessToken')
                .then(response => response.json())
                .then(data => {
                    setSyncClient(new SyncClient(data.accessToken, { logLevel: 'info' }))
                })
        }
        initializeSyncClient()

        async function getSyncMapSid() {
            await fetch('/api/syncMaps')
                .then(response => response.json())
                .then(data => {
                    setSyncMapSid(data.syncMaps[0].sid)
                })
        }
        getSyncMapSid()

        // if (syncMapSid) {
        //     syncClient?.map(syncMapSid).then(function (map) {
        //         map.on('itemAdded', function(item) {
        //             // update the UI to reflect the new item
        //             console.log('key', item.key);
        //             console.log('JSON data', item.value);    
        //         });
                
        //         // Note that there are two separate events for map item adds and map item updates:
        //         map.on('itemUpdated', function(item) {
        //             console.log('key', item.key);
        //             console.log('JSON data', item.value);
        //         });
        //     });
        // }

        // return () => {
        //     if (syncClient) {
        //         syncClient.shutdown()
        //     }
        // }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [syncMapSid])

    return (
        <div className="px-4 mx-auto mt-32 max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p>Manage your tasks and agents here</p>

            <h2 className="mt-10 text-xl font-semibold">Tasks Overview</h2>
            <ul>
                <li>Active Tasks</li>
                <li>Waiting Tasks</li>
                <li>Longest Wait</li>
            </ul>

            <h2 className="mt-10 text-xl font-semibold">Available Agents</h2>
            <ul>
                <li>Available</li>
                <li>Unavailable</li>
                <li>Offline</li>
            </ul>

            <h2 className="mt-10 text-xl font-semibold">Task Queues</h2>

            {/* <button onClick={
                () => {
                    console.log(syncMapSid)
                }
            }>
                Click me
            </button> */}
        </div>
    )
}