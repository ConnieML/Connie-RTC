import { SyncClient } from "twilio-sync"
import { useEffect, useState } from "react"
import { SyncMapData } from '@/lib/syncInterfaces'

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
                const { key, data } = event.item.descriptor;
                setSyncMapData((prevState) => {
                    return {
                        ...prevState,
                        [key]: data
                    }
                }
                );
            });
        });
        syncClient?.map('queuesStats').then((map) => {
            map.on("itemUpdated", (event) => {
                const { key, data } = event.item.descriptor;
                setSyncMapData((prevState) => {
                    return {
                        ...prevState,
                        [key]: data
                    }
                }
                );
            });
        });
    }, [syncClient])

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