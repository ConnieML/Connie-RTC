import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET' || req.method === 'POST') {
    // Respond to assignment callbacks with an acceptance and 200 response
    const ret = `{"instruction": "dequeue", "from":"${process.env.TWILIO_CALLER_ID}"}`;
    res.status(200).json(JSON.parse(ret));
  } else {
    res.status(405).end();
  }
}
