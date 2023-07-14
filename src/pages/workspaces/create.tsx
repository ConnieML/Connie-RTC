import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { WorkspaceListInstanceCreateOptions } from 'twilio/lib/rest/taskrouter/v1/workspace'
import { callbackEventsData } from '@/lib/callbackEventsData'

export default function CreateWorkspace() {
  const router = useRouter()
  const [allEvents, setAllEvents] = useState<boolean>(true)
  const [selectAll, setSelectAll] = useState<boolean>(true)
  const [callbackEvents, setCallbackEvents] =
    useState<
      Record<string, { description: string; eventId: string; enabled: boolean }>
    >(callbackEventsData)

  const [workspace, setWorkspace] =
    useState<WorkspaceListInstanceCreateOptions>({
      friendlyName: '',
      template: 'FIFO', // equivalent to 'Standard Workspace'
      eventCallbackUrl: '',
      eventsFilter: '', // default to all events enabled
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callbackEvents])

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
      <div className="mb-12 leading-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Workspace</h1>

        <p className="mt-2 text-sm text-gray-600">
          A TaskRouter Workspace is the top-level container for all other
          TaskRouter resources. It comprises of Workers, Task Queues, and
          Workflows for a TaskRouter application.
        </p>
      </div>

      <div className="grid grid-cols-1 mt-5 gap-x-6 gap-y-5 sm:grid-cols-6">
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
            htmlFor="template"
            className="block text-sm font-bold leading-6 text-gray-900"
          >
            <span className="text-red-600">* </span>Template
          </label>
          <div className="mt-2">
            <select
              id="template"
              name="template"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-4xl sm:text-sm sm:leading-6"
              onChange={updateworkspace}
            >
              <option value={'FIFO'}>Standard Workspace</option>
              <option value={'NONE'}>Custom</option>
            </select>
          </div>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            By default, Twilio will create a Workspace with queues and workflows
            to support common operations.
          </p>
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
          <h3 className="block text-sm font-bold leading-6 text-gray-900">
            <span className="text-red-600">* </span>Callback Events
          </h3>

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
              className="block text-sm leading-6 text-gray-900"
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
              className="block text-sm leading-6 text-gray-900"
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
                className="font-semibold text-gray-900 disabled:text-gray-600"
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

            // Create new workspace
            const response = await fetch(`/api/workspaces`, {
              method: 'POST',
              body: JSON.stringify(workspace),
            })
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
      </div>
    </div>
  )
}
