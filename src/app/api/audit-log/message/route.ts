
import {NextResponse, NextRequest} from 'next/server';


interface FetchedMessage {
    from: string;
    to: string;
    direction: string;
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
    const messages: any[] = await client.messages.list({limit:20});
    //if want to display all calls, can delete the limit parameter
    const formattedMessages: FetchedMessage[] = messages.map(message => ({
        from: message.from,
        to: message.to,
        direction: message.direction,
        dateCreated: message.dateCreated
        
    }))
    
    console.log(formattedMessages)
    return NextResponse.json(formattedMessages)
    
   } catch (error) {
        console.error('Error fetching message logs', error); 
   }
    
}

