import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  // Type casting for phoneNumber, startTime & endTime when reading the query params
  const { phoneNumber, startTime, endTime } = req.query as {
    phoneNumber: string;
    startTime: string;
    endTime: string;
  };

  try {
    // Make startTimeAfter and startTimeBefore a Date object
    const calls = await client.calls.list({
      from: phoneNumber,
      startTimeAfter: new Date(startTime),
      startTimeBefore: new Date(endTime),
    });

    res.status(200).json(calls);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}


