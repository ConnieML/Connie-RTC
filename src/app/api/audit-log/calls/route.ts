import { NextResponse } from 'next/server';
import Twilio from 'twilio';
import { CallInstance } from 'twilio/lib/rest/api/v2010/account/call';

import { formatDate } from '@/lib/utils';

interface Calls {
  id: string;
  direction: string;
  from: string | null;
  to: string | null;
  timestamp: string;
}

const DEFAULT_LIMIT = 20;

/**
 * A rout
 *
 * Resource /api/audit-log/calls
 */
export async function GET() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = Twilio(accountSid, authToken);
  try {
    const calls: CallInstance[] = await client.calls.list({
      limit: DEFAULT_LIMIT,
    });
    //if want to display all calls, can delete the limit parameter
    const formattedCalls: Calls[] = calls.map((call) => {
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
    console.error('Error fetching call logs', error);
    return NextResponse.json(
      { message: 'Error fetching call logs' },
      { status: 500 },
    );
  }
}

export const dynamic = 'force-dynamic';
