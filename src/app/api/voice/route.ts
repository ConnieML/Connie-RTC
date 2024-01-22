import { type NextRequest } from "next/server";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";

export async function POST(req: NextRequest) {
  const resp = new VoiceResponse();
  const body = await req.json();

  if (body.To) {
    console.log(body.To);
    // Placing an outbound call from the Twilio client
    const dial = resp.dial(
      { callerId: process.env.TWILIO_CALLER_ID },
      body.To
    );
  } else {
    resp.say("Thanks for calling!");
  }

  return new Response(resp.toString(), {
    status: 200,
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
