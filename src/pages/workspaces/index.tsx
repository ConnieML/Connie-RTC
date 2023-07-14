import { PencilIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { WorkspaceInstance } from 'twilio/lib/rest/taskrouter/v1/workspace'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

export default function Workspaces({
  workspaces,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  return (
    <div className="px-4 mx-auto mt-32 max-w-7xl sm:px-6 lg:px-8">
      <div className="mb-12 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold leading-6 text-gray-900">
            Workspaces
          </h1>
        </div>
        <div className="sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="block px-3 py-2 text-sm font-semibold text-center text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={() => {
              router.push('/workspaces/create')
            }}
          >
            + &nbsp;Create new Workspace
          </button>
        </div>
      </div>

      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-bold text-gray-900 sm:pl-3"
                  >
                    Workspace
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-bold text-gray-900"
                  >
                    Default Activity
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-bold text-gray-900"
                  >
                    Timeout Activity
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-bold text-gray-900"
                  >
                    Event Callback URL
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                    <span className="sr-only">Settings</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {workspaces.map((workspace) => (
                  <tr key={workspace.sid} className="even:bg-gray-100">
                    <td className="px-3 py-5 text-sm text-gray-500 whitespace-nowrap">
                      <div className="text-gray-900">
                        {workspace.friendlyName}
                      </div>
                      <div className="mt-1">
                        <span className="text-gray-500">SID:&nbsp;</span>
                        <span className="font-mono">{workspace.sid}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {workspace.defaultActivityName}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {workspace.timeoutActivityName}
                    </td>
                    <td className="px-3 py-4 text-sm text-blue-600 whitespace-nowrap hover:text-blue-900">
                      <a href={workspace.eventCallbackUrl}>
                        {workspace.eventCallbackUrl}
                      </a>
                    </td>
                    <td className="px-3 py-4">
                      <PencilIcon
                        className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-900"
                        aria-hidden="true"
                        onClick={() =>
                          router.push(`/workspaces/${workspace.sid}`)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<{
  workspaces: WorkspaceInstance[]
}> = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/workspaces`,
    {
      method: 'GET',
    }
  )
  const data = await response.json()
  const workspaces = data.workspaces
  return {
    props: { workspaces },
  }
}
