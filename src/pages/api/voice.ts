import { NextApiRequest, NextApiResponse } from 'next';
<<<<<<< HEAD
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

const twilio_number = process.env.TWILIO_PHONE_NUMBER;
=======
import VoiceResponse, { Gather, Dial } from 'twilio/lib/twiml/VoiceResponse';
>>>>>>> origin/develop

const twilio_number = process.env.TWILIO_CALLER_ID as string;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const resp = new VoiceResponse();
<<<<<<< HEAD
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
=======

  // if (req.body.To === twilio_number) {
  //   // Receiving an incoming call to our Twilio number
  //   const dial = 'new Dial()';
  //   resp.append(dial);
  // } else if (req.body.To) {
  //   // Placing an outbound call from the Twilio client
  //   const dial = new Dial({ callerId: twilio_number });
  //   // wrap the phone number or client name in the appropriate TwiML verb
  //   // by checking if the number given has only digits and format symbols
  //   const phone_pattern = /^\+?\d+$/;
  //   if (phone_pattern.test(req.body.To)) {
  //     dial.number(req.body.To);
  //   } else {
  //     dial.client(req.body.To);
  //   }
  //   resp.append(dial);
  // } else {
  //   resp.say('Thanks for calling!');
  // }
>>>>>>> origin/develop

  res.setHeader('Content-Type', 'text/xml');

  res.status(200).send(resp.toString());
}
