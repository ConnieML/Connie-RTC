import { NextApiRequest, NextApiResponse } from 'next';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const resp = new VoiceResponse();
  if (req.body.To === process.env.TWILIO_CALLER_ID) {
    console.log('RAN');
    // Receiving an incoming call to our Twilio number
    fetch(
      'https://studio.twilio.com/v2/Flows/FW0d77e6558b048c510c9977ed2cd2c940/Executions',
      {
        method: 'POST',
        body: JSON.stringify({
          From: process.env.TWILIO_CALLER_ID,
          To: '9132441797',
        }),
      }
    );
  } else if (req.body.To) {
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
