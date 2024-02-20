
import {NextResponse, NextRequest} from 'next/server';
import { formatDate } from '@/lib/utils';


interface Calls {
    id: string;
    direction: string;
    from: string | null;
    to: string | null;
    timestamp: string;
}

export async function GET(
    request: NextRequest,
    res: NextResponse
) {
   const accountSid = process.env.TWILIO_ACCOUNT_SID;
   const authToken = process.env.TWILIO_AUTH_TOKEN;
   const client = require('twilio')(accountSid, authToken);
   try{
    const calls: any[] = await client.calls.list({limit:20});
    //if want to display all calls, can delete the limit parameter
    const formattedCalls: Calls[] = calls.map(call => {
        const date = new Date(call.dateCreated);
        const formattedDate = formatDate(date, 'YYYY-MM-DD HH:mm')
    
        return {
            id: call.sid,
            from: call.from,
            to: call.to,
            direction: call.direction,
            timestamp: formattedDate // Use the formatted date string
        };
    });
    return NextResponse.json(formattedCalls)
    
   } catch (error) {
        console.error('Error fetching call logs', error); 
   }
    
}

export const dynamic = 'force-dynamic'

