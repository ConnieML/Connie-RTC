import { NextResponse } from 'next/server';
import Twilio from 'twilio';

import { formatDate } from '@/lib/utils';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

interface Message {
  id: string;
  from: string;
  to: string;
  direction: string;
  timestamp: string;
}

const DEFAULT_LIMIT = 20;

export async function GET() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = Twilio(accountSid, authToken);
  try {
    const messages: MessageInstance[] = await client.messages.list({ limit: DEFAULT_LIMIT });
    //if want to display all calls, can delete the limit parameter
    const formattedMessages: Message[] = messages.map((message) => {
      const date = new Date(message.dateCreated);
      const formattedDate = formatDate(date, 'YYYY-MM-DD HH:mm');
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
    console.error('Error fetching message logs', error);
  }
}

export const dynamic = 'force-dynamic';
