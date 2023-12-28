import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';

export default function ClientSideAuth() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <React.Fragment>Loading...</React.Fragment>;
  }

  if (session) {
    return (
      <React.Fragment>
        Welcome {session.user.name} - {session.userType}{' '}
        <button onClick={() => signOut()}>Sign out</button>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <button onClick={() => signIn()}>Sign in</button>
    </React.Fragment>
  );
}
