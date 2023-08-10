import { NextApiRequest, NextApiResponse } from 'next';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const resp = new VoiceResponse();
  if (req.body.To) {
    console.log(req.body.To);
    // Placing an outbound call from the Twilio client
    const dial = resp.dial(
      { callerId: process.env.TWILIO_CALLER_ID },
      req.body.To
    );
  } else {
    resp.say('Thanks for calling!');
  }

  res.setHeader('Content-Type', 'text/xml');

  res.status(200).send(resp.toString());
}
