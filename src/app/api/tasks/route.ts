import { NextRequest } from 'next/server';
import { twilioClient } from '@/lib/twilioClient';


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const workspaceSid = process.env.TWILIO_WORKSPACE_SID || '';
const client = require('twilio')(accountSid, authToken);

export async function POST(req: NextRequest) {
    try {
        const worker = req.nextUrl.searchParams.get('client');
        const reservation = req.nextUrl.searchParams.get('reservationSid');
        const task = req.nextUrl.searchParams.get('taskSid');

        console.log(" worker:", worker);
        console.log(" reservation:", reservation);
        console.log(" task:", task)

        client.taskrouter.v1.workspaces(workspaceSid)
            .tasks(task)
            .reservations(reservation)
            .update({
                instruction: 'dequeue',
                dequeueFrom: '+16134002002', // The phone number the call is connected from
                // to: 'client:atsarapk@uwaterloo.ca' // The client to connect the call to
            })
            .then((reservation: { reservationStatus: any; }) => console.log(reservation.reservationStatus))
            .catch((error: any) => console.error(error));

            //{"contact_uri":"client:atsarapk@uwaterloo.ca"}
        return new Response("dequeued", { status: 200 });
    } catch (error) {
        return new Response("something went wrong", { status: 500 });
    }
}