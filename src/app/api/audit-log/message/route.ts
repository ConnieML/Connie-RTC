import { NextRequest, NextResponse } from "next/server";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  from: string;
  to: string;
  direction: string;
  timestamp: string;
}

export async function GET(request: NextRequest, res: NextResponse) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  try {
    const messages: any[] = await client.messages.list({ limit: 20 });
    //if want to display all calls, can delete the limit parameter
    const formattedMessages: Message[] = messages.map((message) => {
      const date = new Date(message.dateCreated);
      const formattedDate = formatDate(date, "YYYY-MM-DD HH:mm");
      return {
        id: message.sid,
        direction: message.direction,
        from: message.from,
        to: message.to,
        timestamp: formattedDate,
      };
    });

    // console.log(formattedMessages)
    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("Error fetching message logs", error);
  }
}

export const dynamic = "force-dynamic";
