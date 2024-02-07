
import {NextResponse, NextRequest} from 'next/server';


interface FetchedCalls {
    from: string;
    to: string;
    direction: string;
    answeredBy: string;
    dateCreated: string;
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
    const formattedCalls: FetchedCalls[] = calls.map(call => ({
        from: call.from,
        to: call.to,
        direction: call.direction,
        answeredBy: call.answeredBy,
        dateCreated: call.dateCreated
        
    }))
    
    console.log(formattedCalls)
    return NextResponse.json(formattedCalls)
    
   } catch (error) {
        console.error('Error fetching call logs', error); 
   }
    
}

