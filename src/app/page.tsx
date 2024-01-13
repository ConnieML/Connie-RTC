"use client";
import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';


export default function Home() {
  const {data: session, status} = useSession();
  if (status === 'loading') {
    return <React.Fragment>Loading...</React.Fragment>;
  }
  if (session) {
    console.log(session);
    return (
      <React.Fragment>
        {/* the line below breaks the build and gives syntax errors, but works fine when deployed */}
        {/* Welcome to the dashboard {session.user.name} - {session.userType}{' '} */}
        <button onClick={() => signOut()}>Sign out</button>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <button onClick={() => signIn('okta')}>Sign in with Okta</button>
    </React.Fragment>
  );
}
