export interface WorkersDetails {
    [sid: string]: {
        friendlyName: string;
        activityName: string;
    }
}

export interface TaskQueuesDetails {
    [sid: string]: {
        friendlyName: string;
        activeTasks: number;
        waitingTasks: number;
        longestTaskWaitingAge: number;
        availableWorkers: number;
        unavailableWorkers: number;
        offlineWorkers: number;
    }
}

export interface SyncMapData {
    tasks: {
        activeTasks: number;
        waitingTasks: number;
        longestTaskWaitingAge: number;
    };
    workers: {
        availableWorkers: number;
        unavailableWorkers: number;
        offlineWorkers: number;
        workersDetails: WorkersDetails;
    };
    taskQueuesDetails: TaskQueuesDetails;
}

export interface WorkerActivityStat {
    friendly_name: string;
    workers: number;
    sid: string;
}