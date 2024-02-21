import { NextResponse } from 'next/server';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

import { formatDate } from '@/lib/utils';
import twilioClient from '@/lib/server/comms/twilioClient';

type Message = {
  id: string;
  from: string;
  to: string;
  direction: string;
  timestamp: string;
};

const DEFAULT_LIMIT = 20;

/**
 * Handles GET requests to `/api/audit-log/messages`
 * 
 * This function fetches the message logs from Twilio and returns them in a
 * format that can be consumed by the frontend.
 */
export async function GET() {
  // TODO: Add limit and page query parameters to support pagination
  try {
    const messages: MessageInstance[] = await twilioClient.messages.list({
      limit: DEFAULT_LIMIT,
    });
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

    return NextResponse.json(formattedMessages);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching call logs' },
      { status: 500 },
    );
  }
}

export const dynamic = 'force-dynamic';
