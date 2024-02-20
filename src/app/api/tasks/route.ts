import { NextRequest } from 'next/server';
import { twilioClient } from '@/lib/twilioClient';

export async function GET(req: NextRequest) {
    const workspaceSid = process.env.TWILIO_WORKSPACE_SID || "";
    const workerSid = req.nextUrl.searchParams.get('workerSid');

    if (!workspaceSid) {
        throw new Error('TWILIO_WORKSPACE_SID is not set');
    }

    try {
        const tasks = await twilioClient.taskrouter.v1
            .workspaces(workspaceSid)
            .tasks
            .list();

        console.log(tasks);

        return new Response(JSON.stringify(tasks), { status: 200 });
    } catch (error) {
        return new Response("something went wrong", { status: 500 });
    }
}