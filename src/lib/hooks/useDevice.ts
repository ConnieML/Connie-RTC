import { useRef } from 'react';

export default function useDevice() {
  const device = useRef<any>(null);
}

export async function initializeDevice(client: string) {
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
