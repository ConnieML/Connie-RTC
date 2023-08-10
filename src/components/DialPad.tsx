import { formatPhoneNumber, formatTime } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function DialPad({
  number,
  inCall,
  setNumber,
  makeCall,
  endCall,
}: {
  number: string;
  inCall: boolean;
  setNumber: (number: string) => void;
  makeCall: (number: string) => void;
  endCall: () => void;
}) {
  const onPress = (value: string) => setNumber(number.concat(value));

  return (
    <article
      className={`flex flex-col justify-between items-center py-8 ${
        !inCall ? 'bg-white text-black' : 'bg-black text-white'
      } h-full`}
    >
      {!inCall ? (
        <>
          <div className="px-8">
            <input
              value={formatPhoneNumber(number)}
              disabled={inCall}
              placeholder="Type phone number"
              className="border-0 text-center text-4xl w-full"
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-x-14 gap-y-8">
            <DialKey keyValue="1" onPress={onPress} />
            <DialKey keyValue="2" subtext="ABC" onPress={onPress} />
            <DialKey keyValue="3" subtext="DEF" onPress={onPress} />
            <DialKey keyValue="4" subtext="GHI" onPress={onPress} />
            <DialKey keyValue="5" subtext="JKL" onPress={onPress} />
            <DialKey keyValue="6" subtext="MNO" onPress={onPress} />
            <DialKey keyValue="7" subtext="PQRS" onPress={onPress} />
            <DialKey keyValue="8" subtext="TUV" onPress={onPress} />
            <DialKey keyValue="9" subtext="WXYZ" onPress={onPress} />
            <DialKey keyValue="*" onPress={onPress} />
            <DialKey keyValue="0" subtext="+" onPress={onPress} />
            <DialKey keyValue="#" onPress={onPress} />
            <div></div>
            <GreenCallButton makeCall={() => makeCall(number)} />
            <DeleteButton
              updateNumber={() =>
                setNumber(number.substring(0, number.length - 1))
              }
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-y-2">
            <div className="text-4xl">{formatPhoneNumber(number)}</div>
            <div className="text-[#A3A3A3]">
              <CallTimer />
            </div>
          </div>
          <EndCallButton endCall={() => endCall()} />
        </>
      )}
    </article>
  );
}

function DialKey({
  keyValue,
  subtext,
  onPress,
}: {
  keyValue: string;
  subtext?: string;
  onPress: (value: string) => void;
}) {
  return (
    <button
      className="h-16 w-12 flex flex-col justify-start items-center"
      onClick={() => onPress(keyValue)}
    >
      <div className="text-black text-4xl">{keyValue}</div>
      <div className="text-[#A3A3A3] text-2xl">{subtext}</div>
    </button>
  );
}

function GreenCallButton({ makeCall }: { makeCall: () => void }) {
  return (
    <button
      className="rounded-full bg-[#22C55E] h-14 w-14 flex justify-center items-center"
      onClick={makeCall}
    >
      <svg
        width="33"
        height="30"
        viewBox="0 0 38 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M26.1601 22.7208L25.2122 23.6645C25.2122 23.6645 22.956 25.9062 16.7997 19.7854C10.6435 13.6645 12.8997 11.4229 12.8997 11.4229L13.4955 10.827C14.9685 9.36454 15.108 7.01454 13.8226 5.29787L11.1976 1.79162C9.60595 -0.333376 6.53303 -0.614626 4.71012 1.19787L1.43928 4.44787C0.537201 5.34787 -0.0669667 6.51037 0.00595 7.80204C0.19345 11.1083 1.68928 18.2187 10.031 26.5145C18.8789 35.3104 27.181 35.6604 30.5747 35.3437C31.6497 35.2437 32.583 34.6979 33.3351 33.9479L36.2935 31.0062C38.2935 29.0208 37.731 25.6145 35.1726 24.225L31.1935 22.0604C29.5143 21.1479 27.4726 21.4166 26.1601 22.7208Z"
          fill="white"
        />
      </svg>
    </button>
  );
}

function DeleteButton({ updateNumber }: { updateNumber: () => void }) {
  return (
    <button
      className="h-14 w-14 flex justify-center items-center"
      onClick={updateNumber}
    >
      <svg
        width="31"
        height="26"
        viewBox="0 0 31 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.5002 15.8193L18.6114 12.7082M18.6114 12.7082L21.7225 9.59711M18.6114 12.7082L15.5002 9.59711M18.6114 12.7082L21.7225 15.8193M1.50024 12.7082L11.4779 22.6859C12.0614 23.2693 12.8527 23.5971 13.6778 23.5971H26.3891C28.1074 23.5971 29.5002 22.2042 29.5002 20.486V4.93045C29.5002 3.21223 28.1074 1.81934 26.3891 1.81934H13.6778C12.8527 1.81934 12.0614 2.14711 11.4779 2.73056L1.50024 12.7082Z"
          stroke="#A3A3A3"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  );
}

function EndCallButton({ endCall }: { endCall: () => void }) {
  return (
    <button
      className="flex flex-row items-center justify-center gap-x-4 rounded-[200px] bg-[#EF4444] px-10 py-4"
      onClick={endCall}
    >
      <svg
        width="30"
        height="13"
        viewBox="0 0 30 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M28.75 7.625L25.625 10.75L21.875 8.25V3.0525C19.97 2.42125 17.6825 2 15 2C12.3187 2 10.03 2.42125 8.125 3.0525V8.25L4.375 10.75L1.25 7.625C2.08125 6.37875 4.34875 4.30375 8.125 3.0525C10.03 2.42125 12.3187 2 15 2C17.6825 2 19.97 2.42125 21.875 3.0525C25.6512 4.3025 27.9187 6.3775 28.75 7.625Z"
          fill="white"
        />
        <path
          d="M21.875 3.0525C19.97 2.42125 17.6825 2 15 2C12.3187 2 10.03 2.42125 8.125 3.0525M21.875 3.0525C25.6512 4.3025 27.9187 6.3775 28.75 7.625L25.625 10.75L21.875 8.25V3.0525ZM8.125 3.0525C4.34875 4.3025 2.08125 6.3775 1.25 7.625L4.375 10.75L8.125 8.25V3.0525Z"
          stroke="white"
          stroke-width="3.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <div className="text-xl">End</div>
    </button>
  );
}

function CallTimer() {
  // Timer
  const [callTimer, setCallTimer] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCallTimer((prevAge) => prevAge + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [callTimer]);

  return formatTime(callTimer);
}
