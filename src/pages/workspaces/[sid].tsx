/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  WorkspaceContextUpdateOptions,
  WorkspaceInstance,
} from 'twilio/lib/rest/taskrouter/v1/workspace'
import { callbackEventsData } from '@/lib/callbackEventsData'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { ActivityInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/activity'

export default function UpdateWorkspace({
  currWorkspace,
  activities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const [multiTaskEnabled, setMultiTaskEnabled] = useState<boolean>(
    currWorkspace.multiTaskEnabled
  )
  const [allEvents, setAllEvents] = useState<boolean>(
    currWorkspace.eventsFilter === ''
  )
  const [selectAll, setSelectAll] = useState<boolean>(
    currWorkspace.eventsFilter === ''
  )
  const [callbackEvents, setCallbackEvents] = useState<
    Record<string, { description: string; eventId: string; enabled: boolean }>
  >(
    currWorkspace.eventsFilter
      ? callbackEventsData
      : Object.entries(callbackEventsData).reduce(
          (
            acc: Record<
              string,
              { description: string; eventId: string; enabled: boolean }
            >,
            [key, value]
          ) => {
            acc[key] = {
              ...value,
              enabled: currWorkspace.eventsFilter
                .split(',')
                .includes(value.eventId),
            }
            return acc
          },
          {}
        )
  )

  const [workspace, setWorkspace] = useState<WorkspaceContextUpdateOptions>({
    friendlyName: currWorkspace.friendlyName,
    defaultActivitySid: currWorkspace.defaultActivitySid,
    timeoutActivitySid: currWorkspace.timeoutActivitySid,
    prioritizeQueueOrder: currWorkspace.prioritizeQueueOrder,
    multiTaskEnabled: currWorkspace.multiTaskEnabled,
    eventCallbackUrl: currWorkspace.eventCallbackUrl,
    eventsFilter: currWorkspace.eventsFilter,
  })

  useEffect(() => {
    if (Object.values(callbackEvents).every((value) => value.enabled)) {
      setSelectAll(true)
      setWorkspace({
        ...workspace,
        eventsFilter: '',
      })
    } else {
      setSelectAll(false)
      const enabledEvents = Object.keys(callbackEvents)
        .filter((key) => callbackEvents[key].enabled)
        .map((key) => callbackEvents[key].eventId)
        .join(',')
      setWorkspace({
        ...workspace,
        eventsFilter: enabledEvents,
      })
    }
  }, [callbackEvents])

  useEffect(() => {
    setWorkspace({
      ...workspace,
      multiTaskEnabled,
    })
  }, [multiTaskEnabled])

  function updateworkspace(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ): void {
    setWorkspace({
      ...workspace,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div className="px-4 mx-auto mt-32 max-w-7xl sm:px-6 lg:px-8">
      <h1 className="mb-12 text-3xl font-bold leading-6 text-gray-900">
        Workspace Settings
      </h1>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label
            htmlFor="friendlyName"
            className="block text-sm font-bold leading-6 text-gray-900"
          >
            <span className="text-red-600">* </span>Workspace Name
          </label>
          <div className="mt-2">
            <input
              id="friendlyName"
              name="friendlyName"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              value={workspace.friendlyName}
              onChange={updateworkspace}
            />
          </div>
        </div>

        <div className="sm:col-span-4">
          <label
            htmlFor="sid"
            className="block text-sm font-bold leading-6 text-gray-900"
          >
            Workspace SID
          </label>
          <div className="mt-2">
            <input
              id="sid"
              name="sid"
              type="text"
              className="block w-full rounded-md border-0 bg-gray-100 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              value={currWorkspace.sid}
              disabled
            />
          </div>
        </div>

        <div className="sm:col-span-4">
          <label
            htmlFor="defaultActivitySid"
            className="block text-sm font-bold leading-6 text-gray-900"
          >
            <span className="text-red-600">* </span>Default Activity
          </label>
          <div className="mt-2">
            <select
              id="defaultActivitySid"
              name="defaultActivitySid"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-4xl sm:text-sm sm:leading-6"
              value={workspace.defaultActivitySid}
              onChange={updateworkspace}
            >
              {activities.map((activity: ActivityInstance) => (
                <option key={activity.sid} value={activity.sid}>
                  {activity.friendlyName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sm:col-span-4">
          <label
            htmlFor="timeoutActivitySid"
            className="block text-sm font-bold leading-6 text-gray-900"
          >
            <span className="text-red-600">* </span>Timeout Activity
          </label>
          <div className="mt-2">
            <select
              id="timeoutActivitySid"
              name="timeoutActivitySid"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-4xl sm:text-sm sm:leading-6"
              value={workspace.timeoutActivitySid}
              onChange={updateworkspace}
            >
              {activities.map((activity: ActivityInstance) => (
                <option key={activity.sid} value={activity.sid}>
                  {activity.friendlyName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sm:col-span-4">
          <label
            htmlFor="prioritizeQueueOrder"
            className="block text-sm font-bold leading-6 text-gray-900"
          >
            <span className="text-red-600">* </span>Order Priority
          </label>
          <div className="mt-2">
            <select
              id="prioritizeQueueOrder"
              name="prioritizeQueueOrder"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-4xl sm:text-sm sm:leading-6"
              value={workspace.prioritizeQueueOrder}
              onChange={updateworkspace}
            >
              <option value={'FIFO'}>First In, First Out</option>
              <option value={'LIFO'}>Last In, First Out</option>
            </select>
          </div>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            If Workers are shared between FIFO and LIFO Task Queues, then Order
            Priority determines whether to prioritize the FIFO or LIFO Task
            Queues first.
          </p>
        </div>

        <div className="sm:col-span-4">
          <h3 className="block text-sm font-bold leading-6 text-gray-900">
            <span className="text-red-600">* </span>Multitasking
          </h3>
          <p className="text-sm leading-6 text-gray-500">
            Multitasking allows Workers to handle multiple tasks simultaneously.
            You can control each Worker&apos;s capacity for tasks of different
            types.
          </p>

          <div className="mt-2 space-y-2">
            <div className="relative flex gap-x-3">
              <div className="flex items-center h-6">
                <input
                  id="multiTaskEnabled"
                  name="multiTaskEnabled"
                  type="radio"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                  checked={multiTaskEnabled}
                  onChange={() => setMultiTaskEnabled(true)}
                />
              </div>
              <div className="text-sm leading-6">
                <label htmlFor="multiTaskEnabled" className="text-gray-900">
                  Enabled
                </label>
                <p className="text-gray-500">
                  Multitasking allows Workers to handle multiple tasks
                  simultaneously. You can control each Worker&apos;s capacity
                  for tasks of different types.
                </p>
              </div>
            </div>

            <div className="relative flex gap-x-3">
              <div className="flex items-center h-6">
                <input
                  id="multiTaskDisabled"
                  name="multiTaskDisabled"
                  type="radio"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                  checked={!multiTaskEnabled}
                  onChange={() => setMultiTaskEnabled(false)}
                />
              </div>
              <div className="text-sm leading-6">
                <label htmlFor="multiTaskDisabled" className="text-gray-900">
                  Disabled
                </label>
                <p className="text-gray-500">
                  Multitasking is disabled. Each Worker will only receive a new
                  Reservation when the previous Task is completed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="mt-3 text-xl font-bold leading-6 text-gray-900 sm:col-span-4">
          Event Callbacks
        </h2>

        <div className="sm:col-span-4">
          <label
            htmlFor="eventCallbackUrl"
            className="block text-sm font-bold leading-6 text-gray-900"
          >
            Event Callback URL
          </label>
          <div className="mt-2">
            <input
              id="eventCallbackUrl"
              name="eventCallbackUrl"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              value={workspace.eventCallbackUrl}
              onChange={updateworkspace}
            />
          </div>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Optional. Events will be sent when a callback URL is provided.
          </p>
        </div>

        <div className="space-y-2 sm:col-span-4">
          <p className="block text-sm font-bold leading-6 text-gray-900">
            <span className="text-red-600">* </span>Callback Events
          </p>

          <div className="flex items-center gap-x-3">
            <input
              id="all-events"
              name="event-option"
              type="radio"
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
              checked={allEvents}
              onChange={() => {
                setAllEvents(true)
                setCallbackEvents(callbackEventsData)
              }}
            />
            <label
              htmlFor="all-events"
              className="block text-sm font-bold leading-6 text-gray-900"
            >
              All events
            </label>
          </div>

          <div className="flex items-center gap-x-3">
            <input
              id="specific-events"
              name="event-option"
              type="radio"
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
              checked={!allEvents}
              onChange={() => setAllEvents(false)}
            />
            <label
              htmlFor="specific-events"
              className="block text-sm font-bold leading-6 text-gray-900"
            >
              Specific events
            </label>
          </div>
        </div>

        <div className="space-y-2 sm:col-span-4">
          <p className="block text-sm font-bold leading-6 text-gray-900">
            Select Events
          </p>

          <div className="relative flex gap-x-3">
            <div className="flex items-center h-6">
              <input
                id="select-all"
                name="select-all"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600 disabled:text-gray-300"
                checked={selectAll}
                disabled={allEvents}
                onChange={() => {
                  setSelectAll(!selectAll)
                  setCallbackEvents(
                    Object.keys(callbackEvents).reduce(
                      (
                        acc: Record<
                          string,
                          {
                            description: string
                            eventId: string
                            enabled: boolean
                          }
                        >,
                        key
                      ) => {
                        acc[key] = {
                          ...callbackEvents[key],
                          enabled: !selectAll,
                        }
                        return acc
                      },
                      {}
                    )
                  )
                }}
              />
            </div>
            <div className="text-sm leading-6">
              <label
                htmlFor="select-all"
                className="font-medium text-gray-900 disabled:text-gray-600"
              >
                Select all
              </label>
            </div>
          </div>

          {Object.keys(callbackEvents).map((key) => (
            <div className="relative flex gap-x-3" key={key}>
              <div className="flex items-center h-6">
                <input
                  id={key}
                  name={key}
                  type="checkbox"
                  className="w-4 h-4 ml-2 text-blue-600 border-gray-300 rounded focus:ring-blue-600 disabled:text-gray-300"
                  checked={callbackEvents[key].enabled}
                  disabled={allEvents}
                  onChange={() => {
                    setCallbackEvents({
                      ...callbackEvents,
                      [key]: {
                        ...callbackEvents[key],
                        enabled: !callbackEvents[key].enabled,
                      },
                    })
                  }}
                />
              </div>
              <div className="text-sm leading-6">
                <label
                  htmlFor={key}
                  className="font-medium text-gray-900 disabled:text-gray-600"
                >
                  {key}
                </label>
                <p className="text-gray-500">
                  {callbackEvents[key].description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-start my-10 gap-x-6">
        <button
          type="submit"
          className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={async () => {
            // Form validations
            if (!workspace.friendlyName) {
              alert('Workspace name cannot be empty.')
              return
            }
            if (
              Object.values(callbackEvents).every((value) => !value.enabled)
            ) {
              alert(
                'Select at least one event. To fully disable event callbacks, leave the Event callback URL empty.'
              )
              return
            }
            if (workspace.eventCallbackUrl) {
              try {
                new URL(workspace.eventCallbackUrl)
              } catch (e) {
                alert('Invalid URL.')
                return
              }
            }

            // Create new workspace
            const response = await fetch(
              `/api/workspaces?sid=${currWorkspace.sid}`,
              {
                method: 'PUT',
                body: JSON.stringify(workspace),
              }
            )
            const data = await response.json()
            if (data.error) {
              console.error(data.error)
              return
            }
            router.push('/workspaces')
          }}
        >
          Save
        </button>
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => router.push('/workspaces')}
        >
          Cancel
        </button>
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-red-600"
          onClick={() => {
            // Passing SID as a query param instead of in the body due to a Next 13 bug that prevents the body of DELETE requests to be read
            fetch(`/api/workspaces?sid=${currWorkspace.sid}`, {
              method: 'DELETE',
            }).then(() => {
              router.push('/workspaces')
            })
          }}
        >
          Delete this Workspace
        </button>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { sid } = context.query

  // Fetch the current workspace's data
  const workspacesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/workspaces?sid=${sid}`,
    {
      method: 'GET',
    }
  )
  const workspacesData = await workspacesResponse.json()
  const currWorkspace: WorkspaceInstance = workspacesData.workspace

  // Fetch the current workspace's activities
  const activitiesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/activities?workspaceSid=${sid}`,
    {
      method: 'GET',
    }
  )
  const activitiesData = await activitiesResponse.json()
  const activities: ActivityInstance[] = activitiesData.activities

  return {
    props: { currWorkspace, activities },
  }
}
