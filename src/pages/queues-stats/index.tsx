export default function QueuesStats() {
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
        </div>
    )
}