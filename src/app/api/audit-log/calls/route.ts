import { NextResponse } from 'next/server';
import { CallInstance } from 'twilio/lib/rest/api/v2010/account/call';

import { formatDate } from '@/lib/utils';
import twilioClient from '@/lib/server/comms/twilioClient';

type Call = {
  id: string;
  direction: string;
  from: string | null;
  to: string | null;
  timestamp: string;
};

const DEFAULT_LIMIT = 20;

/**
 * Handles GET requests to `/api/audit-log/calls`
 * 
 * This function fetches the call logs from Twilio and returns them in a
 * format that can be consumed by the frontend.
 */
export async function GET() {
  // TODO: Add limit and page query parameters to support pagination
  try {
    const calls: CallInstance[] = await twilioClient.calls.list({
      limit: DEFAULT_LIMIT,
    });
    //if want to display all calls, can delete the limit parameter
    const formattedCalls: Call[] = calls.map((call) => {
      const date = new Date(call.dateCreated);
      const formattedDate = formatDate(date, 'YYYY-MM-DD HH:mm');
      return {
        id: call.sid,
        from: call.from,
        to: call.to,
        direction: call.direction,
        timestamp: formattedDate,
      };
    });
    return NextResponse.json(formattedCalls);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching call logs' },
      { status: 500 },
    );
  }
}

export const dynamic = 'force-dynamic';
