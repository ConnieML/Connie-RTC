
import {NextResponse, NextRequest} from 'next/server';

interface Activity {
    sid: string
}

// export async function POST(
//     request: Request,
//     respones: Response
// ) {
    
//     const accountSid = process.env.TWILIO_ACCOUNT_SID;
//     const authToken = process.env.TWILIO_AUTH_TOKEN;
//     const client = require('twilio')(accountSid, authToken);


//     client.taskrouter.v1.workspaces('WSd8100ebc4d3482bc08bd668af5f45c8a')
//                     .workers('WK1cfbadb8437bf21e5719d5b2358db96d')
//                     .update({
//                        activitySid: 'WAd9d119cdf4ac2d6a37c372ea05029717'
//                      })
//                     .then((worker: any) => console.log(worker.activityName));
    

    
// }

// import { NextApiRequest, NextApiResponse } from 'next';
// import twilio from 'twilio';

interface Activity {
    sid: string;
}

export async function POST(
    request: NextRequest,
    response: NextResponse
) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    try {
        const worker = await client.taskrouter.v1.workspaces('WSd8100ebc4d3482bc08bd668af5f45c8a')
                                  .workers('WK1cfbadb8437bf21e5719d5b2358db96d')
                                  .update({
                                      activitySid: 'WA387cdc981874d6497a7658e6832d20a7'
                                  });

        console.log(worker.activityName);
        return NextResponse.json(worker.activityName)
    } catch (error) {
        console.error('Failed to update worker:', error);
        
    }
}

