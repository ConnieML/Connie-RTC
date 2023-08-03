import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useEffect, useState } from 'react';

import Navbar from '@/components/Navbar';
import AgentSection from '@/components/AgentSection';
import IncomingCallModal from '@/components/IncomingCallModal';
import useCalls from '@/lib/hooks/useCalls';
import useAgentActivities from '@/lib/hooks/useAgentActivities';

export default function CallPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    activityName,
    agentActivities,
    initialized,
    incomingCall,
    worker,
    makeCall,
    setActivityName,
    acceptCall,
    endCall,
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

  return (
    <main className="flex flex-col w-screen h-screen box-border">
      <Navbar />
      <section className="flex flex-row h-full w-screen">
        <AgentSection
          agentActivity={activityName}
          agentActivities={agentActivities ?? []}
          number={number}
          worker={worker}
          makeCall={makeCall}
          setActivityName={setActivityName}
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
