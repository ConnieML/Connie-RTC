import { Call, Device } from '@twilio/voice-sdk';

import { useEffect, useRef, useState } from 'react';
import { Reservation, Worker } from 'twilio-taskrouter';
import { Activity } from '../taskrouterInterfaces';
import { WorkerInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';

export default function useCalls({
  email,
  workerSid,
  friendlyName,
}: {
  email: string | undefined;
  workerSid: string | undefined;
  friendlyName: string;
}) {
  const [initialized, setInitialized] = useState(false);
  const device = useRef<Device | null>(null);
  const worker = useRef<Worker | null>(null);
  const taskSid = useRef<string | null>(null);
  const call = useRef<Call | null>(null);
  const agentActivities = useRef<Activity[] | null>(null);

  const [number, setNumber] = useState('');
  const [incomingCall, setIncomingCall] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [activityName, setActivityName] = useState<string>('Available');

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

      reservation.on('accepted', async (acceptedReservation: Reservation) => {
        console.log(`Reservation ${acceptedReservation.sid} was accepted.`);

        try {
          // Turn agent activity status to reserved to prevent agent from receiving incoming calls
          const reservedActivity = agentActivities.current?.find(
            (activity) => activity.friendlyName === 'Reserved'
          );

          await fetch(
            `/api/workers/?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&workerSid=${worker.current?.sid}`,
            {
              method: 'PUT',
              body: JSON.stringify({
                activitySid: reservedActivity?.sid,
              }),
            }
          )
            .then(async (data) => {
              setActivityName(reservedActivity?.friendlyName ?? activityName);
            })
            .catch((e) => alert('Failed to update activity name'));
        } catch (e) {
          console.log(e);
        }
      });

      reservation.on('canceled', (acceptedReservation: Reservation) => {
        console.log(`Reservation ${acceptedReservation.sid} was canceled.`);
        setIncomingCall(false);
        call.current?.disconnect();
      });
    });
    /**
     * This section handles any errors during the websocket connection
     */
    worker.current.on('disconnected', (reservation: Reservation) => {
      console.log(
        `Reservation ${reservation.sid} has been created for ${
          worker.current!.sid
        }`
      );

      alert('You have been disconnected. Please refresh the page to reconnect');
    });

    worker.current.on('error', (reservation: Reservation) => {
      console.log(
        `Reservation ${reservation.sid} has been created for ${
          worker.current!.sid
        }`
      );

      alert('You have been disconnected. Please refresh the page to reconnect');
    });

    worker.current.on('tokenExpired', (reservation: Reservation) => {
      console.log(
        `Reservation ${reservation.sid} has been created for ${
          worker.current!.sid
        }`
      );

      alert('You have been disconnected. Please refresh the page to reconnect');
    });
  };

  const initializeDeviceListeners = () => {
    if (!device.current) return;
    console.log('ANNOYED');
    device.current.on('registered', function () {
      console.log('Twilio.Device Ready to make and receive calls!');
    });

    device.current.on('error', function (error: { message: string }) {
      console.log('Twilio.Device Error: ' + error.message);
    });

    device.current.on('incoming', (incomingCall: Call) => {
      setIncomingCall(true);
      setNumber(incomingCall.parameters.From);

      call.current = incomingCall;

      incomingCall.on('cancel', () => {
        setIncomingCall(false);
      });

      incomingCall.on('reject', () => {
        setIncomingCall(false);
        setNumber('');
      });

      incomingCall.on('disconnect', () => {
        if (taskSid.current) {
          fetch(
            `/api/tasks?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&taskSid=${taskSid.current}`,
            {
              method: 'PUT',
              body: JSON.stringify({ assignmentStatus: 'completed' }),
            }
          );
        }
        setInCall(false);
        setNumber('');
      });
    });
  };

  useEffect(() => {
    if (email && !initialized) {
      const initializeCalls = async () => {
        await Promise.all([
          await initializeDevice(email).then((newDevice) => {
            device.current = newDevice;
            initializeDeviceListeners();
          }),

          await initializeWorker(workerSid, email, friendlyName).then(
            async (newWorker) => {
              worker.current = newWorker!;
              initializeWorkerListeners();

              await fetch(
                `/api/workers/?workspaceSid=${
                  process.env.NEXT_PUBLIC_WORKSPACE_SID
                }&workerSid=${newWorker!.sid}`
              ).then(async (data) => {
                const worker = await data.json();
                setActivityName(worker.worker.activityName);
              });
            }
          ),
          await fetch(
            `/api/activities/?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}`
          ).then(async (data) => {
            const activities = await data.json();
            agentActivities.current = activities.activities;
          }),
        ]).then(() => setInitialized(true));
      };

      initializeCalls();
    }
  }, [initialized, email]);

  const makeCall = async (number: string) => {
    if (!device.current) return;

    const params = {
      // get the phone number to call from the DOM
      To: number,
    };

    const newCall = await device.current.connect({ params });

    call.current = newCall;

    // Turn agent activity status to reserved to prevent agent from receiving incoming calls
    const reservedActivity = agentActivities.current?.find(
      (activity) => activity.friendlyName === 'Reserved'
    );

    await fetch(
      `/api/workers/?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&workerSid=${worker.current?.sid}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          activitySid: reservedActivity?.sid,
        }),
      }
    )
      .then(async (data) => {
        setActivityName(reservedActivity?.friendlyName ?? activityName);
      })
      .catch((e) => alert('Failed to update activity name'));

    setInCall(true);

    // Check if I should use this
    newCall.on('disconnect', () => {
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
    if (!call.current) return;

    call.current.disconnect();
    setIncomingCall(false);
    setInCall(false);
    setNumber('');
  }

  const acceptCall = async () => {
    if (call.current === null) return;

    setIncomingCall(false);
    setInCall(true);
    call.current.accept();
  };

  return {
    activityName,
    agentActivities: agentActivities.current,
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

const initializeWorker = async (
  workerSid: string | undefined,
  email: string,
  friendlyName: string
) => {
  try {
    if (!workerSid) {
      throw `The user ${friendlyName} with email ${email} does not have an employeeNumber in Okta`;
    }
    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/workerToken?email=${email}&workerSid=${workerSid}`
    );

    if (tokenResponse.status !== 200) {
      throw `Failed to generate valid token for ${friendlyName} with email ${email}`;
    }

    const token = await tokenResponse.json();

    const worker = new Worker(token);
    await timeout(1000);
    return worker;
  } catch (e) {
    console.error(e);
  }
};

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
