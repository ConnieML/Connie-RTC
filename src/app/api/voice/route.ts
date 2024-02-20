import { type NextRequest } from 'next/server';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

export async function POST(req: NextRequest) {
  const callerId = process.env.TWILIO_CALLER_ID;
  const workflowSid = process.env.TWILIO_WORKFLOW_SID;

  const resp = new VoiceResponse();

  try {
    const queryString = await req.text();
    const params = new URLSearchParams(queryString);
    const bodyTo = params.get("To");
    const bodyFrom = params.get("From") || undefined;

    // If the request to the /voice endpoint is TO your Twilio Number,
    // then it is an incoming call towards your Twilio.Device.
    if (bodyTo == callerId) {
      // TODO: Implement
      // Incoming call
      resp.say("Please hold");
      // Add call to task queue
      resp.enqueue({ workflowSid: workflowSid });
      // const dial = resp.dial({ callerId: bodyFrom });
      // dial.client('atsarapk@uwaterloo.ca');

    } else if (bodyTo) {
      // Outgoing call
      const dial = resp.dial({ callerId });
      dial.number({}, bodyTo);
    } else {
      resp.say('Thanks for calling!');
    }

    return new Response(resp.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Error processing request:', error);

    // Handle the error and return an appropriate response
    return new Response('Voice error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
