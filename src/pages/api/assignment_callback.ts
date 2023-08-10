import { NextApiRequest, NextApiResponse } from 'next';

// Type can be found here: https://www.twilio.com/docs/taskrouter/handle-assignment-callbacks
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    AccountSid: string;
    WorkspaceSid: string;
    WorkflowSid: string;
    TaskQueueSid: string;
    WorkerSid: string;
    WorkerAttributes: string; // More info here: https://www.twilio.com/docs/taskrouter/api/worker
    TaskSid: string;
    TaskAttributes: string; // More info here: https://www.twilio.com/docs/taskrouter/api/task#task-attributes
    TaskAge: string;
    TaskPriority: string;
    ReservedSid: string;
  };
}
// TODO: Figure out how to type req.body
export default function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET' || req.method === 'POST') {
    const taskAttributes = JSON.parse(req.body.TaskAttributes);

    // Respond to assignment callbacks with an acceptance and 200 response
    const ret = `{"instruction": "dequeue", "from":"${taskAttributes.caller}"}`;
    res.status(200).json(JSON.parse(ret));
  } else {
    res.status(405).end();
  }
}
