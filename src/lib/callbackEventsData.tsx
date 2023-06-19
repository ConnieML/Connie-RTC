export const callbackEventsData: Record<
  string,
  { description: string; eventId: string; enabled: boolean }
> = {
  'Task Created': {
    description: 'A task item is added to a Workspace',
    eventId: 'task.created',
    enabled: true,
  },
  'Task Completed': {
    description: 'A task has been completed',
    eventId: 'task.completed',
    enabled: true,
  },
  'Task Canceled': {
    description: 'A task has been canceled',
    eventId: 'task.canceled',
    enabled: true,
  },
  'Task Deleted': {
    description: 'A task has been deleted',
    eventId: 'task.deleted',
    enabled: true,
  },
  'Task Updated': {
    description: "A task's attributes have been changed",
    eventId: 'task.updated',
    enabled: true,
  },
  'Task Wrapup': {
    description: 'A task is updated to wrapping',
    eventId: 'task.wrapup',
    enabled: true,
  },
  'Transfer Initiated': {
    description:
      'A Transfer has been initiated of the Task from one Worker to another',
    eventId: 'task.transfer-initiated',
    enabled: true,
  },
  'Transfer Failed': {
    description:
      'A Transfer has failed because the Task was canceled or the Worker it was transferred to rejected the Reservation.',
    eventId: 'task.transfer-failed',
    enabled: true,
  },
  'Transfer Attempt Failed': {
    description:
      'A Transfer attempt failed because the Worker rejected the Reservation for it.',
    eventId: 'task.transfer-attempt-failed',
    enabled: true,
  },
  'Transfer Completed': {
    description: 'A Transfer was completed',
    eventId: 'task.transfer-completed',
    enabled: true,
  },
  'Transfer Canceled': {
    description: 'A Transfer was canceled',
    eventId: 'task.transfer-canceled',
    enabled: true,
  },
  'Task Queue Created': {
    description: 'A Task Queue has been created',
    eventId: 'task-queue.created',
    enabled: true,
  },
  'Task Queue Deleted': {
    description: 'A Task Queue has been deleted',
    eventId: 'task-queue.deleted',
    enabled: true,
  },
  'Task Queue Entered': {
    description: 'A newly created task is added to a queue',
    eventId: 'task-queue.entered',
    enabled: true,
  },
  'Task Queue Target Workers Expression Updated': {
    description: "A Task Queue's TargetWorkers Expression has been updated",
    eventId: 'task-queue.expression.updated',
    enabled: true,
  },
  'Task Queue Moved': {
    description: 'A task has been moved from this queue to a new queue',
    eventId: 'task-queue.moved',
    enabled: true,
  },
  'Task Queue Timeout': {
    description:
      'A task is moved from a queue because it was not processed within the timeout',
    eventId: 'task-queue.timeout',
    enabled: true,
  },
  'Task System Deleted': {
    description:
      'A Task has been purged from the system after it has reached terminal state',
    eventId: 'task.system-deleted',
    enabled: true,
  },
  'Reservation Created': {
    description: 'A task has been assigned to a worker',
    eventId: 'reservation.created',
    enabled: true,
  },
  'Reservation Accepted': {
    description: 'A task reservation is accepted by a worker',
    eventId: 'reservation.accepted',
    enabled: true,
  },
  'Reservation Rejected': {
    description: 'A task reservation is rejected by a worker',
    eventId: 'reservation.rejected',
    enabled: true,
  },
  'Reservation Timeout': {
    description:
      'A task reservation was not accepted/rejected within the reservation timeout',
    eventId: 'reservation.timeout',
    enabled: true,
  },
  'Reservation Canceled': {
    description: 'A pending task reservation is canceled',
    eventId: 'reservation.canceled',
    enabled: true,
  },
  'Reservation Rescinded': {
    description:
      'A pending reservation is canceled from a multi-reservation task',
    eventId: 'reservation.rescinded',
    enabled: true,
  },
  'Reservation Wrapup': {
    description: 'A Reservation has been wrapped up',
    eventId: 'reservation.wrapup',
    enabled: true,
  },
  'Reservation Completed': {
    description: 'An accepted reservation has completed',
    eventId: 'reservation.completed',
    enabled: true,
  },
  'Reservation Failed': {
    description: 'A Reservation could not be created',
    eventId: 'reservation.failed',
    enabled: true,
  },
  'Workflow Entered': {
    description: 'A task item has entered this workflow',
    eventId: 'workflow.entered',
    enabled: true,
  },
  'Workflow Timeout': {
    description:
      'A task item timed out for the workflow and was removed from the workspace',
    eventId: 'workflow.timeout',
    enabled: true,
  },
  'Workflow Skipped': {
    description: 'A Task has skipped forward to a new part of the Workflow',
    eventId: 'workflow.skipped',
    enabled: true,
  },
  'Workflow Target Matched': {
    description: 'A task item has matched a workflow target',
    eventId: 'workflow.target-matched',
    enabled: true,
  },
  'Worker Created': {
    description: 'A Worker was created',
    eventId: 'worker.created',
    enabled: true,
  },
  'Worker Deleted': {
    description: 'A Worker was deleted',
    eventId: 'worker.deleted',
    enabled: true,
  },
  'Worker Activity Updated': {
    description: "A worker's activity has been updated",
    eventId: 'worker.activity.update',
    enabled: true,
  },
  'Worker Attributes Updated': {
    description: "A worker's attributes are updated",
    eventId: 'worker.attributes.update',
    enabled: true,
  },
  'Worker Capacity Updated': {
    description: "A worker's configured capacity on a channel is updated",
    eventId: 'worker.capacity.update',
    enabled: true,
  },
  'Worker Channel Availability Updated': {
    description: "A worker's availability on a channel is updated",
    eventId: 'worker.channel.availability.update',
    enabled: true,
  },
}
