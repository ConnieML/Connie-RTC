import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useEffect, useState } from 'react';

import Navbar from '@/components/Navbar';
import AgentSection from '@/components/AgentSection';
import IncomingCallModal from '@/components/IncomingCallModal';
import useCalls from '@/lib/hooks/useCalls';
import DialPad from '@/components/DialPad';

export default function CallPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    activityName,
    agentActivities,
    initialized,
    inCall,
    incomingCall,
    worker,
    makeCall,
    setActivityName,
    acceptCall,
    endCall,
    rejectCall,
  } = useCalls({
    session,
  });

  // Fetch agent data here

  const [number, setNumber] = useState('');

  useEffect(() => {
    if (status !== 'loading') {
      if (status === 'unauthenticated') {
        router.push('/');
      }
    }
  }, [status, router]);

  // basic auth logic
  if (!initialized) {
    return <React.Fragment>Loading...</React.Fragment>;
  }

  console.log(session);
  console.log('NEW');
  return (
    <main className="flex flex-col w-screen h-screen box-border">
      <Navbar />
      <section className="grid grid-cols-[2fr_1fr] h-full w-screen justify-center items-center">
        <div className="h-full w-full pl-20 pt-10">
          <AgentSection
            agentActivity={activityName}
            agentActivities={agentActivities ?? []}
            inCall={inCall}
            number={number}
            worker={worker}
            makeCall={makeCall}
            setActivityName={setActivityName}
            setNumber={setNumber}
          />
        </div>
        <div className="h-full w-full">
          <DialPad
            number={number}
            inCall={inCall}
            setNumber={setNumber}
            makeCall={makeCall}
            endCall={endCall}
          />
        </div>
      </section>
      {incomingCall && (
        <IncomingCallModal acceptCall={acceptCall} rejectCall={rejectCall} />
      )}
    </main>
  );
}
