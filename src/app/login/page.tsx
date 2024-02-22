'use client';

import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React from 'react';

export default function Login() {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <React.Fragment>Loading...</React.Fragment>;
  }
  if (session) {
    redirect('/dashboard');
  }

  return (
    <React.Fragment>
      <button onClick={() => signIn('okta')}>Sign in with Okta</button>
    </React.Fragment>
  );
}
