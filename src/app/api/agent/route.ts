
import {NextResponse, NextRequest} from 'next/server';

interface Activity {
    sid: string
}

export async function POST(
    request: NextRequest,
) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const workspaceSid = process.env.TWILIO_TASKROUTER_WORKSPACE_SID;
    //Need to update via Okta authentification
    const workerSid=process.env.TWILIO_WORKER_SID;
    const client = require('twilio')(accountSid, authToken);

    const body = await request.json()
    const {activitySid} = body;

    try {
        const worker = await client.taskrouter.v1.workspaces(workspaceSid)
                                  .workers(workerSid)
                                  .update({
                                      activitySid
                                  });

        console.log(worker.activityName);
        return NextResponse.json(worker.activityName)
    } catch (error) {
        console.error('Failed to update worker:', error);
        
    }
}

