"use client";
import { formatPhoneNumber, formatTime } from "@/lib/utils";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Phone,
  Delete,
  MicOff,
  Video,
  PauseCircle,
  MessageSquare,
  Hash,
  StickyNote,
} from "lucide-react";

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
    <article className={`flex flex-col justify-between items-center h-full`}>
      {!inCall ? (
        <>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              value={formatPhoneNumber(number)}
              disabled={inCall}
              placeholder="Type phone number"
              onChange={(e) => setNumber(e.target.value)}
              className="text-lg"
            />
            <DeleteButton
              updateNumber={() =>
                setNumber(number.substring(0, number.length - 1))
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-x-8 gap-y-1 py-2">
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
          </div>
          <CallButton makeCall={() => makeCall(number)} />
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-y-2">
            <div className="text-xl">{formatPhoneNumber(number)}</div>
            <div className="text-[#A3A3A3] text-lg">
              <CallTimer />
            </div>
            <div className="grid grid-cols-3 gap-x-8 gap-y-1 pb-4">
              <DialKey keyValue="" subtext="Mute" onPress={onPress}>
                <MicOff className="h-8 w-8" />
              </DialKey>
              <DialKey keyValue="" subtext="Video" onPress={onPress}>
                <Video className="h-8 w-8" />
              </DialKey>
              <DialKey keyValue="" subtext="Notes" onPress={onPress}>
                <StickyNote className="h-8 w-8" />
              </DialKey>
              <DialKey keyValue="" subtext="Hold" onPress={onPress}>
                <PauseCircle className="h-8 w-8" />
              </DialKey>
              <DialKey keyValue="" subtext="Dialpad" onPress={onPress}>
                <Hash className="h-8 w-8" />
              </DialKey>
              <DialKey keyValue="" subtext="SMS" onPress={onPress}>
                <MessageSquare className="h-8 w-8" />
              </DialKey>
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
  children,
}: {
  keyValue: string;
  subtext?: string;
  onPress: (value: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      className="h-16 w-16 flex flex-col justify-start items-center"
      onClick={() => onPress(keyValue)}
    >
      <div className="text-black text-xl">{keyValue}</div>
      {children}
      <div className="text-[#A3A3A3] text-xl">{subtext}</div>
    </Button>
  );
}

function CallButton({ makeCall }: { makeCall: () => void }) {
  return (
    <Button
      className="bg-[#22C55E] hover:bg-[#22C55E]/80 w-fit text-lg"
      onClick={makeCall}
    >
      <Phone className="mr-2 h-4 w-4" /> Call
    </Button>
  );
}

function DeleteButton({ updateNumber }: { updateNumber: () => void }) {
  return (
    <Button variant="ghost" size="icon" onClick={updateNumber}>
      <Delete className="text-slate-500 h-26 w-31" />
    </Button>
  );
}

function EndCallButton({ endCall }: { endCall: () => void }) {
  return (
    <Button
      className="bg-[#EF4444] hover:bg-[#EF4444]/90 w-fit text-lg"
      onClick={endCall}
    >
      <Phone className="mr-2 h-4 w-4" /> End
    </Button>
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
