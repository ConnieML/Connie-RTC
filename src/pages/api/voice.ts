import { NextApiRequest, NextApiResponse } from 'next';
import { VoiceResponse, Gather, Dial } from 'twilio/lib/twiml/VoiceResponse';

const twilio_number = process.env.TWILIO_CALLER_ID;


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const resp = new VoiceResponse();

    if (req.body.To === twilio_number) {
      // Receiving an incoming call to our Twilio number
      const dial = "new Dial()";
      resp.append(dial);
    } else if (req.body.To) {
      // Placing an outbound call from the Twilio client
      const dial = new Dial({ callerId: twilio_number });
      // wrap the phone number or client name in the appropriate TwiML verb
      // by checking if the number given has only digits and format symbols
      const phone_pattern = /^\+?\d+$/;
      if (phone_pattern.test(req.body.To)) {
        dial.number(req.body.To);
      } else {
        dial.client(req.body.To);
      }
      resp.append(dial);
    } else {
      resp.say('Thanks for calling!');
    }

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(resp.toString());
}
