import { SyncClient } from 'twilio-sync';
import { useEffect, useState } from 'react';
import { SyncMapData } from '@/lib/syncInterfaces';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { SyncMapItemInstance } from 'twilio/lib/rest/sync/v1/service/syncMap/syncMapItem';

import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';

let initialSyncMapDummyData: SyncMapData = {
  tasks: {
    activeTasks: 0,
    waitingTasks: 0,
    longestTaskWaitingAge: 0,
  },
  workers: {
    availableWorkers: 0,
    unavailableWorkers: 0,
    offlineWorkers: 0,
    workersDetails: {},
  },
  taskQueuesDetails: {},
};

/**
 * Weird bug on Amplify where you need to refresh page to see all the stats
 * It's because SSR doesn't work in conjunction to useRouter()
 *
 * To fix, easiest would be to either not use Amplify to host
 * or refactor this to fetch client side
 * https://nextjs.org/docs/pages/building-your-application/data-fetching/client-side#client-side-data-fetching-with-useeffect
 *
 * See: https://stackoverflow.com/questions/76442514/nextjs-getserversideprops-not-always-executing-on-aws-amplify
 * @param param0
 * @returns
 */
export default function QueuesStats({
  initialSyncMapData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [syncClient, setSyncClient] = useState<SyncClient | null>(null);
  const [syncMapData, setSyncMapData] = useState<SyncMapData>(
    initialSyncMapData ?? initialSyncMapDummyData
  );
  const [longestTaskWaitingAge, setLongestTaskWaitingAge] = useState(0);

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function initializeSyncClient() {
      await fetch('/api/accessToken')
        .then((response) => response.json())
        .then((data) => {
          setSyncClient(new SyncClient(data.accessToken, { logLevel: 'info' }));
        });
    }
    initializeSyncClient();
  }, []);

  useEffect(() => {
    syncClient?.map('queuesStats').then((map) => {
      map.on('itemAdded', (event) => {
        const { key, data } = event.item.descriptor;
        setSyncMapData((prevState) => {
          return {
            ...prevState,
            [key]: data,
          };
        });
      });
    });
    syncClient?.map('queuesStats').then((map) => {
      map.on('itemUpdated', (event) => {
        const { key, data } = event.item.descriptor;
        setSyncMapData((prevState) => {
          return {
            ...prevState,
            [key]: data,
          };
        });
      });
    });
  }, [syncClient]);

  // Simulate the longest task waiting time increasing since we don't want to call the API every second
  useEffect(() => {
    if (syncMapData.tasks.waitingTasks > 0) {
      setLongestTaskWaitingAge(syncMapData.tasks.longestTaskWaitingAge);

      const interval = setInterval(() => {
        setLongestTaskWaitingAge((prevAge) => prevAge + 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [syncMapData.tasks.longestTaskWaitingAge, syncMapData.tasks.waitingTasks]);

  useEffect(() => {
    if (status !== 'loading') {
      if (status === 'unauthenticated') {
        router.push('/');
      }
    }
  }, [status, router]);

  // basic auth logic
  if (status !== 'authenticated') {
    return <React.Fragment>Loading...</React.Fragment>;
  }

  return (
    <>
      <Navbar />
      <div className="flex-grow p-20  ml-20 mt-[-3%] flex flex-col justify-center">
        <h1 className="font-inter text-[40px] font-bold leading-56 tracking-tight text-left">
          Dashboard
        </h1>
        <h2 className="font-inter text-[15px] font-normal leading-28 tracking-normal text-left mt-2">
          Manage your tasks and agents here
        </h2>
        <h3 className="font-inter text-[18px] font-semibold leading-32 tracking-tight text-left mt-8">
          Tasks Overview
        </h3>
        <div className="flex gap-5">
          <div className="flex box-border rounded h-[230px] w-[135px] border-[2px] mt-5 justify-center flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white border-[2px] border-gray-300 flex items-center justify-center mt-[-30%]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-[#22C55E]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                />
              </svg>
            </div>
            <div className="text-center font-inter text-24 font-medium leading-32 tracking-tight mb-[15%] mt-[10%]">
              Active Tasks
            </div>
            <div className="w-[100px] h-[45px] bg-[#DCFCE7] rounded-full mb-[-40%] mt-[-10px] flex items-center justify-center">
              <div className="font-inter text-green-600 text-2xl font-bold text-[#22C55E]">
                {syncMapData.tasks.activeTasks}
              </div>
            </div>
          </div>
          <div className="flex box-border rounded h-[230px] w-[135px] border-[2px] mt-5 justify-center flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white border-[2px] border-gray-300 flex items-center justify-center mt-[-30%]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-[#F59E0B]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                ></path>
              </svg>
            </div>
            <div className="text-center font-inter text-24 font-medium leading-32 tracking-tight mb-[15%] mt-[10%]">
              Waiting Tasks
            </div>
            <div className="w-[100px] h-[45px] bg-[#FEF3C7] rounded-full mb-[-40%] mt-[-10px] flex items-center justify-center">
              <div className="font-inter text-2xl font-bold text-[#F59E0B]">
                {syncMapData.tasks.waitingTasks}
              </div>
            </div>
          </div>
          <div className="flex box-border rounded h-[230px] w-[135px] border-[2px] mt-5 justify-center flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white border-[2px] border-gray-300 flex items-center justify-center mt-[-30%]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-[#EF4444]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-center font-inter text-24 font-medium leading-32 tracking-tight mb-[15%] mt-[10%]">
              Longest Wait
            </div>
            <div className="w-[100px] h-[45px] bg-[#FEF2F2] rounded-full mb-[-40%] mt-[-10px] flex items-center justify-center">
              <div className="font-inter text-2xl font-bold text-[#EF4444]">
                {syncMapData.tasks.longestTaskWaitingAge}
              </div>
            </div>
          </div>
        </div>
        <h4 className="font-inter text-[18px] font-semibold leading-32 tracking-tight text-left mt-8 mb-5">
          Task Queues
        </h4>
        <table className="table-auto text-left border-separate border-spacing-4">
          <thead>
            <tr>
              <th className="">Queues</th>
              <th>Active</th>
              <th>Waiting</th>
              <th>Longest</th>
              <th className="w-[20%]">Agent Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="">
                {Object.keys(syncMapData.taskQueuesDetails).map(
                  (taskQueueSid) => {
                    return (
                      <div key={taskQueueSid} className="">
                        {
                          syncMapData.taskQueuesDetails[taskQueueSid]
                            .friendlyName
                        }
                      </div>
                    );
                  }
                )}
              </td>
              <td>
                {Object.keys(syncMapData.taskQueuesDetails).map(
                  (taskQueueSid) => {
                    return (
                      <div key={taskQueueSid} className="">
                        {
                          syncMapData.taskQueuesDetails[taskQueueSid]
                            .activeTasks
                        }
                      </div>
                    );
                  }
                )}
              </td>
              <td>
                {Object.keys(syncMapData.taskQueuesDetails).map(
                  (taskQueueSid) => {
                    return (
                      <div key={taskQueueSid} className="">
                        {
                          syncMapData.taskQueuesDetails[taskQueueSid]
                            .waitingTasks
                        }
                      </div>
                    );
                  }
                )}
              </td>
              <td>
                {Object.keys(syncMapData.taskQueuesDetails).map(
                  (taskQueueSid) => {
                    return (
                      <div key={taskQueueSid} className="">
                        {
                          syncMapData.taskQueuesDetails[taskQueueSid]
                            .longestTaskWaitingAge
                        }{' '}
                        s
                      </div>
                    );
                  }
                )}
              </td>
              <td>
                <div className="flex gap-4">
                  <div className="">
                    <div className="font-inter font-bold text-[#22C55E]">
                      {Object.keys(syncMapData.taskQueuesDetails).map(
                        (taskQueueSid) => {
                          return (
                            <div key={taskQueueSid} className="w-[120px]">
                              {
                                syncMapData.taskQueuesDetails[taskQueueSid]
                                  .availableWorkers
                              }{' '}
                              Available
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                  <div className="">
                    <div className="font-inter  font-bold text-[#B91C1C] ">
                      {Object.keys(syncMapData.taskQueuesDetails).map(
                        (taskQueueSid) => {
                          return (
                            <div key={taskQueueSid} className="w-[120px]">
                              {
                                syncMapData.taskQueuesDetails[taskQueueSid]
                                  .unavailableWorkers
                              }{' '}
                              Unavailable
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                  <div className="">
                    <div className="font-inter  font-bold text-[#404040] ">
                      {Object.keys(syncMapData.taskQueuesDetails).map(
                        (taskQueueSid) => {
                          return (
                            <div key={taskQueueSid} className="w-[120px]">
                              {
                                syncMapData.taskQueuesDetails[taskQueueSid]
                                  .offlineWorkers
                              }{' '}
                              Offline
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  initialSyncMapData: SyncMapData;
}> = async () => {
  const syncMapsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/syncMaps`,
    {
      method: 'GET',
    }
  );
  const syncMapsData = await syncMapsResponse.json();
  const syncMaps = syncMapsData.syncMaps;

  let syncMapItems: SyncMapItemInstance[] = [];
  if (syncMaps.length > 0) {
    const syncMapSid = syncMaps[0].sid;
    const syncMapItemsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/syncMapItems?syncMapSid=${syncMapSid}`,
      {
        method: 'GET',
      }
    );
    const syncMapItemsData = await syncMapItemsResponse.json();
    syncMapItems = syncMapItemsData.syncMapItems;
  }

  let initialSyncMapData: SyncMapData = initialSyncMapDummyData;

  for (const syncMapItem of syncMapItems) {
    const { key, data } = syncMapItem;
    if (key === 'tasks') {
      initialSyncMapData.tasks = data;
    } else if (key === 'workers') {
      initialSyncMapData.workers = data;
    } else if (key === 'taskQueuesDetails') {
      initialSyncMapData.taskQueuesDetails = data;
    }
  }

  return {
    props: {
      initialSyncMapData,
    },
  };
};
