import { NextApiRequest, NextApiResponse } from 'next';
import { config as dotenvConfig } from 'dotenv';
import { Client } from 'twilio/lib/base/BaseTwilio';

dotenvConfig();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = new Client(accountSid, authToken);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET' || req.method === 'POST') {
    // Respond to assignment callbacks with an acceptance and 200 response
    console.log('HIIII');
    const ret = `{"instruction": "dequeue", "from":"${process.env.TWILIO_CALLER_ID}", "post_work_activity_sid":"WA79401126500f72d0ca54cae16ec41789"}`;
    res.status(200).json(JSON.parse(ret));
  } else {
    res.status(405).end();
  }
}
