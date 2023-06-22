import { Call, Device } from '@twilio/voice-sdk';
import { useEffect, useRef, useState } from 'react';

export default function CallPage() {
  const device = useRef<any>(null);
  const [call, setCall] = useState(null);
  const [number, setNumber] = useState(null);
  const [deviceLoaded, setDeviceLoaded] = useState(false);
  const [identity, setIdentity] = useState('');

  const [incomingCall, setIncomingCall] = useState(false);

  async function initializeDevice() {
    const test = await fetch('http://localhost:3000/api/token');

    const value = await test.json();

    setIdentity(value.identity);

    device.current = new Device(value.token, {
      logLevel: 1,
      codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
    });

    addDeviceListeners(device.current);
    await device.current.register();

    setDeviceLoaded(true);
  }

  useEffect(() => {
    initializeDevice();
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
      To: number,
    };

    if (device) {
      const call = await device.current.connect({ params });

      call.on('accept', () => alert('ACCEPT'));
      call.on('disconnect', () => alert('DISCONNECT'));
      call.on('cancel', () => alert('CANCEL'));
    }
  };

  if (!deviceLoaded) {
    return <div>Loading</div>;
  }
  return (
    <main className="w-screen h-screen flex flex-col">
      <h1 className="text-3xl">Welcome back {identity}</h1>
      <div>
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
          {incomingCall && <button onClick={acceptCall}>Accept Call</button>}
        </section>
      </div>
    </main>
  );
}
