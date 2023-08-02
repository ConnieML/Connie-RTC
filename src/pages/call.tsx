import { Call, Device } from '@twilio/voice-sdk';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Worker } from 'twilio-taskrouter';

import Navbar from '@/components/Navbar';
import AgentSection from '@/components/AgentSection';
import IncomingCallModal from '@/components/IncomingCallModal';

export default function CallPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const device = useRef<any>(null);
  const worker = useRef<any>(null);
  const taskId = useRef(null);
  const [call, setCall] = useState<Call | null>(null);
  const [inCall, setInCall] = useState(false);

  const [number, setNumber] = useState('');

  const [deviceLoaded, setDeviceLoaded] = useState(false);
  const [identity, setIdentity] = useState('');

  const [incomingCall, setIncomingCall] = useState(false);

  async function initializeDevice(client: string) {
    const token = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/token?client=${client}`
    );

    const value = await token.json();

    setIdentity(value.identity);

    device.current = new Device(value.token, {
      logLevel: 1,
      codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
    });

    addDeviceListeners(device.current);
    await device.current.register();

    setDeviceLoaded(true);
  }

  const makeCall = async (event: KeyboardEvent | MouseEvent) => {
    console.log(number);
    if (
      (event instanceof KeyboardEvent && event.key === 'Enter') ||
      event instanceof MouseEvent
    ) {
      const params = {
        // get the phone number to call from the DOM
        To: numberInputRef.current?.value,
      };
      if (device) {
        const call = await device.current.connect({ params });
        setInCall(true);
        call.on('disconnect', () => {
          console.log('you disconnected');
          setInCall(false);
          setIncomingCall(false);
        });
      }
    }
  };

  function endCall() {
    if (device) {
      device.current.disconnectAll();
      setInCall(false);
      console.log('You hung up!');
    }
  }

  function addDeviceListeners(device: Device) {
    device.on('registered', function () {
      console.log('Twilio.Device Ready to make and receive calls!');
    });

    device.on('error', function (error: { message: string }) {
      console.log('Twilio.Device Error: ' + error.message);
    });

    device.on('incoming', handleIncomingCall);

    device.on('registering', (device) => {
      // Do something
      console.log('HI this ran');
    });

    device.on('unregistered', (device) => {
      // Do something
      console.log('HI this ran 2');
    });
  }

  const acceptCall = () => {
    console.log('accepting call');
    setIncomingCall(false);
    setInCall(true);
    call?.accept();
  };

  const handleIncomingCall = (call: Call) => {
    setIncomingCall(true);
    setCall(call);
    console.log('call incoming!!!');
    // call.on('cancel', () => alert('CANCEL'));
    call.on('disconnect', () => {
      console.log(worker.current);
      console.log(taskId.current);

      fetch(
        `/api/tasks?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&taskSid=${taskId.current}`,
        {
          method: 'PUT',
          body: JSON.stringify({ assignmentStatus: 'completed' }),
        }
      );
    });
    // call.on('reject', () => alert('REJECT'));
  };

  const initializeWorker = async (client: string) => {
    const test = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/workerToken?client=${client}`
    );

    const value = await test.json();
    console.log(value);

    const newWorker = new Worker(value);

    worker.current = newWorker;

    newWorker.on('reservationCreated', (reservation) => {
      console.log(
        `Reservation ${reservation.sid} has been created for ${newWorker.sid}`
      );
      console.log(reservation.task.sid);
      taskId.current = reservation.task.sid;
      console.log(`Task attributes are: ${reservation.task.attributes}`);

      reservation.on('accepted', (acceptedReservation) => {
        // setTaskId(acceptedReservation.task.sid);
        console.log(`Reservation ${acceptedReservation.sid} was accepted.`);
      });

      // reservation
      //   .accept()
      //   .then((acceptedReservation) => {
      //     console.log(`Reservation status is ${acceptedReservation.status}`);
      //   })
      //   .catch((err) => {
      //     console.log(`Error: ${err}`);
      //   });
    });
    newWorker.on('reservation.canceled', function (reservation) {
      console.log(reservation.task.attributes); // {foo: 'bar', baz: 'bang' }
      console.log(reservation.task.priority); // 1
      console.log(reservation.task.age); // 300
      console.log(reservation.task.sid); // WTxxx
      console.log(reservation.sid); // WRxxx
    });
  };
  useEffect(() => {
    if (status !== 'loading') {
      if (status === 'unauthenticated') {
        router.push('/');
      }
    }
  }, [status, router]);

  const [once, setOnce] = useState(true);
  useEffect(() => {
    if (status === 'authenticated' && once) {
      initializeDevice(session.user.email);
      initializeWorker(session.user.email);

      setOnce(false);
    }
  }, [initializeDevice, once, session, status]);

  if (!deviceLoaded) {
    return <div>Loading</div>;
  }

  // basic auth logic
  if (status === 'loading' && !session) {
    return <React.Fragment>Loading...</React.Fragment>;
  }

  return (
    <main className="flex flex-col w-screen h-screen box-border">
      <Navbar />
      <section className="flex flex-row h-full w-screen">
        <AgentSection
          number={number}
          setNumber={setNumber}
          acceptCall={acceptCall}
        />
      </section>
      {incomingCall && (
        <IncomingCallModal acceptCall={acceptCall} endCall={endCall} />
      )}
    </main>
  );
}
