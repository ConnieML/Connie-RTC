
import {NextResponse, NextRequest} from 'next/server';


interface FetchedCalls {
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
    console.log('success')
    const calls: any[] = await client.calls.list({limit:20});
    //if want to display all calls, can delete the limit parameter
    const formattedCalls: FetchedCalls[] = calls.map(call => {
        const date = new Date(call.dateCreated);
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
        const day = date.getUTCDate().toString().padStart(2, '0');
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    
        return {
            id: call.sid,
            from: call.from,
            to: call.to,
            direction: call.direction,
            timestamp: formattedDate // Use the formatted date string
        };
    });
    
    console.log(formattedCalls)
    return NextResponse.json(formattedCalls)
    
   } catch (error) {
        console.error('Error fetching call logs', error); 
   }
    
}

