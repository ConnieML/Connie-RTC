import { type NextRequest } from "next/server";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";

export async function POST(req: NextRequest) {
  // const accountSid = process.env.TWILIO_ACCOUNT_SID;
  // const authToken = process.env.TWILIO_AUTH_TOKEN;
  // const client = require("twilio")(accountSid, authToken);

  const resp = new VoiceResponse();

  try {
    const queryString = await req.text();
    const params = new URLSearchParams(queryString);
    const bodyTo = params.get("To");

    if (bodyTo) {
      // client.calls
      //   .create({
      //     url: "http://demo.twilio.com/docs/voice.xml",
      //     to: """,
      //     from: "",
      //   })
      //   .then((call: { sid: any }) => console.log(call.sid));

      // Placing an outbound call from the Twilio client
      const dial = resp.dial({ callerId: process.env.TWILIO_CALLER_ID });
      dial.number(bodyTo);
    } else {
      resp.say("Thanks for calling!");
    }

    return new Response(resp.toString(), {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);

    // Handle the error and return an appropriate response
    return new Response("Voice error", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
