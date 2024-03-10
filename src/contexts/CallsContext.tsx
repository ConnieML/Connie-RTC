import React from 'react';

export type CallsContextType = {
    inCall: boolean;
    number: string;
    makeCall: (number: string) => Promise<void>;
    setNumber: React.Dispatch<React.SetStateAction<string>>;
    endCall: () => void;
    incomingCall: boolean;
    acceptCall: () => void;
    rejectCall: () => void;
    updateReservation: (reservation: any, status: string) => void;
    activeTasks: any[];
    dequeueTask: (task: any, number: string) => void;
  };
  

const CallsContext = React.createContext<CallsContextType>({
  inCall: false,
  number: "",
  makeCall: async () => {},
  setNumber: () => {},
  endCall: () => {},
  incomingCall: false,
  acceptCall: () => {},
  rejectCall: () => {},
  updateReservation: () => {},
  activeTasks: [],
  dequeueTask: () => {}
});

export default CallsContext;