import { NextRequest } from 'next/server';
import { twilioClient } from '@/lib/twilioClient';

export async function GET(req: NextRequest) {
    const workspaceSid = process.env.TWILIO_WORKSPACE_SID || "";
    const workerSid = req.nextUrl.searchParams.get('workerSid');

    if (!workspaceSid) {
        throw new Error('TWILIO_WORKSPACE_SID is not set');
    }

    if (!workerSid) {
        throw new Error('Worker sid is not provided');
    }

    try {
        const reservations = await twilioClient.taskrouter.v1.workspaces(workspaceSid)
            .workers(workerSid)
            .reservations
            .list();

        // console.log(reservations)

        const tasks = await Promise.all(reservations.map(async (reservation) => {
            const task = await twilioClient.taskrouter.v1.workspaces(workspaceSid)
                .tasks(reservation.taskSid)
                .fetch();
            return { task: task, reservation: reservation}
        }));

        // console.log("DASDASD")
        // console.log(tasks)

        return new Response(JSON.stringify(tasks), { status: 200 });
    } catch (error) {
        return new Response("something went wrong", { status: 500 });
    }
}