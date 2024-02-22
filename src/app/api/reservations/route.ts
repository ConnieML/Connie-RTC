import { NextRequest } from 'next/server';
import { twilioClient } from '../../../lib/twilioClient';

const workspaceSid = process.env.TWILIO_WORKSPACE_SID || "";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

// get all reservations assigned to a worker, and the task associated with each reservation
export async function GET(req: NextRequest) {
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

        const tasks = await Promise.all(reservations.map(async (reservation) => {
            const task = await twilioClient.taskrouter.v1.workspaces(workspaceSid)
                .tasks(reservation.taskSid)
                .fetch();

            return { task: task, reservation: reservation }
        }));

        return new Response(JSON.stringify(tasks), { status: 200 });
    } catch (error) {
        return new Response("something went wrong", { status: 500 });
    }
}

// Update reservation status
export async function POST(req: NextRequest) {

    try {
        const task = req.nextUrl.searchParams.get('taskSid');
        const status = req.nextUrl.searchParams.get('status');
        const reservationSid = req.nextUrl.searchParams.get('reservationSid');

        client.taskrouter.v1.workspaces(workspaceSid)
            .tasks(task)
            .reservations(reservationSid)
            .update({ reservationStatus: status })

        return new Response(`updated to ${status}`, { status: 200 });

    } catch (error) {
        return new Response("something went wrong", { status: 500 });
    }
}