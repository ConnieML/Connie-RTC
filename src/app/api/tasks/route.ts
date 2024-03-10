import { NextRequest } from 'next/server';
import { twilioClient } from '@/lib/twilioClient';


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const workspaceSid = process.env.TWILIO_WORKSPACE_SID || '';
const client = require('twilio')(accountSid, authToken);

// TODO: Update to follow proper REST api standards.
// Dequeue a reservation to connect the call
export async function POST(req: NextRequest) {
    try {
        const reservation = req.nextUrl.searchParams.get('reservationSid');
        const task = req.nextUrl.searchParams.get('taskSid');
        const number = req.nextUrl.searchParams.get('number');

        client.taskrouter.v1.workspaces(workspaceSid)
            .tasks(task)
            .reservations(reservation)
            .update({
                instruction: 'dequeue',
                dequeueFrom: number, // The phone number the call is connected from
            })
            .catch((error: any) => console.error(error));

        return new Response("dequeued", { status: 200 });
    } catch (error) {
        return new Response("something went wrong", { status: 500 });
    }
}