
import {NextResponse, NextRequest} from 'next/server';


interface Calls {
    from: string;
    to: string;
    direction: string;
    answeredBy: string;
    dateCreated: Date | string;
}

export async function POST(
    request: NextRequest,
    res: NextResponse
) {
   const accountSid = process.env.TWILIO_ACCOUNT_SID;
   const authToken = process.env.TWILIO_AUTH_TOKEN;
   const client = require('twilio')(accountSid, authToken);
   try{
    console.log('success')
    const calls: any[] = await client.calls.list();
    const formattedCalls: Calls[] = calls.map(call => ({
        from: call.from,
        to: call.to,
        direction: call.direction,
        answeredBy: call.answered_by,
        dateCreated: call.date_created
        
    }))
    
    console.log(formattedCalls)
    return NextResponse.json(formattedCalls)
    
   } catch (error) {
        console.error('Error fetching call logs', error); 
   }
    
}

