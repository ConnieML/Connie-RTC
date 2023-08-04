import { Call, Device } from '@twilio/voice-sdk';
import { Session } from 'next-auth';
import { useEffect, useRef, useState } from 'react';
import { Reservation, Worker } from 'twilio-taskrouter';
import { Activity } from '../taskrouterInterfaces';

export default function useCalls({ session }: { session: Session | null }) {
  const [initialized, setInitialized] = useState(false);
  const device = useRef<Device | null>(null);
  const worker = useRef<Worker | null>(null);
  const taskSid = useRef<string | null>(null);
  const call = useRef<Call | null>(null);

  const [number, setNumber] = useState('');
  const [incomingCall, setIncomingCall] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [activityName, setActivityName] = useState<string>('Available');
  const [agentActivities, setAgentActivities] = useState<Activity[] | null>(
    null
  );

  const initializeWorkerListeners = () => {
    if (!worker.current) return;

    worker.current.on('reservationCreated', (reservation: Reservation) => {
      console.log(
        `Reservation ${reservation.sid} has been created for ${
          worker.current!.sid
        }`
      );

      taskSid.current = reservation.task.sid;
      console.log(`Task attributes are: ${reservation.task.attributes}`);

      reservation.on('accepted', (acceptedReservation: Reservation) => {
        console.log(`Reservation ${acceptedReservation.sid} was accepted.`);
      });

      reservation.on('canceled', (acceptedReservation: Reservation) => {
        console.log(`Reservation ${acceptedReservation.sid} was canceled.`);
        setIncomingCall(false);
        call.current?.disconnect();
      });
    });
  };

  const initializeDeviceListeners = () => {
    if (!device.current) return;
    device.current.on('registered', function () {
      console.log('Twilio.Device Ready to make and receive calls!');
    });

    device.current.on('error', function (error: { message: string }) {
      console.log('Twilio.Device Error: ' + error.message);
    });

    device.current.on('incoming', (incomingCall: Call) => {
      setIncomingCall(true);

      call.current = incomingCall;

      incomingCall.on('cancel', () => {
        setIncomingCall(false);
      });

      incomingCall.on('reject', () => {
        setIncomingCall(false);
      });

      incomingCall.on('disconnect', () => {
        if (inCall) {
          fetch(
            `/api/tasks?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&taskSid=${taskSid.current}`,
            {
              method: 'PUT',
              body: JSON.stringify({ assignmentStatus: 'completed' }),
            }
          );
        }
        setInCall(false);
      });
    });
  };

  useEffect(() => {
    async function initializeCalls() {
      if (session && !initialized) {
        await Promise.all([
          await initializeDevice(session.user.email).then((newDevice) => {
            device.current = newDevice;
            initializeDeviceListeners();
          }),
          await initializeWorker(session.user.email).then(async (newWorker) => {
            worker.current = newWorker;
            initializeWorkerListeners();

            await fetch(
              `/api/workers/?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&workerSid=${newWorker.sid}`
            ).then(async (data) => {
              const worker = await data.json();
              setActivityName(worker.worker.activityName);
            });
          }),
          await fetch(
            `/api/activities/?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}`
          ).then(async (data) => {
            const activities = await data.json();
            setAgentActivities(activities.activities);
          }),
        ]),
          setInitialized(true);
      }
    }

    initializeCalls();
  }, [initialized, session]);

  const makeCall = async (number: string) => {
    if (!device.current) return;

    const params = {
      // get the phone number to call from the DOM
      To: number,
    };

    const call = await device.current.connect({ params });

    // Turn agent activity status to unavailable to prevent agent from receiving incoming calls
    const unavailableActivity = agentActivities?.find(
      (activity) => activity.friendlyName === 'Unavailable'
    );

    await fetch(
      `/api/workers/?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&workerSid=${worker.current?.sid}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          activitySid: unavailableActivity?.sid,
        }),
      }
    )
      .then(async (data) => {
        setActivityName(unavailableActivity?.friendlyName ?? activityName);
      })
      .catch((e) => alert('Failed to update activity name'));

    setInCall(true);
    call.on('disconnect', () => {
      console.log('you disconnected');
      setInCall(false);
      setIncomingCall(false);
    });
  };

  function rejectCall() {
    if (!device.current) return;
    call.current?.reject();
    setIncomingCall(false);
  }

  function endCall() {
    if (!device.current) return;

    device.current.disconnectAll();
    setIncomingCall(false);
    setInCall(false);
  }

  const acceptCall = () => {
    if (call.current === null) return;
    setIncomingCall(false);
    setInCall(true);
    call.current.accept();
  };

  return {
    activityName,
    agentActivities,
    initialized,
    inCall,
    incomingCall,
    worker: worker.current,
    number,
    makeCall,
    setActivityName,
    setNumber,
    acceptCall,
    endCall,
    rejectCall,
  };
}

async function initializeDevice(client: string) {
  const token = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/token?client=${client}`
  );

  const value = await token.json();

  const device = new Device(value.token, {
    logLevel: 1,
    codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
  });

  await device.register();
  return device;
}

const initializeWorker = async (client: string) => {
  const rawToken = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/workerToken?client=${client}`
  );

  const token = await rawToken.json();

  const worker = new Worker(token);
  await timeout(1000);
  return worker;
};

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
