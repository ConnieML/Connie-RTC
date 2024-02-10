
import {NextResponse, NextRequest} from 'next/server';


interface FetchedMessage {
    id: string;
    from: string;
    to: string;
    direction: string;
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
    const messages: any[] = await client.messages.list({limit:20});
    //if want to display all calls, can delete the limit parameter
    const formattedMessages: FetchedMessage[] = messages.map(message => {
        const date = new Date(message.dateCreated);
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
        const day = date.getUTCDate().toString().padStart(2, '0');
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

        return{
            id: message.sid,
            direction: message.direction,
            from: message.from,
            to: message.to,
            timestamp: formattedDate
        }
    
        
    })
    
    // console.log(formattedMessages)
    return NextResponse.json(formattedMessages)
    
   } catch (error) {
        console.error('Error fetching message logs', error); 
   }
    
}

