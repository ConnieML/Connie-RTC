import { NextApiRequest, NextApiResponse } from 'next';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

const twilio_number = process.env.TWILIO_PHONE_NUMBER;


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const resp = new VoiceResponse();
  if (req.body.To === twilio_number) {
    // Receiving an incoming call to our Twilio number
    const dial = resp.dial();
    dial.client('coolbeans');
    //resp.enqueue({waitUrl: 'wait-music.xml'}, 'support');
  } else if (req.body.To) {
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
