import { NextApiRequest, NextApiResponse } from 'next';
import Twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const workspaceSid = process.env.TWILIO_WORKSPACE_SID || '';
const workflowSid = process.env.TWILIO_WORKFLOW_SID;

const client = Twilio(accountSid, authToken);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const digitPressed = req.body.Digits;
    const language = digitPressed === '1' ? 'es' : 'en';

    const taskAttributes = JSON.stringify({ selected_language: language });

    try {
      const resp = await client.taskrouter.v1.workspaces(workspaceSid).tasks.create({
        workflowSid,
        attributes: taskAttributes,
      });

      res.status(200).json(resp);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong.' });
    }
  } else {
    res.status(405).end();
  }
}
