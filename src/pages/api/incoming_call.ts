import { NextApiRequest, NextApiResponse } from 'next';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const callerId = process.env.TWILIO_CALLER_ID;
const workspaceSid = process.env.TWILIO_WORKSPACE_SID;
const workflowSid = process.env.TWILIO_WORKFLOW_SID;

import { Twilio } from 'twilio';

const client = new Twilio(accountSid, authToken);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const { To } = req.body;

  if (To !== callerId) {
    const voiceResponse = new VoiceResponse();

    // Placing an outbound call from the Twilio client
    const dial = voiceResponse.dial({ callerId });
    dial.number(To);

    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(voiceResponse.toString());
    return;
  }

  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    numDigits: 1,
    action: '/api/enqueue_call',
    method: 'POST',
    timeout: 5,
  });

  // Use <Say> element within <Gather> directly with type assertion
  (gather as any).say({ language: 'es' }, 'Para Español oprime el uno.');
  (gather as any).say({ language: 'en' }, 'For English, please hold or press two.');

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(voiceResponse.toString());
}
