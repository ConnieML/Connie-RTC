import { GetServerSideProps } from 'next';

import { Call, Device } from '@twilio/voice-sdk';
import { useEffect, useRef, useState } from 'react';

export default function CallPage({ test }) {
  const device = useRef<any>(null);
  const [call, setCall] = useState(null);
  const [number, setNumber] = useState(null);

  const [incomingCall, setIncomingCall] = useState(false);

  useEffect(() => {
    device.current = new Device(test.token, {
      logLevel: 1,
      codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
    });

    addDeviceListeners(device.current);
    device.current.register();
  });

  function addDeviceListeners(device) {
    device.on('registered', function () {
      console.log('Twilio.Device Ready to make and receive calls!');
    });

    device.on('error', function (error) {
      console.log('Twilio.Device Error: ' + error.message);
    });

    device.on('incoming', handleIncomingCall);
  }

  const acceptCall = () => {
    setIncomingCall(false);
    call.accept();
  };

  const handleIncomingCall = (call) => {
    setIncomingCall(true);
    setCall(call);

    call.on('cancel', () => alert('CANCEL'));
    call.on('disconnect', () => alert('DISCONNECT'));
    call.on('reject', () => alert('REJECT'));
  };

  const makeCall = async () => {
    const params = {
      // get the phone number to call from the DOM
      To: '+19132441797',
    };

    if (device) {
      const call = await device.current.connect({ params });

      call.on('accept', () => alert('ACCEPT'));
      call.on('disconnect', () => alert('DISCONNECT'));
      call.on('cancel', () => alert('CANCEL'));

      // outgoingCallHangupButton.onclick = () => {
      //   log('Hanging up ...');
      //   call.disconnect();
      // };
    }
  };
  return (
    <main className="w-screen h-screen flex flex-col">
      <h1 className="text-3xl">Welcome back {test.identity}</h1>
      <section className="flex flex-col gap-y-4 bg-gray-100 h-80 w-80 p-4">
        <h2 className="text-xl">Make Outgoing Call</h2>
        <input
          onChange={(e) => setNumber(e.target.value)}
          value={number}
          placeholder="Enter number here"
          className="w-40"
        />
        <button className="w-20 bg-gray-300 " onClick={makeCall}>
          Call
        </button>
      </section>
      {incomingCall && <button onClick={acceptCall}>Accept Call</button>}{' '}
      <div>Test</div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const test = await fetch('http://localhost:3000/api/token');

  const value = await test.json();

  return {
    props: { test: value },
  };
};
